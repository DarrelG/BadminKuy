import type { PulseStats } from "~/backend/models/StatsModel";

// MOCK DATA: swap the method body for real counts (presence, sessions, courts) later.
export const statsHandler = {
    async getPulse(): Promise<PulseStats> {
        return { playersOnline: 428, openSessions: 18, openCourts: 24 };
    },
};
