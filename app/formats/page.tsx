import { Suspense } from "react"
import { getFormats } from "@/lib/formats"
import { FormatsTable } from "@/components/formats/formats-table"
import { CreateFormatButton } from "@/components/formats/create-format-button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { FormatsProvider } from "@/contexts/formats-context"

export default async function FormatsPage() {
    // Buscar dados no servidor
    const formats = await getFormats()

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <FormatsProvider initialFormats={formats}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Formatos</h1>
                    <CreateFormatButton />
                </div>

                <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
                    <FormatsTable />
                </Suspense>
            </FormatsProvider>
        </div>
    )
}

