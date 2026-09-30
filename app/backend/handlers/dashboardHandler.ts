import { supabase } from "~/config/supabase";
import type { Profile, UserRole, SkillLevel, PlayStyle } from "~/backend/models/UserModel";

// DB shape: private to this file, nothing else ever sees column names
type ProfileRow = {
    id: string;
    display_name: string;
    role: UserRole;
    city: string | null;
    avatar_url: string | null;
    skill_level: SkillLevel | null;
    play_style: PlayStyle | null;
    bio: string | null;
    created_at: string;
};

const toProfile = (r: ProfileRow): Profile => ({
    id: r.id,
    displayName: r.display_name,
    role: r.role,
    city: r.city,
    avatarUrl: r.avatar_url,
    skillLevel: r.skill_level,
    playStyle: r.play_style,
    bio: r.bio,
    createdAt: r.created_at,
});

export const dashboardHandler = {
    async getAll(): Promise<Profile[]> {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: true });
        console.log("handler:", data, error);
        if (error) throw new Error(error.message);
        return (data as ProfileRow[]).map(toProfile);
    },

    async getById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? toProfile(data as ProfileRow) : null;
    },
};