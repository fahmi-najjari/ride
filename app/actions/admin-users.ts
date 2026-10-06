"use server"

import { supabaseServer } from "@/lib/supabase/server"
import type { Profile } from "@/lib/types"

export async function fetchUsersForAdmin(): Promise<{ success: boolean; users?: Profile[]; error?: string }> {
  try {
    // 1. Authenticate user and check for admin role
    const { data: authData, error: authError } = await supabaseServer.auth.getUser()

    if (authError || !authData.user) {
      return { success: false, error: "Authentication required." }
    }

    const { data: adminProfile, error: profileError } = await supabaseServer
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .maybeSingle()

    if (profileError || !adminProfile || adminProfile.role !== "admin") {
      return { success: false, error: "Unauthorized: Admin access required." }
    }

    // 2. Fetch all profiles (only if authenticated as admin)
    const { data: users, error: fetchError } = await supabaseServer
      .from("profiles")
      .select("*, is_approved") // Include is_approved
      .order("created_at", { ascending: false })

    if (fetchError) {
      console.error("Error fetching all profiles for admin:", fetchError)
      return { success: false, error: fetchError.message }
    }

    return { success: true, users: users as Profile[] }
  } catch (error: any) {
    console.error("Server action error (fetchUsersForAdmin):", error)
    return { success: false, error: error.message || "An unexpected error occurred." }
  }
}

export async function getTotalUsers(): Promise<number> {
  try {
    const { data: authData, error: authError } = await supabaseServer.auth.getUser()

    if (authError || !authData.user) {
      return 0
    }

    const { data: adminProfile, error: profileError } = await supabaseServer
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .maybeSingle()

    if (profileError || !adminProfile || adminProfile.role !== "admin") {
      return 0
    }

    const { count, error: countError } = await supabaseServer.from("profiles").select("id", { count: "exact" })

    if (countError) {
      console.error("Error counting profiles for admin:", countError)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error("Server action error (getTotalUsers):", error)
    return 0
  }
}

export async function toggleUserApproval(
  userId: string,
  isApproved: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Authenticate user and check for admin role
    const { data: authData, error: authError } = await supabaseServer.auth.getUser()

    if (authError || !authData.user) {
      return { success: false, error: "Authentication required." }
    }

    const { data: adminProfile, error: profileError } = await supabaseServer
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .maybeSingle()

    if (profileError || !adminProfile || adminProfile.role !== "admin") {
      return { success: false, error: "Unauthorized: Admin access required." }
    }

    // 2. Update the user's approval status
    const { error: updateError } = await supabaseServer
      .from("profiles")
      .update({ is_approved: isApproved })
      .eq("id", userId)

    if (updateError) {
      console.error("Error toggling user approval:", updateError)
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Server action error (toggleUserApproval):", error)
    return { success: false, error: error.message || "An unexpected error occurred." }
  }
}
