import { supabase } from "~/config/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

export abstract class ApplicationHandler {
    protected Database: SupabaseClient = supabase;
}