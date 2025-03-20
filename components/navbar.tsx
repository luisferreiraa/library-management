"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Book, Users, BookOpenCheck, Tag, Menu, PenTool, LogOut, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
    { href: "/users", label: "Utilizadores", icon: Users, adminOnly: true },
    { href: "/authors", label: "Autores", icon: PenTool, adminOnly: true },
    { href: "/books", label: "Livros", icon: Book, adminOnly: true },
    { href: "/publishers", label: "Editoras", icon: BookOpenCheck, adminOnly: true },
    { href: "/categories", label: "Categorias", icon: Tag, adminOnly: true },
    { href: "/catalog", label: "Catálogo", icon: Book, adminOnly: false },
]

export function Navbar() {
    const { data: session, status } = useSession()
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    // Verificar se o usuário é admin
    const isAdmin = session?.user?.role?.toLowerCase() === "admin"

    // Filtrar itens de navegação com base no papel do usuário
    const filteredNavItems = navItems.filter((item) => !item.adminOnly || isAdmin)

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

    // Obter as iniciais do nome do usuário para o avatar
    const getInitials = () => {
        if (!session?.user?.name) return "U"
        return session.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
    }

    // Função para lidar com a navegação
    const handleNavigation = (href: string) => {
        // Usar navegação imperativa para contornar problemas com o middleware
        window.location.href = href
    }

    return (
        <nav className="bg-background border-b sticky top-0 z-10">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link
                        href="/"
                        className="text-2xl font-bold text-primary"
                        onClick={(e) => {
                            e.preventDefault()
                            handleNavigation("/")
                        }}
                    >
                        Biblio.Gest
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {filteredNavItems.map((item) => {
                            const isActive = pathname.startsWith(item.href)
                            return (
                                <Button
                                    key={item.href}
                                    variant="ghost"
                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                    onClick={() => handleNavigation(item.href)}
                                >
                                    <item.icon className="h-4 w-4 mr-2" />
                                    {item.label}
                                </Button>
                            )
                        })}

                        <ThemeToggle />

                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                                            <AvatarFallback>{getInitials()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleNavigation("/profile")}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Perfil</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => signOut({ callbackUrl: "/login" })}
                                        className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Sair</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button onClick={() => handleNavigation("/login")}>Entrar</Button>
                        )}
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex md:hidden items-center space-x-2">
                        <ThemeToggle />

                        {session && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                                            <AvatarFallback>{getInitials()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleNavigation("/profile")}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Perfil</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => signOut({ callbackUrl: "/login" })}
                                        className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Sair</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

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
                                    {filteredNavItems.map((item) => {
                                        const isActive = pathname.startsWith(item.href)
                                        return (
                                            <Button
                                                key={item.href}
                                                variant="ghost"
                                                className={`flex items-center justify-start px-3 py-2 rounded-md text-sm font-medium ${isActive
                                                        ? "bg-primary text-primary-foreground"
                                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                    }`}
                                                onClick={() => handleNavigation(item.href)}
                                            >
                                                <item.icon className="h-4 w-4 mr-2" />
                                                {item.label}
                                            </Button>
                                        )
                                    })}

                                    {!session && (
                                        <Button variant="default" className="mt-4" onClick={() => handleNavigation("/login")}>
                                            Entrar
                                        </Button>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}

