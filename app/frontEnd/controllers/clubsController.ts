import { clubHandler } from "~/backend/handlers/clubHandler";
import { sessionController } from "~/frontEnd/controllers/sessionController";
import { actionFail, actionOk, runAction } from "~/frontEnd/utils/actionResult";
import type { ActionResult } from "~/frontEnd/viewModels/actionResult";
import type { ClubsPageModel } from "~/frontEnd/viewModels/clubsPageModel";

export const clubsController = {
    async getClubsPage(): Promise<ClubsPageModel> {
        const user = await sessionController.requireUser();
        const clubs = await clubHandler.getAll();

        return {
            clubs: clubs.map((c) => ({
                id: c.id,
                name: c.name,
                meta: `${c.memberCount} members · ${c.area}`,
                schedule: c.schedule,
                imageUrl: c.imageUrl,
                imageAlt: c.imageAlt,
                joined: c.memberIds.includes(user.id),
            })),
        };
    },

    joinClub(clubId: string): Promise<ActionResult> {
        return runAction("join", async () => {
            const user = await sessionController.requireUser();
            try {
                await clubHandler.join(clubId, user.id);
            } catch (error) {
                if (error instanceof Error && error.message === "CLUB_NOT_FOUND") {
                    return actionFail("join", "Club not found.");
                }
                throw error;
            }
            return actionOk("join", "Welcome to the club!");
        });
    },
};
