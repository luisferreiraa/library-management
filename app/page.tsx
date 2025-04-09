"use client"

import { useSession } from "next-auth/react"    // Hook para obter a sessão do utilizador autenticado
import { redirect } from "next/navigation"  // Função para redirecionamento de página no next.js
import Link from "next/link"    // Componente para navegação interna entre páginas
import { Button } from "@/components/ui/button" // Componente de botão importadoda UI personalizada
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"    // Componentes de Card para UI
import { BookOpen, Users, BookCopy, LogOut, ScanSearch, CircleUser } from "lucide-react"    // Ícones importados da biblioteca Lucide
import { signOut } from "next-auth/react"   // Função para logout do NextAuth

export default function HomePage() {
    // Obtém os dados da sessão do utilizador e o status da autenticação
    const { data: session, status } = useSession()

    // Se a sessão estiver a carregar, exibe um indicador de carregamento
    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        )
    }

    // Se não houver sessão ativa, redireciona para a página de login
    if (!session) {
        redirect("/login")
    }

    // Verifica se o utilizador tem o role de ADMIN
    const isAdmin = session.user.role === "ADMIN"

    return (
        <div className="container mx-auto px-4 py-10">
            {/* Cabeçalho da página com mensagem de boas-vindas e botão de logout */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Bem-vindo, {session.user.name}</h1>
                    <p className="text-muted-foreground">{isAdmin ? "Acesso de Administrador" : "Acesso de Usuário"}</p>
                </div>
                {/* Botão para sair da sessão */}
                <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                </Button>
            </div>

            {/* Grid responsivo com opções de navegação */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Se o utilizador for ADMIN, exibe as opções de gestão */}
                {isAdmin && (
                    <>

                        <Card>
                            <CardHeader>
                                <CardTitle>Pesquisa Bibliográfica</CardTitle>
                                <CardDescription>Procure livros na Base Nacional de Dados Bibliográficos</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScanSearch className="h-12 w-12 text-primary" />
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href="/search-porbase">Aceder</Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Gerir Livros</CardTitle>
                                <CardDescription>Adicione, edite e remova livros do sistema</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <BookOpen className="h-12 w-12 text-primary" />
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href="/books">Aceder</Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Gerir Autores</CardTitle>
                                <CardDescription>Adicione, edite e remova autores do sistema</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Users className="h-12 w-12 text-primary" />
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href="/authors">Aceder</Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Gerir Utilizadores</CardTitle>
                                <CardDescription>Adicione, edite e remova utilizadores do sistema</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Users className="h-12 w-12 text-primary" />
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href="/users">Aceder</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </>
                )}

                {/* Opção disponível para todos os utilizadores */}
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
                            <Link href="/catalog">Aceder</Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>A Minha Conta</CardTitle>
                        <CardDescription>Explore o seu histórico de empréstimos e a sua conta corrente</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CircleUser className="h-12 w-12 text-primary" />
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link href="/my-account">Aceder</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

