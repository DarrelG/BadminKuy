import type { SkillLevel } from "~/backend/models/UserModel";

export type MabarSessionCard = {
    id: string;
    skill: SkillLevel;
    skillLabel: string;
    whenLabel: string;
    title: string;
    meta: string;
    playersLabel: string;
    joined: boolean;
    full: boolean;
};

export type MabarPageModel = {
    sessions: MabarSessionCard[];
    courtOptions: string[];
    skillOptions: { value: SkillLevel; label: string }[];
};
