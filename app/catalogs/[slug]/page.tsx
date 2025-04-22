import { getItemsByCatalogAction } from "@/app/catalog-items/actions"
import CatalogItems from "@/components/catalogs/catalog-items"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getCatalogBySlug } from "@/lib/catalogs"
import { format } from "date-fns"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface CatalogPageProps {
    params: {
        slug: string
    }
}

export default async function CatalogPage({ params }: CatalogPageProps) {
    const { slug } = params
    const catalog = await getCatalogBySlug(slug)

    if (!catalog) {
        notFound()
    }
    const catalogItems = await getItemsByCatalogAction(catalog.id)

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <div className="mb-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/catalogs" className="flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        Voltar para a lista
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{catalog.name}</h1>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-2">Informações</h2>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">ID</dt>
                                    <dd className="mt-1 text-sm">{catalog.id}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Registado em</dt>
                                    <dd className="mt-1 text-sm">{format(new Date(catalog.createdAt), "dd/MM/yyyy")}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Última atualização</dt>
                                    <dd className="mt-1 text-sm">{format(new Date(catalog.updatedAt), "dd/MM/yyyy")}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Total de itens</dt>
                                    <dd className="mt-1 text-sm">{catalogItems.length}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-3">
                    <Separator className="my-6" />
                    <CatalogItems catalog={catalog} catalogItems={catalogItems} />
                </div>
            </div>
        </div>
    )
}