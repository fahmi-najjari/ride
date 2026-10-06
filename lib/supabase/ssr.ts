import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL")
  }
  if (!supabasePublishableKey) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
  }

  const cookieStore = cookies()

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}
