import { notificationHandler } from "~/backend/handlers/NotificationHandler";
import { sessionController } from "~/frontEnd/controllers/SessionController";
import { initialsOf } from "~/frontEnd/utils/format";
import { skillLabels } from "~/frontEnd/utils/labels";
import type { LayoutPageModel } from "~/frontEnd/viewModels/LayoutPageModel";

export const layoutController = {
    async getLayoutPage(): Promise<LayoutPageModel> {
        const profile = await sessionController.requireProfile();
        const notifications = await notificationHandler.getForUser(profile.id);

        return {
            username: profile.displayName,
            initials: initialsOf(profile.displayName),
            skillLabel: profile.skillLevel ? skillLabels[profile.skillLevel] : "Player",
            city: profile.city ?? "Set your city",
            notifications: notifications.map((n) => ({ id: n.id, title: n.title, body: n.body })),
            hasUnread: notifications.some((n) => !n.read),
        };
    },
};
