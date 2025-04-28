import { createClient } from "@supabase/supabase-js";
import { User } from "./definitions";

const sql = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
