import { Suspense } from "react"
import { getTranslators } from "@/lib/translators"
import { TranslatorsTable } from "@/components/translators/translators-table"
import { CreateTranslatorButton } from "@/components/translators/create-translator-button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { TranslatorsProvider } from "@/contexts/translators-context"
import { TranslatorsSearch } from "@/components/translators/translators-search"

export default async function TranslatorsPage() {
    // Buscar dados no servidor
    const translators = await getTranslators()

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <TranslatorsProvider initialTranslators={translators}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Tradutores</h1>
                    <CreateTranslatorButton />
                </div>

                <div className="mb-6 max-w-sm">
                    <TranslatorsSearch />
                </div>

                <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
                    <TranslatorsTable />
                </Suspense>
            </TranslatorsProvider>
        </div>
    )
}

