import { supabase } from "@/lib/supabaseClient"

export const handleUsers = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 

  const { id, user_metadata } = user

  const { error } = await supabase.from("users").upsert(
    {
      auth_id: id,
      full_name: user_metadata.full_name || user_metadata.name || "",
      avatar_url: user_metadata.avatar_url || "",
    },
    { onConflict: "auth_id" }
  )
}
