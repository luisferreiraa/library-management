import { Suspense } from "react"
import { getFormats } from "@/lib/formats"
import { FormatsTable } from "@/components/formats/formats-table"
import { CreateFormatButton } from "@/components/formats/create-format-button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { FormatsProvider } from "@/contexts/formats-context"
import { FormatsSearch } from "@/components/formats/formats-search"
import { OrderFormatsBy } from "@/components/formats/order-formats-by"
import { FilterFormats } from "@/components/formats/filter-formats"
import { getFilterOptions } from "@/lib/filter-options"

export default async function FormatsPage() {
    // Buscar dados no servidor
    const formats = await getFormats()
    const filterOptions = await getFilterOptions("formats")

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <FormatsProvider initialEntities={formats} entityType="formats">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Formatos</h1>
                    <CreateFormatButton />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="w-full sm:max-w-sm">
                        <FormatsSearch />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <OrderFormatsBy />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <FilterFormats />
                    </div>
                </div>

                <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
                    <FormatsTable />
                </Suspense>
            </FormatsProvider>
        </div>
    )
}

