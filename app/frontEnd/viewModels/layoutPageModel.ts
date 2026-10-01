export type LayoutPageModel = {
    username: string;
    initials: string;
    skillLabel: string;
    city: string;
    notifications: { id: string; title: string; body: string }[];
    hasUnread: boolean;
};
