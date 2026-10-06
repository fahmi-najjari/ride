"use client"

import type React from "react"
import { useLanguage } from "@/lib/language-context"

export function MainContent({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage()

  return (
    <main className="min-h-screen bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
      {children}
    </main>
  )
}
