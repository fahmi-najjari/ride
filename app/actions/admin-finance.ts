import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/ssr"

export async function getFinancialOverview() {
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
    redirect("/dashboard")
  }

  try {
    // Total Revenue (sum of fare_offered for completed trips)
    const { data: revenueData, error: revenueError } = await supabase
      .from("trips")
      .select("fare_offered")
      .eq("status", "completed")

    if (revenueError) throw revenueError
    const totalRevenue = revenueData.reduce((sum, trip) => sum + (trip.fare_offered || 0), 0)

    // User Counts
    const { count: totalPassengers, error: passengersError } = await supabase
      .from("profiles")
      .select("id", { count: "exact" })
      .eq("user_type", "passenger")

    if (passengersError) throw passengersError

    const { count: totalDrivers, error: driversError } = await supabase
      .from("profiles")
      .select("id", { count: "exact" })
      .eq("user_type", "driver")

    if (driversError) throw driversError

    const { count: subscribedDrivers, error: subscribedDriversError } = await supabase
      .from("profiles")
      .select("id", { count: "exact" })
      .eq("user_type", "driver")
      .eq("has_subscription", true)

    if (subscribedDriversError) throw subscribedDriversError

    // Trip Statistics
    const { count: totalTrips, error: totalTripsError } = await supabase.from("trips").select("id", { count: "exact" })

    if (totalTripsError) throw totalTripsError

    const { count: completedTrips, error: completedTripsError } = await supabase
      .from("trips")
      .select("id", { count: "exact" })
      .eq("status", "completed")

    if (completedTripsError) throw completedTripsError

    const { count: pendingTrips, error: pendingTripsError } = await supabase
      .from("trips")
      .select("id", { count: "exact" })
      .eq("status", "pending")

    if (pendingTripsError) throw pendingTripsError

    const { count: acceptedTrips, error: acceptedTripsError } = await supabase
      .from("trips")
      .select("id", { count: "exact" })
      .eq("status", "accepted")

    if (acceptedTripsError) throw acceptedTripsError

    const { count: cancelledTrips, error: cancelledTripsError } = await supabase
      .from("trips")
      .select("id", { count: "exact" })
      .eq("status", "cancelled")

    if (cancelledTripsError) throw cancelledTripsError

    return {
      totalRevenue: totalRevenue.toFixed(2),
      totalPassengers,
      totalDrivers,
      subscribedDrivers,
      unsubscribedDrivers: (totalDrivers || 0) - (subscribedDrivers || 0),
      totalTrips,
      completedTrips,
      pendingTrips,
      acceptedTrips,
      cancelledTrips,
      error: null,
    }
  } catch (error: any) {
    console.error("Error fetching financial overview:", error.message)
    return {
      totalRevenue: "N/A",
      totalPassengers: 0,
      totalDrivers: 0,
      subscribedDrivers: 0,
      unsubscribedDrivers: 0,
      totalTrips: 0,
      completedTrips: 0,
      pendingTrips: 0,
      acceptedTrips: 0,
      cancelledTrips: 0,
      error: error.message || "Failed to fetch financial data.",
    }
  }
}
