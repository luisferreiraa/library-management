import { Suspense } from "react"
import { getTranslators } from "@/lib/translators"
import { TranslatorsTable } from "@/components/translators/translators-table"
import { CreateTranslatorButton } from "@/components/translators/create-translator-button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { TranslatorsProvider } from "@/contexts/translators-context"
import { TranslatorsSearch } from "@/components/translators/translators-search"
import { OrderTranslatorsBy } from "@/components/translators/order-translators-by"
import { FilterTranslators } from "@/components/translators/filter-translators"

export default async function TranslatorsPage() {
    // Buscar dados no servidor
    const translators = await getTranslators()

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <TranslatorsProvider initialEntities={translators} entityType="translators">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Tradutores</h1>
                    <CreateTranslatorButton />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="w-full sm:max-w-sm">
                        <TranslatorsSearch />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <OrderTranslatorsBy />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <FilterTranslators />
                    </div>
                </div>

                <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
                    <TranslatorsTable />
                </Suspense>
            </TranslatorsProvider>
        </div>
    )
}

