"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import type { Trip } from "@/lib/types"
import { createSupabaseServerClient } from "@/lib/supabase/ssr"

type AdminTripFilters = {
  status?: string
}

export async function fetchTripsForAdmin(
  filters: AdminTripFilters = {},
): Promise<{ success: boolean; trips?: Trip[]; error?: string }> {
  const supabase = createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || profile?.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  let query = supabase
    .from("trips")
    .select(`
      *,
      from_city:cities!trips_from_city_id_fkey(*),
      to_city:cities!trips_to_city_id_fkey(*),
      passenger:profiles!trips_passenger_id_fkey(*),
      driver:profiles!trips_driver_id_fkey(*)
    `)
    .order("created_at", { ascending: false })

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status)
  }

  const { data: trips, error } = await query

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, trips: (trips || []) as Trip[] }
}

export async function deleteTripAsAdmin(tripId: string) {
  const supabase = createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || profile?.role !== "admin") {
    return { success: false, error: "Unauthorized", message: "Unauthorized" }
  }

  try {
    const { error } = await supabase.from("trips").delete().eq("id", tripId)

    if (error) {
      console.error("Error deleting trip:", error)
      return { success: false, error: error.message, message: error.message }
    }

    revalidatePath("/admin/trips")
    revalidatePath("/trips") // Revalidate the main trips page
    return { success: true, message: "Trip deleted successfully!" }
  } catch (error: any) {
    console.error("Unexpected error deleting trip:", error)
    const message = error.message || "An unexpected error occurred."
    return { success: false, error: message, message }
  }
}
