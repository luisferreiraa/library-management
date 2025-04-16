import { Suspense } from "react"
import { getPublishers } from "@/lib/publishers"
import { PublishersTable } from "@/components/publishers/publishers-table"
import { CreatePublisherButton } from "@/components/publishers/create-publisher-button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { PublishersProvider } from "@/contexts/publishers-context"
import { PublishersSearch } from "@/components/publishers/publishers-search"
import { OrderPublishersBy } from "@/components/publishers/order-publishers-by"
import { FilterPublishers } from "@/components/publishers/filter-publishers"
import { getFilterOptions } from "@/lib/filter-options"

export default async function PublishersPage() {
    // Buscar dados no servidor
    const publishers = await getPublishers()
    const filterOptions = await getFilterOptions("publishers")

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <PublishersProvider initialEntities={publishers}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Editoras</h1>
                    <CreatePublisherButton />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="w-full sm:max-w-sm">
                        <PublishersSearch />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <OrderPublishersBy />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <FilterPublishers filterOptions={filterOptions} />
                    </div>
                </div>

                <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
                    <PublishersTable />
                </Suspense>
            </PublishersProvider>
        </div>
    )
}

