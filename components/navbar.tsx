"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, Users, BookOpenCheck, Tag } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
    { href: "/authors", label: "Autores", icon: Users },
    { href: "/books", label: "Livros", icon: Book },
    { href: "/publishers", label: "Editoras", icon: BookOpenCheck },
    { href: "/categories", label: "Categorias", icon: Tag },
]

export function Navbar() {
    const pathname = usePathname()

    return (
        <nav className="bg-background border-b">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-primary">
                        Biblio.Gest
                    </Link>

                    <div className="flex items-center space-x-4">
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
                </div>
            </div>
        </nav>
    )
}

