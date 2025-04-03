import type React from "react"  // Importação do tipo React para tipagem correta dos componentes
import { Inter } from "next/font/google"  // Importação da font Inter 
import { Navbar } from "@/components/navbar"  // Importação do componente navbar
import { ThemeProvider } from "next-themes" // Gere o modo claro/escuro da aplicação
import { Toaster } from "@/components/ui/toaster" // Importação do toaster
import { ToastContainer } from "react-toastify"
import "@/app/globals.css"  // Estilos globais da aplicação
import { AuthProvider } from "@/components/auth/session-provider" // Contexto de autenticação da aplicação

// Configura a font Inter com suporte ao subconjunto "latin"
const inter = Inter({ subsets: ["latin"] })

// Define os metadados da aplicação, incluindo título e descrição
export const metadata = {
  title: "Biblio.Gest", // Título que aparece na aba do navegador
  description: "Gerenciamento de autores e livros", // Descrição usada para SEO e Open Graph
}

// Define o RootLayout, utilizado para estruturar todas as páginas da aplicação 
export default function RootLayout({
  children, // Contém o conteúdo dinâmico das páginas
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
              <ToastContainer />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



