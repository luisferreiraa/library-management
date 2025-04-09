import { Suspense } from "react"
import { getLanguages } from "@/lib/languages"
import { LanguagesTable } from "@/components/languages/languages-table"
import { CreateLanguageButton } from "@/components/languages/create-language-button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { LanguagesProvider } from "@/contexts/languages-context"
import { LanguagesSearch } from "@/components/languages/languages-search"
import { OrderLanguagesBy } from "@/components/languages/order-languages-by"
import { FilterLanguages } from "@/components/languages/filter-languages"

export default async function LanguagesPage() {
    // Buscar dados no servidor
    const languages = await getLanguages()

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <LanguagesProvider initialLanguages={languages}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Idiomas</h1>
                    <CreateLanguageButton />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="w-full sm:max-w-sm">
                        <LanguagesSearch />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <OrderLanguagesBy />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <FilterLanguages />
                    </div>
                </div>

                <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
                    <LanguagesTable />
                </Suspense>
            </LanguagesProvider>
        </div>
    )
}

