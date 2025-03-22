"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Book, Users, BookOpenCheck, Tag, Menu, PenTool, LogOut, User, ShieldAlert, BookMarked, BookText, Languages, FileText, Settings, ScrollText, ScrollTextIcon, ChevronDown } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"

// Definição da estrutura de navegação
type NavItem = {
    label: string
    href?: string
    icon: React.ElementType
    adminOnly?: boolean
    children?: NavItem[]
}

const navItems: NavItem[] = [
    {
        label: "Gestão de Utilizadores",
        icon: Users,
        adminOnly: true,
        children: [
            { label: "Utilizadores", href: "/users", icon: User, adminOnly: true },
            { label: "Roles", href: "/roles", icon: ShieldAlert, adminOnly: true },
        ],
    },
    {
        label: "Gestão de Livros",
        icon: Book,
        adminOnly: true,
        children: [
            { label: "Livros", href: "/books", icon: BookMarked, adminOnly: true },
            { label: "Autores", href: "/authors", icon: PenTool, adminOnly: true },
            { label: "Editoras", href: "/publishers", icon: BookOpenCheck, adminOnly: true },
            { label: "Categorias", href: "/categories", icon: Tag, adminOnly: true },
            { label: "Tradutores", href: "/translators", icon: User, adminOnly: true },
            { label: "Formatos", href: "/formats", icon: BookText, adminOnly: true },
            { label: "Idiomas", href: "/languages", icon: Languages, adminOnly: true },
            { label: "Estados", href: "/bookstatuses", icon: FileText, adminOnly: true },
        ],
    },
    {
        label: "Regras e Configurações",
        icon: Settings,
        adminOnly: true,
        children: [
            { label: "Regras de Multa", href: "/penaltyrules", icon: ScrollText, adminOnly: true },
        ],
    },
    {
        label: "Registos e Auditoria",
        icon: ScrollTextIcon,
        adminOnly: true,
        children: [
            { label: "Logs", href: "/logs", icon: Book, adminOnly: true },
        ]
    }
]

export function Navbar() {
    const { data: session, status } = useSession()
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [openCollapsibles, setOpenCollapsibles] = useState<Record<string, boolean>>({})

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

    // Função para alternar o estado do collapsible
    const toggleCollapsible = (label: string) => {
        setOpenCollapsibles((prev) => ({
            ...prev,
            [label]: !prev[label],
        }))
    }

    // Verificar se um item ou seus filhos estão ativos
    const isItemActive = (item: NavItem): boolean => {
        if (item.href && pathname.startsWith(item.href)) {
            return true
        }
        if (item.children) {
            return item.children.some((child) => child.href && pathname.startsWith(child.href))
        }
        return false
    }


    return (
        <nav className="bg-background border-b sticky top-0 z-10">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="text-2xl font-bold text-primary cursor-pointer" onClick={() => handleNavigation("/")}>
                        Biblio.Gest
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {filteredNavItems.map((item) => {
                            // Se o item tem filhos, renderizar um dropdown
                            if (item.children && item.children.length > 0) {
                                return (
                                    <DropdownMenu key={item.label}>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isItemActive(item)
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                    }`}
                                            >
                                                <item.icon className="h-4 w-4 mr-2" />
                                                {item.label}
                                                <ChevronDown className="h-4 w-4 ml-1" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuGroup>
                                                {item.children.map((child) => (
                                                    <DropdownMenuItem
                                                        key={child.label}
                                                        onClick={() => child.href && handleNavigation(child.href)}
                                                        className={pathname.startsWith(child.href || "") ? "bg-accent" : ""}
                                                    >
                                                        <child.icon className="h-4 w-4 mr-2" />
                                                        {child.label}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )
                            }

                            // Se o item não tem filhos, renderizar um botão normal
                            return (
                                <Button
                                    key={item.label}
                                    variant="ghost"
                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${pathname.startsWith(item.href || "")
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                    onClick={() => item.href && handleNavigation(item.href)}
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
                            <SheetContent side="right" className="overflow-y-auto">
                                <SheetHeader className="mb-4">
                                    <SheetTitle>Menu</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col space-y-2">
                                    {filteredNavItems.map((item) => {
                                        // Se o item tem filhos, renderizar um collapsible
                                        if (item.children && item.children.length > 0) {
                                            return (
                                                <Collapsible
                                                    key={item.label}
                                                    open={openCollapsibles[item.label]}
                                                    onOpenChange={() => toggleCollapsible(item.label)}
                                                    className="w-full"
                                                >
                                                    <CollapsibleTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium ${isItemActive(item)
                                                                ? "bg-primary text-primary-foreground"
                                                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                                }`}
                                                        >
                                                            <div className="flex items-center">
                                                                <item.icon className="h-4 w-4 mr-2" />
                                                                {item.label}
                                                            </div>
                                                            <ChevronDown
                                                                className={`h-4 w-4 transition-transform ${openCollapsibles[item.label] ? "rotate-180" : ""}`}
                                                            />
                                                        </Button>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="pl-6 space-y-1 mt-1">
                                                        {item.children.map((child) => (
                                                            <Button
                                                                key={child.label}
                                                                variant="ghost"
                                                                className={`flex items-center justify-start w-full px-3 py-2 rounded-md text-sm font-medium ${pathname.startsWith(child.href || "")
                                                                    ? "bg-accent text-accent-foreground"
                                                                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                                                                    }`}
                                                                onClick={() => child.href && handleNavigation(child.href)}
                                                            >
                                                                <child.icon className="h-4 w-4 mr-2" />
                                                                {child.label}
                                                            </Button>
                                                        ))}
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            )
                                        }

                                        // Se o item não tem filhos, renderizar um botão normal
                                        return (
                                            <Button
                                                key={item.label}
                                                variant="ghost"
                                                className={`flex items-center justify-start w-full px-3 py-2 rounded-md text-sm font-medium ${pathname.startsWith(item.href || "")
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                    }`}
                                                onClick={() => item.href && handleNavigation(item.href)}
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

