import { notFound } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { LanguageBooks } from "@/components/languages/language-books"
import { getLanguageWithBooks } from "@/lib/languages"

interface LanguagePageProps {
    params: {
        slug: string
    }
}

export default async function LanguagePage({ params }: LanguagePageProps) {

    const { slug } = await params
    const language = await getLanguageWithBooks(slug)

    if (!language) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <div className="mb-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/languages" className="flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        Voltar para a lista
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{language.name}</h1>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-2">Informações</h2>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">ID</dt>
                                    <dd className="mt-1 text-sm">{language.id}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Registado em</dt>
                                    <dd className="mt-1 text-sm">{format(new Date(language.createdAt), "dd/MM/yyyy")}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Última atualização</dt>
                                    <dd className="mt-1 text-sm">{format(new Date(language.updatedAt), "dd/MM/yyyy")}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Total de livros</dt>
                                    <dd className="mt-1 text-sm">{language.books.length}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-3">
                    <Separator className="my-6" />
                    <h2 className="text-2xl font-bold tracking-tight mb-6">Livros</h2>
                    <LanguageBooks language={language} />
                </div>
            </div>
        </div>

    )
}