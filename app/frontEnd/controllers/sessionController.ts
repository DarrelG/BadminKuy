import { redirect } from "react-router";
import { authHandler } from "~/backend/handlers/auth/authHandler";
import { dashboardHandler } from "~/backend/handlers/DashboardHandler";
import type { AuthUser, Profile } from "~/backend/models/UserModel";

// Every page controller starts with one of these, so guests are sent to /login
// before any data is requested.
export const sessionController = {
    async requireUser(): Promise<AuthUser> {
        const user = await authHandler.getCurrentUser();
        if (!user) throw redirect("/login");
        return user;
    },

    async requireProfile(): Promise<Profile> {
        const user = await this.requireUser();
        const profile = await dashboardHandler.getById(user.id);
        // Not a redirect: sending a logged-in user to /login would loop back here
        if (!profile) throw new Response("Your profile could not be found.", { status: 404 });
        return profile;
    },
};
