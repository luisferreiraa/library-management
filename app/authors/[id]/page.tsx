import { notFound } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { ChevronLeft } from "lucide-react"
import { getAuthorWithBooks } from "@/lib/authors"
import { Button } from "@/components/ui/button"
import { AuthorBooks } from "@/components/authors/author-books"
import { Separator } from "@/components/ui/separator"

interface AuthorPageProps {
    params: {
        id: string
    }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
    // Extrair o ID do parâmetro antes de usá-lo
    const { id } = await params

    // Usar a variável id em vez de params.id
    const author = await getAuthorWithBooks(id)

    if (!author) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <div className="mb-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/authors" className="flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        Voltar para a lista
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{author.name}</h1>
                            <p className="text-muted-foreground">{author.email}</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-2">Biografia</h2>
                            <p className="text-muted-foreground">{author.bio || "Nenhuma biografia disponível."}</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-2">Informações</h2>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">ID</dt>
                                    <dd className="mt-1 text-sm">{author.id}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Registado em</dt>
                                    <dd className="mt-1 text-sm">{format(new Date(author.createdAt), "dd/MM/yyyy")}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Última atualização</dt>
                                    <dd className="mt-1 text-sm">{format(new Date(author.updatedAt), "dd/MM/yyyy")}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Total de livros</dt>
                                    <dd className="mt-1 text-sm">{author.books.length}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-3">
                    <Separator className="my-6" />
                    <h2 className="text-2xl font-bold tracking-tight mb-6">Livros</h2>
                    <AuthorBooks author={author} books={author.books} />
                </div>
            </div>
        </div>
    )
}

