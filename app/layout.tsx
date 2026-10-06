import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { MainContent } from "@/components/main-content"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TunisRide - Ride Sharing Platform",
  description: "Connect passengers and drivers across Tunisia",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <Navbar />
            <MainContent>{children}</MainContent>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
