import type { AppNotification } from "~/backend/models/NotificationModel";

// MOCK DATA: swap the method body for a Supabase query when the notifications table exists.
const notifications: AppNotification[] = [
    {
        id: "n1",
        title: "Mabar match found",
        body: "Doubles at GOR Senayan starts in 2 hours.",
        read: false,
    },
    {
        id: "n2",
        title: "Court update",
        body: "GOR Blok M has reported 2 courts open.",
        read: false,
    },
];

export const notificationHandler = {
    async getForUser(userId: string): Promise<AppNotification[]> {
        void userId;
        return notifications;
    },
};
