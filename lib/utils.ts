import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { City, Governorate } from "./types"
import type { Language } from "./i18n"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCityName(city: City | null | undefined, language: Language): string {
  if (!city) return ""
  switch (language) {
    case "ar":
      return city.name_ar || city.name_en
    case "fr":
      return city.name_fr || city.name_en
    default:
      return city.name_en
  }
}

export function getGovernorateName(governorate: Governorate | null | undefined, language: Language): string {
  if (!governorate) return ""
  switch (language) {
    case "ar":
      return governorate.name_ar || governorate.name_en
    case "fr":
      return governorate.name_fr || governorate.name_en
    default:
      return governorate.name_en
  }
}
