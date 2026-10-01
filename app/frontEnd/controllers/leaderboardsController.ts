import { scoreHandler } from "~/backend/handlers/ScoreHandler";
import type { LeaderboardScope } from "~/backend/models/ScoreModel";
import { sessionController } from "~/frontEnd/controllers/SessionController";
import { initialsOf } from "~/frontEnd/utils/format";
import type { LeaderboardsPageModel } from "~/frontEnd/viewModels/LeaderboardsPageModel";

const scopes: LeaderboardScope[] = ["jakarta", "club", "month"];

export const leaderboardsController = {
    async getLeaderboardsPage(tabParam: string | null): Promise<LeaderboardsPageModel> {
        await sessionController.requireUser();

        const active = scopes.find((s) => s === tabParam) ?? "jakarta";
        const entries = await scoreHandler.getLeaderboard(active);
        const monthName = new Date().toLocaleDateString("en-US", { month: "long" });
        const labels: Record<LeaderboardScope, string> = {
            jakarta: "Jakarta",
            club: "Club",
            month: monthName,
        };

        return {
            tabs: scopes.map((key) => ({ key, label: labels[key], active: key === active })),
            entries: entries.map((e) => ({
                rank: String(e.rank).padStart(2, "0"),
                initials: initialsOf(e.name),
                name: e.name,
                place: e.place,
                scoreLabel: e.rating.toLocaleString("en-US"),
                deltaLabel: e.delta > 0 ? `+${e.delta}` : String(e.delta),
            })),
        };
    },
};
