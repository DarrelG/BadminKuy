import type {
    LeaderboardEntry,
    LeaderboardScope,
    MatchInput,
    RatingSummary,
    TournamentSample,
} from "~/backend/models/ScoreModel";

// MOCK DATA: swap each method body for Supabase queries when the matches/ratings tables exist.
const ratings = new Map<string, RatingSummary>();
const matches: MatchInput[] = [];

const startingRating = (): RatingSummary => ({ rating: 1284, lastDelta: 12 });

const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: "Nadia Putri", place: "Jakarta Selatan", rating: 1542, delta: 28 },
    { rank: 2, name: "Dimas H.", place: "Kemang Smash", rating: 1489, delta: 14 },
    { rank: 3, name: "Raka Aditya", place: "Senayan Shuttle Club", rating: 1284, delta: 12 },
];

const samples: TournamentSample[] = [
    {
        format: "Round-robin",
        title: "Round 1",
        lines: ["Raka / Dimas vs Nadia / Sari", "Bimo / Arif vs Fina / Gita"],
    },
    {
        format: "Knockout",
        title: "Quarter-finals",
        lines: ["Raka vs Nadia · Court 1", "Dimas vs Sari · Court 2"],
    },
    {
        format: "Americano",
        title: "Round 1 · rotating pairs",
        lines: ["Raka + Sari vs Nadia + Dimas", "Play to 15 · switch partners next round"],
    },
];

export const scoreHandler = {
    async getRating(userId: string): Promise<RatingSummary> {
        return ratings.get(userId) ?? startingRating();
    },

    // Placeholder rule (+12 for a win, -8 for a loss) until real rating logic exists
    async recordMatch(match: MatchInput): Promise<RatingSummary> {
        matches.push(match);
        const current = ratings.get(match.userId) ?? startingRating();
        const delta = match.scoreA > match.scoreB ? 12 : -8;
        const updated = { rating: current.rating + delta, lastDelta: delta };
        ratings.set(match.userId, updated);
        return updated;
    },

    async getLeaderboard(scope: LeaderboardScope): Promise<LeaderboardEntry[]> {
        void scope;
        return leaderboard;
    },

    async getTournamentSamples(): Promise<TournamentSample[]> {
        return samples;
    },
};
