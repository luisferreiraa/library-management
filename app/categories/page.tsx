import { Suspense } from "react"
import { getCategories } from "@/lib/categories"
import { CategoriesTable } from "@/components/categories/categories-table"
import { CreateCategoryButton } from "@/components/categories/create-category-button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { CategoryProvider } from "@/contexts/categories-context"
import { CategoriesSearch } from "@/components/categories/categories-search"

export default async function CategoriesPage() {
    // Buscar dados no servidor
    const categories = await getCategories()

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <CategoryProvider initialCategories={categories}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
                    <CreateCategoryButton />
                </div>

                <div className="mb-6 max-w-sm">
                    <CategoriesSearch />
                </div>

                <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
                    <CategoriesTable />
                </Suspense>
            </CategoryProvider>
        </div>
    )
}

