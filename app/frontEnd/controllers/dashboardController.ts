import { redirect } from "react-router";
import { authHandler } from "~/backend/handlers/auth/authHandler";
import { dashboardHandler } from "~/backend/handlers/dashboardHandler";
import type { dashboardModel } from "~/frontEnd/viewModels/dashboardModel";

export const dashboardController = {
    async getDashboardPage(): Promise<dashboardModel> {
        const user = await authHandler.getCurrentUser();
        if (!user) throw redirect("/login");

        const profile = await dashboardHandler.getAll();
        return {
            dashboardModel: profile.map((p) => ({
                id: p.id,
                username: p.displayName,
            })),
        };
    },
};