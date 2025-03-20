import type React from "react"
import { Inter } from "next/font/google"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/toaster"
import "@/app/globals.css"
import { AuthProvider } from "@/components/auth/session-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Biblio.Gest",
  description: "Gerenciamento de autores e livros",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Toaster />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



