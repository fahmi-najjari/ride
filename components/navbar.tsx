"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Car, Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { supabase } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          // Fetch profile including the new 'role' field
          const { data: profile } = await supabase.from("profiles").select("*, role").eq("id", user.id).maybeSingle()
          setProfile(profile)
        }
      } catch (error) {
        console.error("Error getting user:", error)
        setUser(null)
        setProfile(null)
      }
    }

    getUser()

    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null)
        if (!session?.user) {
          setProfile(null)
        } else {
          // Re-fetch profile on auth state change to get updated role
          getUser()
        }
      })

      return () => subscription.unsubscribe()
    } catch (error) {
      console.error("Error setting up auth listener:", error)
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">TunisRide</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/trips">
              <Button variant="ghost">{t("trips")}</Button>
            </Link>
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">{t("dashboard")}</Button>
                </Link>
                {profile?.role === "admin" && ( // Conditionally render Admin Dashboard link
                  <Link href="/admin/dashboard">
                    <Button variant="ghost">{t("adminDashboard")}</Button>
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{profile?.full_name || user.email}</span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">{t("login")}</Button>
                </Link>
                <Link href="/register">
                  <Button>{t("register")}</Button>
                </Link>
              </>
            )}
            <LanguageSelector />
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSelector />
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/trips" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  {t("trips")}
                </Button>
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      {t("dashboard")}
                    </Button>
                  </Link>
                  {profile?.role === "admin" && ( // Conditionally render Admin Dashboard link
                    <Link href="/admin/dashboard" className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        {t("adminDashboard")}
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("logout")}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      {t("login")}
                    </Button>
                  </Link>
                  <Link href="/register" className="block">
                    <Button className="w-full justify-start">{t("register")}</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
