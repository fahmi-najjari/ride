"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { AlertCircle, Calendar, Car, Clock, DollarSign, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert" // Import Alert
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/language-context"
import { supabase } from "@/lib/supabase/client"
import type { Profile, Trip } from "@/lib/types"
import { getCityName } from "@/lib/utils"

export default function AcceptTripPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true) // Set to true initially
  const [error, setError] = useState<string | null>(null) // New error state
  const [formData, setFormData] = useState({
    pickupTime: "",
    driverPhone: "",
    whatsappNumber: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleColor: "",
    licensePlate: "",
    message: "",
    termsAccepted: false,
  })
  const { toast } = useToast()
  const { t, language } = useLanguage()
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const initializePage = async () => {
      setLoading(true)
      setError(null)
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/login")
          return
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle()

        if (profileError) {
          throw new Error(`${t("failedToLoadProfile")}: ${profileError.message}`)
        }

        if (!profileData) {
          router.push("/complete-profile")
          return
        }

        if (profileData.user_type !== "driver") {
          router.push("/dashboard")
          return
        }

        // New: Check if driver is approved
        if (!profileData.is_approved) {
          setError(t("youAreNotApproved"))
          setLoading(false)
          return
        }

        setProfile(profileData)
        // Pre-fill phone number if available
        if (profileData.phone) {
          setFormData((prev) => ({ ...prev, driverPhone: profileData.phone || "" }))
        }

        const { data: tripData, error: tripError } = await supabase
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
            passenger:profiles!trips_passenger_id_fkey(id, full_name, email, phone)
          `,
          )
          .eq("id", params.id)
          .maybeSingle()

        if (tripError) {
          throw new Error(`${t("failedToLoadTrip")}: ${tripError.message}`)
        }

        if (!tripData || tripData.status !== "pending") {
          router.push("/trips") // Redirect if trip not found or not pending
          return
        }

        setTrip(tripData)
      } catch (err: any) {
        console.error("Page initialization error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    initializePage()
  }, [router, params.id, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!profile || !trip) throw new Error(t("missingData"))
      if (!formData.termsAccepted) throw new Error(t("pleaseAcceptTerms"))
      if (!profile.is_approved) throw new Error(t("youAreNotApproved")) // Double check on submit

      // Create driver confirmation
      const { error: confirmationError } = await supabase.from("driver_confirmations").insert({
        trip_id: trip.id,
        driver_id: profile.id,
        pickup_time: formData.pickupTime,
        driver_phone: formData.driverPhone,
        whatsapp_number: formData.whatsappNumber || null,
        vehicle_make: formData.vehicleMake,
        vehicle_model: formData.vehicleModel,
        vehicle_color: formData.vehicleColor,
        license_plate: formData.licensePlate,
        message: formData.message || null,
        terms_accepted: formData.termsAccepted,
      })

      if (confirmationError) throw confirmationError

      // Update trip status and assign driver
      const { error: tripError } = await supabase
        .from("trips")
        .update({
          status: "accepted",
          driver_id: profile.id,
        })
        .eq("id", trip.id)

      if (tripError) throw tripError

      toast({
        title: t("tripAcceptedSuccess"),
        description: t("passengerNotifiedContact"),
      })

      router.push("/dashboard")
    } catch (err: any) {
      toast({
        title: t("error"),
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>{t("error")}:</strong> {error}
            <div className="mt-2">
              <Button variant="outline" onClick={() => router.push("/dashboard")} className="bg-transparent">
                {t("goBackToDashboard")}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trip Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              {t("tripDetails")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">
                {getCityName(trip.from_city, language)} -&gt; {getCityName(trip.to_city, language)}
              </span>
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                {t("pending")}
              </Badge>
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
                <p className="text-sm font-medium mb-1">{t("passengerNotes")}</p>
                <p className="text-sm">{trip.notes}</p>
              </div>
            )}

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium mb-1">{t("passengerContact")}</p>
              <p className="text-sm">{trip.passenger?.full_name || t("nameNotProvided")}</p>
              <p className="text-sm">{trip.passenger?.email}</p>
              {trip.passenger?.phone && <p className="text-sm">{trip.passenger.phone}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Driver Confirmation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="h-5 w-5 mr-2" />
              {t("driverConfirmation")}
            </CardTitle>
            <CardDescription>{t("fillDetailsToAccept")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickupTime">{t("pickupTime")} *</Label>
                <Input
                  id="pickupTime"
                  type="time"
                  required
                  value={formData.pickupTime}
                  onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driverPhone">{t("phone")} *</Label>
                  <Input
                    id="driverPhone"
                    type="tel"
                    required
                    value={formData.driverPhone}
                    onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">
                    {t("whatsapp")} ({t("optional")})
                  </Label>
                  <Input
                    id="whatsappNumber"
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">{t("vehicleInfo")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleMake">{t("vehicleMake")} *</Label>
                    <Input
                      id="vehicleMake"
                      required
                      placeholder={t("enterVehicleMake")}
                      value={formData.vehicleMake}
                      onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">{t("vehicleModel")} *</Label>
                    <Input
                      id="vehicleModel"
                      required
                      placeholder={t("enterVehicleModel")}
                      value={formData.vehicleModel}
                      onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleColor">{t("vehicleColor")} *</Label>
                    <Input
                      id="vehicleColor"
                      required
                      placeholder={t("enterVehicleColor")}
                      value={formData.vehicleColor}
                      onChange={(e) => setFormData({ ...formData, vehicleColor: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licensePlate">{t("licensePlate")} *</Label>
                    <Input
                      id="licensePlate"
                      required
                      placeholder={t("enterLicensePlate")}
                      value={formData.licensePlate}
                      onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t("message")}</Label>
                <Textarea
                  id="message"
                  placeholder={t("anyAdditionalMessage")}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => setFormData({ ...formData, termsAccepted: checked as boolean })}
                />
                <Label htmlFor="terms" className="text-sm">
                  {t("acceptTerms")}
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading || !formData.termsAccepted}>
                {loading ? t("acceptingTrip") : t("acceptTrip")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
