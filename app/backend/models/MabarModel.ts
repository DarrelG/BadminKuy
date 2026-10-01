import type { SkillLevel } from "~/backend/models/UserModel";

export type MabarFormat = "Doubles" | "Singles" | "Casual";

export type MabarSession = {
    id: string;
    title: string;
    courtName: string;
    skill: SkillLevel;
    startsAt: string; // ISO date-time
    format: MabarFormat;
    pricePerPerson: number;
    capacity: number;
    participantIds: string[];
    hostId: string;
};

export type NewMabarSession = {
    title: string;
    courtName: string;
    skill: SkillLevel;
    startsAt: string;
    capacity: number;
    pricePerPerson: number;
};
