import { Suspense } from "react"
import { getCategories } from "@/lib/categories"
import { CategoriesTable } from "@/components/categories/categories-table"
import { CreateCategoryButton } from "@/components/categories/create-category-button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { CategoryProvider } from "@/contexts/categories-context"
import { CategoriesSearch } from "@/components/categories/categories-search"
import { OrderCategoriesBy } from "@/components/categories/order-categories-by"
import { FilterCategories } from "@/components/categories/filter-categories"
import { getFilterOptions } from "@/lib/filter-options"

export default async function CategoriesPage() {
    // Buscar dados no servidor
    const categories = await getCategories()
    const filterOptions = await getFilterOptions("categories")

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <CategoryProvider initialCategories={categories}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
                    <CreateCategoryButton />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="w-full sm:max-w-sm">
                        <CategoriesSearch />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <OrderCategoriesBy />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <FilterCategories filterOptions={filterOptions} />
                    </div>
                </div>

                <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
                    <CategoriesTable />
                </Suspense>
            </CategoryProvider>
        </div>
    )
}

