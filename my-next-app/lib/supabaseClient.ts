import { createClient } from "@supabase/supabase-js";

export interface ConnectionStrings {
  supabaseURL: string;
  supabaseKey: string;
}

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseURL || !supabaseKey) {
  throw new Error("Missing Supabase environment variables.");
}

const connectionStrings: ConnectionStrings = {
  supabaseURL,
  supabaseKey,
};

export const supabase = createClient(
  connectionStrings.supabaseURL,
  connectionStrings.supabaseKey,

  {
    global: {
      headers: { 
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  }
);
