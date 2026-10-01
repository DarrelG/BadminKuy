import { scoreHandler } from "~/backend/handlers/scoreHandler";
import { sessionController } from "~/frontEnd/controllers/sessionController";
import { actionFail, actionOk, runAction } from "~/frontEnd/utils/actionResult";
import { skillLabels } from "~/frontEnd/utils/labels";
import type { ActionResult } from "~/frontEnd/viewModels/actionResult";
import type { ScorePageModel } from "~/frontEnd/viewModels/scorePageModel";

const signed = (n: number): string => (n > 0 ? `+${n}` : String(n));

export const scoreController = {
    async getScorePage(): Promise<ScorePageModel> {
        const profile = await sessionController.requireProfile();
        const [rating, samples] = await Promise.all([
            scoreHandler.getRating(profile.id),
            scoreHandler.getTournamentSamples(),
        ]);

        return {
            defaultPlayerA: profile.displayName,
            ratingLabel: rating.rating.toLocaleString("en-US"),
            deltaLabel: signed(rating.lastDelta),
            levelLabel: profile.skillLevel ? skillLabels[profile.skillLevel] : "Player",
            tournamentFormats: samples.map((s) => ({ name: s.format, title: s.title, lines: s.lines })),
        };
    },

    saveMatch(input: {
        playerA: string;
        playerB: string;
        scoreA: number;
        scoreB: number;
    }): Promise<ActionResult> {
        return runAction("match", async () => {
            const user = await sessionController.requireUser();

            if (input.playerA.length < 2 || input.playerB.length < 2) {
                return actionFail("match", "Enter both player names.");
            }
            if (input.playerB.length > 40) return actionFail("match", "Opponent name is too long.");
            const validScore = (n: number) => Number.isInteger(n) && n >= 0 && n <= 99;
            if (!validScore(input.scoreA) || !validScore(input.scoreB)) {
                return actionFail("match", "Scores must be whole numbers from 0 to 99.");
            }
            if (input.scoreA === input.scoreB) {
                return actionFail("match", "A match can't end in a tie.");
            }

            const rating = await scoreHandler.recordMatch({ userId: user.id, ...input });
            return actionOk("match", `Match recorded. Rating ${signed(rating.lastDelta)}.`);
        });
    },
};
