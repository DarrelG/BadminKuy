import type { MabarSession, NewMabarSession } from "~/backend/models/MabarModel";

// MOCK DATA: swap each method body for Supabase queries when the sessions table exists.
const atDay = (daysAhead: number, time: string): string => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    date.setHours(hours, minutes, 0, 0);
    return date.toISOString();
};

const daysUntilWeekday = (weekday: number): number => {
    const diff = (weekday - new Date().getDay() + 7) % 7;
    return diff === 0 ? 7 : diff;
};

const sessions: MabarSession[] = [
    {
        id: "s1",
        title: "Senayan after work",
        courtName: "GOR Senayan",
        skill: "intermediate",
        startsAt: atDay(0, "19:30"),
        format: "Doubles",
        pricePerPerson: 45000,
        capacity: 4,
        participantIds: ["seed-1", "seed-2", "seed-3"],
        hostId: "seed-1",
    },
    {
        id: "s2",
        title: "Blok M doubles night",
        courtName: "Blok M Badminton",
        skill: "beginner",
        startsAt: atDay(daysUntilWeekday(5), "20:00"),
        format: "Doubles",
        pricePerPerson: 40000,
        capacity: 4,
        participantIds: ["seed-4", "seed-5"],
        hostId: "seed-4",
    },
    {
        id: "s3",
        title: "Saturday smash ladder",
        courtName: "Cilandak Sports Hall",
        skill: "advanced",
        startsAt: atDay(daysUntilWeekday(6), "08:00"),
        format: "Singles",
        pricePerPerson: 55000,
        capacity: 6,
        participantIds: ["seed-6", "seed-7", "seed-8", "seed-9"],
        hostId: "seed-6",
    },
];

const byStart = (a: MabarSession, b: MabarSession) =>
    new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();

export const mabarHandler = {
    async getAll(): Promise<MabarSession[]> {
        return [...sessions].sort(byStart);
    },

    async getUpcoming(limit: number): Promise<MabarSession[]> {
        return [...sessions].sort(byStart).slice(0, limit);
    },

    async join(sessionId: string, userId: string): Promise<MabarSession> {
        const session = sessions.find((s) => s.id === sessionId);
        if (!session) throw new Error("SESSION_NOT_FOUND");
        if (session.participantIds.includes(userId)) return session;
        if (session.participantIds.length >= session.capacity) throw new Error("SESSION_FULL");
        session.participantIds.push(userId);
        return session;
    },

    async create(input: NewMabarSession, hostId: string): Promise<MabarSession> {
        const session: MabarSession = {
            id: crypto.randomUUID(),
            title: input.title,
            courtName: input.courtName,
            skill: input.skill,
            startsAt: input.startsAt,
            format: "Casual",
            pricePerPerson: input.pricePerPerson,
            capacity: input.capacity,
            participantIds: [hostId],
            hostId,
        };
        sessions.unshift(session);
        return session;
    },
};
