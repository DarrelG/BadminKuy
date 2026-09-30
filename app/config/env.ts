export const env = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
    supabasePublishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
};

if (!env.supabaseUrl || !env.supabasePublishableKey) {
    throw new Error(
        "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY"
    );
}