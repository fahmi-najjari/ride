"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, CreditCard, DollarSign, MapPin, Phone, Car, MessageCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { supabase } from "@/lib/supabase/client"
import type { Profile, Trip, DriverConfirmation } from "@/lib/types"
import { getCityName } from "@/lib/utils"

export default function TripDetailsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [trip, setTrip] = useState<Trip | null>(null)
  const [confirmation, setConfirmation] = useState<DriverConfirmation | null>(null)
  const { t, language } = useLanguage()
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
      setProfile(profile)
    }

    const getTrip = async () => {
      const { data: trip } = await supabase
        .from("trips")
        .select(
          `
        *,
        from_city:cities!trips_from_city_id_fkey(
          id, name_en, name_ar, name_fr,
          governorate:governorates(id, name_en, name_ar, name_fr)
        ),
        to_city:cities!trips_to_city_id_fkey(
          id, name_en, name_ar, name_fr,
          governorate:governorates(id, name_en, name_ar, name_fr)
        ),
        passenger:profiles!trips_passenger_id_fkey(id, full_name, email, phone),
        driver:profiles!trips_driver_id_fkey(id, full_name, email, is_approved)
      `, // Include is_approved for driver
        )
        .eq("id", params.id)
        .maybeSingle()

      setTrip(trip)

      // Get driver confirmation if trip is accepted
      if (trip?.status === "accepted" && trip.driver_id) {
        const { data: confirmation } = await supabase
          .from("driver_confirmations")
          .select("*")
          .eq("trip_id", trip.id)
          .maybeSingle()
        setConfirmation(confirmation)
      }
    }

    getProfile()
    getTrip()
  }, [router, params.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  // Helper to mask phone number
  const getMaskedPhoneNumber = (phone?: string) => {
    if (!phone) return t("na")
    // Assuming Tunisian numbers are 8 digits, format as XX XXX XXXX
    // Mask first 4 digits, show last 4
    if (phone.length >= 8) {
      return `** *** ${phone.slice(-4)}`
    }
    return `****${phone.slice(-4)}` // Fallback for shorter numbers
  }

  if (!trip) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Determine if driver phone should be visible to the passenger
  const isDriverPhoneVisible =
    profile?.user_type === "passenger" &&
    trip.payment_status === "paid" &&
    trip.driver?.is_approved && // New: Driver must be approved
    confirmation?.driver_phone

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("back")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trip Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-xl font-bold">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {t("tripDetails")}
              </div>
              <Badge className={getStatusColor(trip.status)}>{t(trip.status as any)}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-lg font-semibold">
              {getCityName(trip.from_city, language)} -&gt; {getCityName(trip.to_city, language)}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{trip.departure_date}</span>
              </div>
              {trip.departure_time && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{trip.departure_time}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">
                  {trip.fare_offered} {t("tnd")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {trip.passenger_count} {trip.passenger_count === 1 ? t("passengerSingular") : t("passengerPlural")}
                </span>
              </div>
            </div>

            {trip.notes && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">{t("notes")}:</p>
                <p className="text-sm">{trip.notes}</p>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              {t("postedOn")} {new Date(trip.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          {/* Passenger Info (for drivers) */}
          {(profile?.user_type === "driver" || !profile) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold">
                  <Users className="h-5 w-5 mr-2" />
                  {t("passengerInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="font-medium">{trip.passenger?.full_name || t("nameNotProvided")}</p>
                  <p className="text-sm text-muted-foreground">{trip.passenger?.email}</p>
                  {profile?.user_type === "driver" && trip.status === "pending" ? (
                    // If signed in as a driver and trip is pending, show full phone
                    trip.passenger?.phone && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{trip.passenger.phone}</span>
                      </div>
                    )
                  ) : (
                    // If not a driver (passenger or unauthenticated) or trip is not pending, show masked phone and prompt
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{getMaskedPhoneNumber(trip.passenger?.phone)}</span>
                      </div>
                      {(!profile || profile.user_type === "passenger") && ( // Only show this message if not a driver
                        <p className="text-sm text-yellow-800 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-md">
                          {t("signInAsDriverForDetails")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {trip.status === "pending" && (
                  <Link href={`/trips/${trip.id}/accept`}>
                    <Button className="w-full">{t("acceptTrip")}</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}

          {/* Driver Info (for passengers) */}
          {profile?.user_type === "passenger" && trip.driver && confirmation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold">
                  <Car className="h-5 w-5 mr-2" />
                  {t("driverInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{trip.driver.full_name || t("nameNotProvided")}</p>
                  <p className="text-sm text-muted-foreground">{trip.driver.email}</p>
                </div>

                {isDriverPhoneVisible ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{confirmation.driver_phone}</span>
                    </div>
                    {confirmation.whatsapp_number && (
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {t("whatsapp")}: {confirmation.whatsapp_number}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-yellow-600" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">{t("driverContactDetailsVisible")}</p>
                  </div>
                )}

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium mb-1">{t("pickupTime")}:</p>
                  <p className="text-sm">{confirmation.pickup_time}</p>
                </div>

                {confirmation.message && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">{t("driverMessage")}:</p>
                    <p className="text-sm">{confirmation.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
