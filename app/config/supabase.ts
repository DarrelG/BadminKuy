import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

const globalForSupabase = globalThis as unknown as {
    __supabase?: SupabaseClient;
};

export const supabase: SupabaseClient =
    globalForSupabase.__supabase ??
    (globalForSupabase.__supabase = createClient(
        env.supabaseUrl,
        env.supabasePublishableKey,
    ));