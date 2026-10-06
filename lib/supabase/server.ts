import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let client: SupabaseClient | null = null

function getSupabaseServerClient() {
  if (client) {
    return client
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL")
  }
  if (!supabaseSecretKey) {
    throw new Error("Missing env.SUPABASE_SECRET_KEY")
  }

  client = createClient(supabaseUrl, supabaseSecretKey)
  return client
}

export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabaseServerClient(), prop, receiver)
  },
})
