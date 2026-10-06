import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let supabaseClient: SupabaseClient | null = null

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL")
  }
  if (!supabasePublishableKey) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
  }

  supabaseClient = createClient(supabaseUrl, supabasePublishableKey)
  return supabaseClient
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabaseClient(), prop, receiver)
  },
})
