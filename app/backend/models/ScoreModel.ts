export type MatchInput = {
    userId: string;
    playerA: string;
    playerB: string;
    scoreA: number;
    scoreB: number;
};

export type RatingSummary = {
    rating: number;
    lastDelta: number;
};

export type LeaderboardScope = "jakarta" | "club" | "month";

export type LeaderboardEntry = {
    rank: number;
    name: string;
    place: string;
    rating: number;
    delta: number;
};

export type TournamentSample = {
    format: string;
    title: string;
    lines: string[];
};
