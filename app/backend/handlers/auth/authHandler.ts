import { supabase } from "~/config/supabase";
import type { AuthUser, SignUpResult } from "~/backend/models/UserModel";

export const authHandler = {
    async signIn(email: string, password: string): Promise<AuthUser> {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
        return { id: data.user.id, email: data.user.email ?? null };
    },

    async signUp(email: string, password: string, displayName: string): Promise<SignUpResult> {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { display_name: displayName } },
        });
        if (error) throw new Error(error.message);
        if (!data.user) throw new Error("Sign up failed.");
        return { userId: data.user.id, needsEmailConfirmation: data.session === null };
    },

    async getCurrentUser(): Promise<AuthUser | null> {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw new Error(error.message);
        const user = data.session?.user;
        return user ? { id: user.id, email: user.email ?? null } : null;
    },

    async signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
    },
};