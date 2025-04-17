import { LibraryCatalogs } from "@/components/libraries/library-catalogs"
import { Button } from "@/components/ui/button"
import { getLibraryBySlug } from "@/lib/libraries"
import { Separator } from "@radix-ui/react-select"
import { format } from "date-fns"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface LibraryPageProps {
    params: {
        slug: string
    }
}

export default async function LibraryPage({ params }: LibraryPageProps) {

    // Extrair o slug do parâmetro antes de usá-lo
    const { slug } = await params

    // Usar a variável id em vez de params.id
    const library = await getLibraryBySlug(slug)

    if (!library) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <div className="mb-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/libraries" className="flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        Voltar para a lista
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{library.name}</h1>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-2">Informações</h2>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">ID</dt>
                                    <dd className="mt-1 text-sm">{library.id}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Registado em</dt>
                                    <dd className="mt-1 text-sm">{format(new Date(library.createdAt), "dd/MM/yyyy")}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Última atualização</dt>
                                    <dd className="mt-1 text-sm">{format(new Date(library.updatedAt), "dd/MM/yyyy")}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Total de catálogos</dt>
                                    <dd className="mt-1 text-sm">{library.catalog.length}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-3">
                    <Separator className="my-6" />
                    <h2 className="text-2xl font-bold tracking-tight mb-6">Catálogos</h2>
                    <LibraryCatalogs library={library} />
                </div>
            </div>
        </div>
    )
}