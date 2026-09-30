export type UserRole = "user" | "court_admin" | "moderator" | "admin";
export type SkillLevel = "beginner" | "intermediate" | "advanced";
export type PlayStyle = "singles" | "doubles" | "both";
export type AuthUser = { id: string; email: string | null };
export type SignUpResult = { userId: string; needsEmailConfirmation: boolean };

export type Profile = {
    id: string;
    displayName: string;
    role: UserRole;
    city: string | null;
    avatarUrl: string | null;
    skillLevel: SkillLevel | null;
    playStyle: PlayStyle | null;
    bio: string | null;
    createdAt: string;
};