import { Suspense } from "react"
import { getPublishers } from "@/lib/publishers"
import { PublishersTable } from "@/components/publishers/publishers-table"
import { CreatePublisherButton } from "@/components/publishers/create-publisher-button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { PublishersProvider } from "@/contexts/publishers-context"

export default async function PublishersPage() {
    // Buscar dados no servidor
    const publishers = await getPublishers()

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <PublishersProvider initialPublishers={publishers}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Editoras</h1>
                    <CreatePublisherButton />
                </div>

                <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
                    <PublishersTable />
                </Suspense>
            </PublishersProvider>
        </div>
    )
}

