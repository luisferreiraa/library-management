"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, Users, BookOpenCheck, Tag, Menu, PenTool } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"

const navItems = [
    { href: "/users", label: "Utilizadores", icon: Users },
    { href: "/authors", label: "Autores", icon: PenTool },
    { href: "/books", label: "Livros", icon: Book },
    { href: "/publishers", label: "Editoras", icon: BookOpenCheck },
    { href: "/categories", label: "Categorias", icon: Tag },
    // Você pode adicionar mais links aqui no futuro
]

export function Navbar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    // Fechar o menu quando mudar para desktop
    useEffect(() => {
        if (isDesktop) {
            setOpen(false)
        }
    }, [isDesktop])

    // Fechar o menu quando navegar para outra página
    useEffect(() => {
        setOpen(false)
    }, [pathname])

    return (
        <nav className="bg-background border-b sticky top-0 z-10">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-primary">
                        Biblio.Gest
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {navItems.map((item) => {
                            const isActive = pathname.startsWith(item.href)
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                >
                                    <item.icon className="h-4 w-4 mr-2" />
                                    {item.label}
                                </Link>
                            )
                        })}
                        <ThemeToggle />
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex md:hidden items-center space-x-2">
                        <ThemeToggle />
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label="Menu">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <SheetHeader className="mb-4">
                                    <SheetTitle>Menu</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col space-y-2">
                                    {navItems.map((item) => {
                                        const isActive = pathname.startsWith(item.href)
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                    }`}
                                            >
                                                <item.icon className="h-4 w-4 mr-2" />
                                                {item.label}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}

