import { CreateCatalogButton } from "@/components/catalogs/create-catalog-button";
import { FilterCatalogs } from "@/components/catalogs/filter-catalogs";
import { CatalogsSearch } from "@/components/catalogs/catalogs-search";
import { CatalogsTable } from "@/components/catalogs/catalogs-table";
import { OrderCatalogsBy } from "@/components/catalogs/order-catalogs-by";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { CatalogsProvider } from "@/contexts/catalogs-context";
import { getCatalogs } from "@/lib/catalogs";
import { Suspense } from "react";
import { LibraryProvider } from "@/contexts/libraries-context";
import { getLibraries } from "@/lib/libraries";

export default async function CatalogPage() {

    const catalogs = await getCatalogs()
    const libraries = await getLibraries()

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <CatalogsProvider initialEntities={catalogs} entityType="catalogs">
                <LibraryProvider initialEntities={libraries} entityType="libraries">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold tracking-tight">Catálogos</h1>
                        <CreateCatalogButton />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="w-full sm:max-w-sm">
                            <CatalogsSearch />
                        </div>
                        <div className="w-full sm:max-w-xs">
                            <OrderCatalogsBy />
                        </div>
                        <div className="w-full sm:max-w-xs">
                            <FilterCatalogs />
                        </div>
                    </div>

                    <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
                        <CatalogsTable />
                    </Suspense>
                </LibraryProvider>
            </CatalogsProvider>
        </div>
    )
}
