"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, BookCopy, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export default function HomePage() {
    const { data: session, status } = useSession()

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        )
    }

    if (!session) {
        redirect("/login")
    }

    const isAdmin = session.user.role === "ADMIN"

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Bem-vindo, {session.user.name}</h1>
                    <p className="text-muted-foreground">{isAdmin ? "Acesso de Administrador" : "Acesso de Usuário"}</p>
                </div>
                <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {isAdmin && (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle>Gerenciar Livros</CardTitle>
                                <CardDescription>Adicione, edite e remova livros do sistema</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <BookOpen className="h-12 w-12 text-primary" />
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href="/books">Acessar</Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Gerenciar Autores</CardTitle>
                                <CardDescription>Adicione, edite e remova autores do sistema</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Users className="h-12 w-12 text-primary" />
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href="/authors">Acessar</Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Gerenciar Usuários</CardTitle>
                                <CardDescription>Adicione, edite e remova usuários do sistema</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Users className="h-12 w-12 text-primary" />
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href="/users">Acessar</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Catálogo de Livros</CardTitle>
                        <CardDescription>Explore o catálogo de livros disponíveis</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BookCopy className="h-12 w-12 text-primary" />
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link href="/catalog">Acessar</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

