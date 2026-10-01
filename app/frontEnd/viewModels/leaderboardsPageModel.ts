export type LeaderboardsPageModel = {
    tabs: { key: string; label: string; active: boolean }[];
    entries: {
        rank: string;
        initials: string;
        name: string;
        place: string;
        scoreLabel: string;
        deltaLabel: string;
    }[];
};
