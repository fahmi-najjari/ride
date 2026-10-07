"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { type Language, translations, type TranslationKey } from "./i18n"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function applyDocumentLanguage(lang: Language) {
  document.documentElement.lang = lang
  document.documentElement.dir = "ltr"
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved && translations[saved]) {
      setLanguage(saved)
      applyDocumentLanguage(saved)
      return
    }
    applyDocumentLanguage("en")
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    applyDocumentLanguage(lang)
  }

  const t = (key: TranslationKey): string => {
    const value = translations[language][key]
    if (typeof value === "string" && /[ÃØÙ]/.test(value)) {
      return translations.en[key] || key
    }

    return value || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
