import { Suspense } from "react"
import { getBookStatus } from "@/lib/bookstatus"
import { BookStatusesTable } from "@/components/bookStatuses/bookStatuses-table"
import { CreateBookStatusButton } from "@/components/bookStatuses/create-bookStatus-button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { BookStatusesProvider } from "@/contexts/bookstatus-context"
import { BookStatusSearch } from "@/components/bookStatuses/bookstatus-search"
import { OrderBookStatusBy } from "@/components/bookStatuses/order-book-status-by"
import { FilterBookStatus } from "@/components/bookStatuses/filter-book-status"

export default async function BookStatusPage() {
    // Buscar dados no servidor
    const bookStatuses = await getBookStatus()

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <BookStatusesProvider initialBookStatuses={bookStatuses}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Book Status</h1>
                    <CreateBookStatusButton />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="w-full sm:max-w-sm">
                        <BookStatusSearch />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <OrderBookStatusBy />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <FilterBookStatus />
                    </div>
                </div>

                <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
                    <BookStatusesTable />
                </Suspense>
            </BookStatusesProvider>
        </div>
    )
}

