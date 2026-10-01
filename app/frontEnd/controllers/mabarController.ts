import { courtHandler } from "~/backend/handlers/CourtHandler";
import { mabarHandler } from "~/backend/handlers/MabarHandler";
import type { MabarSession } from "~/backend/models/MabarModel";
import { sessionController } from "~/frontEnd/controllers/SessionController";
import { actionFail, actionOk, runAction } from "~/frontEnd/utils/actionResult";
import { formatPriceK, formatWhen } from "~/frontEnd/utils/format";
import { isSkillLevel } from "~/frontEnd/utils/labels";
import type { ActionResult } from "~/frontEnd/viewModels/ActionResult";
import type { MabarPageModel } from "~/frontEnd/viewModels/MabarPageModel";
import type { SkillLevel } from "~/backend/models/UserModel";

const mabarSkillLabels: Record<SkillLevel, string> = {
    beginner: "Beginner friendly",
    intermediate: "Intermediate",
    advanced: "Advanced",
};

const toCard = (s: MabarSession, userId: string) => ({
    id: s.id,
    skill: s.skill,
    skillLabel: mabarSkillLabels[s.skill],
    whenLabel: formatWhen(s.startsAt),
    title: s.title,
    meta: `${s.courtName} · ${s.format === "Casual" ? "Casual play" : s.format} · ${formatPriceK(s.pricePerPerson)}/person`,
    playersLabel: `${s.participantIds.length} / ${s.capacity} players`,
    joined: s.participantIds.includes(userId),
    full: s.participantIds.length >= s.capacity,
});

export const mabarController = {
    async getMabarPage(): Promise<MabarPageModel> {
        const user = await sessionController.requireUser();
        const [sessions, courts] = await Promise.all([mabarHandler.getAll(), courtHandler.getAll()]);

        return {
            sessions: sessions.map((s) => toCard(s, user.id)),
            courtOptions: courts.map((c) => c.name),
            skillOptions: (Object.keys(mabarSkillLabels) as SkillLevel[]).map((value) => ({
                value,
                label: mabarSkillLabels[value],
            })),
        };
    },

    joinSession(sessionId: string): Promise<ActionResult> {
        return runAction("join", async () => {
            const user = await sessionController.requireUser();
            try {
                await mabarHandler.join(sessionId, user.id);
            } catch (error) {
                const code = error instanceof Error ? error.message : "";
                if (code === "SESSION_FULL") return actionFail("join", "This session is full.");
                if (code === "SESSION_NOT_FOUND") return actionFail("join", "Session not found.");
                throw error;
            }
            return actionOk("join", "You're in! See you on court.");
        });
    },

    createSession(input: {
        title: string;
        courtName: string;
        skill: string;
        date: string;
        time: string;
        slots: number;
        price: number;
    }): Promise<ActionResult> {
        return runAction("create", async () => {
            const user = await sessionController.requireUser();

            if (input.title.length < 3 || input.title.length > 60) {
                return actionFail("create", "Session name must be 3 to 60 characters.");
            }
            const courts = await courtHandler.getAll();
            if (!courts.some((c) => c.name === input.courtName)) {
                return actionFail("create", "Choose a court from the list.");
            }
            if (!isSkillLevel(input.skill)) return actionFail("create", "Choose a skill level.");

            const startsAt = new Date(`${input.date}T${input.time}`);
            if (Number.isNaN(startsAt.getTime()) || startsAt.getTime() < Date.now()) {
                return actionFail("create", "Pick a date and time in the future.");
            }
            if (!Number.isInteger(input.slots) || input.slots < 1 || input.slots > 10) {
                return actionFail("create", "Slots needed must be between 1 and 10.");
            }
            if (!Number.isFinite(input.price) || input.price < 0 || input.price > 1_000_000) {
                return actionFail("create", "Enter a price between 0 and 1,000,000.");
            }

            await mabarHandler.create(
                {
                    title: input.title,
                    courtName: input.courtName,
                    skill: input.skill,
                    startsAt: startsAt.toISOString(),
                    capacity: input.slots + 1, // the host takes the first spot
                    pricePerPerson: input.price,
                },
                user.id,
            );
            return actionOk("create", "Your Mabar session is live.");
        });
    },
};
