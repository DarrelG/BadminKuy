import type { SkillLevel } from "~/backend/models/UserModel";

export const skillLabels: Record<SkillLevel, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
};

export const isSkillLevel = (value: string): value is SkillLevel =>
    value === "beginner" || value === "intermediate" || value === "advanced";
