"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, BadgeCheck, Car, MapPin, Search, ShieldCheck, UserRound, Users, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase/client"
import type { City, Governorate } from "@/lib/types"
import { getCityName, getGovernorateName } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import type { TranslationKey } from "@/lib/i18n"

const fallbackGovernorates = ["Tunis", "Sousse", "Sfax", "Nabeul", "Monastir", "Kairouan"]

const features = [
  {
    icon: Users,
    title: "homeFeatureMatchingTitle",
    description: "homeFeatureMatchingDesc",
  },
  {
    icon: MapPin,
    title: "homeFeatureCoverageTitle",
    description: "homeFeatureCoverageDesc",
  },
  {
    icon: Wallet,
    title: "homeFeatureFareTitle",
    description: "homeFeatureFareDesc",
  },
  {
    icon: ShieldCheck,
    title: "homeFeatureVerifiedTitle",
    description: "homeFeatureVerifiedDesc",
  },
]

const steps = [
  {
    title: "homeStepRouteTitle",
    description: "homeStepRouteDesc",
  },
  {
    title: "homeStepConfirmTitle",
    description: "homeStepConfirmDesc",
  },
  {
    title: "homeStepTrackTitle",
    description: "homeStepTrackDesc",
  },
]

export default function HomePage() {
  const router = useRouter()
  const { t, language } = useLanguage()
  const [governorates, setGovernorates] = useState<Governorate[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [selectedGovernorate, setSelectedGovernorate] = useState("")
  const [selectedCity, setSelectedCity] = useState("")

  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  useEffect(() => {
    if (!isSupabaseConfigured) return

    const loadLocations = async () => {
      const [governoratesResponse, citiesResponse] = await Promise.all([
        supabase.from("governorates").select("*").order("name_en"),
        supabase.from("cities").select("*").order("name_en"),
      ])

      if (!governoratesResponse.error) {
        setGovernorates(governoratesResponse.data || [])
      }

      if (!citiesResponse.error) {
        setCities(citiesResponse.data || [])
      }
    }

    loadLocations()
  }, [isSupabaseConfigured])

  const citiesForGovernorate = useMemo(() => {
    if (!selectedGovernorate) return []
    return cities.filter((city) => city.governorate_id === Number(selectedGovernorate))
  }, [cities, selectedGovernorate])

  const featuredGovernorates = governorates.slice(0, 6)

  const browseTrips = (governorateId?: string, cityId?: string) => {
    const params = new URLSearchParams()
    if (governorateId) params.set("governorate", governorateId)
    if (cityId) params.set("fromCity", cityId)
    router.push(`/trips${params.toString() ? `?${params.toString()}` : ""}`)
  }

  const handleSearch = () => {
    browseTrips(selectedGovernorate, selectedCity)
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_34%),linear-gradient(135deg,hsl(var(--background)),hsl(var(--secondary)/0.62))]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm">
              <BadgeCheck className="h-4 w-4 text-primary" />
              {t("homeEyebrow")}
            </div>
            <h1 className="text-4xl font-bold tracking-normal text-foreground sm:text-5xl lg:text-6xl">
              {t("homeHeroTitle")}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">{t("homeHeroDesc")}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                href="/trips/new"
                className="group rounded-lg border bg-background/85 p-4 shadow-sm transition hover:border-primary/60 hover:shadow-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <UserRound className="h-5 w-5" />
                </div>
                <h2 className="font-semibold">{t("homePassengerPathTitle")}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("homePassengerPathDesc")}</p>
                <span className="mt-3 inline-flex items-center text-sm font-medium text-primary">
                  {t("homePassengerPathAction")}
                  <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                href="/trips"
                className="group rounded-lg border bg-background/85 p-4 shadow-sm transition hover:border-primary/60 hover:shadow-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Car className="h-5 w-5" />
                </div>
                <h2 className="font-semibold">{t("homeDriverPathTitle")}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("homeDriverPathDesc")}</p>
                <span className="mt-3 inline-flex items-center text-sm font-medium text-primary">
                  {t("homeDriverPathAction")}
                  <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="w-full gap-2 sm:w-auto" onClick={() => browseTrips()}>
                {t("homeBrowseAllTrips")}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Link href="/trips/new">
                <Button size="lg" variant="outline" className="w-full bg-background/80 sm:w-auto">
                  {t("homePostTripRequest")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            {!isSupabaseConfigured && (
              <div className="mt-8 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
                {t("homeSetupWarning")}
              </div>
            )}
          </div>

          <div className="relative">
            <div className="rounded-lg border bg-background/90 p-5 shadow-2xl shadow-primary/10">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("homeTripSearch")}</p>
                  <h2 className="text-2xl font-semibold">{t("homeWhereStarting")}</h2>
                </div>
                <div className="rounded-md bg-primary/10 p-3 text-primary">
                  <Search className="h-6 w-6" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("selectGovernorate")}</label>
                  <Select
                    value={selectedGovernorate}
                    onValueChange={(value) => {
                      setSelectedGovernorate(value)
                      setSelectedCity("")
                    }}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder={t("homeChooseGovernorate")} />
                    </SelectTrigger>
                    <SelectContent>
                      {governorates.map((governorate) => (
                        <SelectItem key={governorate.id} value={governorate.id.toString()}>
                          {getGovernorateName(governorate, language)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("homeCityOrTown")}</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedGovernorate}>
                    <SelectTrigger className="h-11">
                      <SelectValue
                        placeholder={selectedGovernorate ? t("homeChooseCity") : t("homeSelectGovernorateFirst")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {citiesForGovernorate.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {getCityName(city, language)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button className="h-11 w-full gap-2" onClick={handleSearch} disabled={!selectedGovernorate}>
                  {t("homeSearchTrips")}
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-5">
                <p className="mb-3 text-sm font-medium text-muted-foreground">{t("homePopularGovernorates")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {(featuredGovernorates.length ? featuredGovernorates : fallbackGovernorates).map((governorate) => {
                    const governorateId = typeof governorate === "string" ? "" : governorate.id.toString()
                    const label = typeof governorate === "string" ? governorate : getGovernorateName(governorate, language)

                    return (
                      <Button
                        key={label}
                        variant="outline"
                        className="justify-start bg-background/80"
                        onClick={() => browseTrips(governorateId)}
                        disabled={!governorateId}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        {label}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">{t("homeEverydayTravelTitle")}</h2>
            <p className="mt-3 text-muted-foreground">{t("homeEverydayTravelDesc")}</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg border bg-card p-5">
                <feature.icon className="mb-4 h-7 w-7 text-primary" />
                <h3 className="font-semibold">{t(feature.title as TranslationKey)}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(feature.description as TranslationKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-secondary/55 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-bold">{t("homeWorkflowTitle")}</h2>
            <p className="mt-3 text-muted-foreground">{t("homeWorkflowDesc")}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-lg border bg-background p-5">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <h3 className="font-semibold">{t(step.title as TranslationKey)}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(step.description as TranslationKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold">{t("homeReadyTitle")}</h2>
            <p className="mt-2 text-muted-foreground">{t("homeReadyDesc")}</p>
          </div>
          <Link href="/register">
            <Button size="lg" className="gap-2">
              {t("createAccount")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
