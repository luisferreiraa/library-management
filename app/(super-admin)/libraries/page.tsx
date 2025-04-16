// app/(super-admin)/library-networks/page.tsx
import { CreateLibraryButton } from "@/components/libraries/create-library-button";
import { FilterLibraries } from "@/components/libraries/filter-libraries";
import { LibrariesSearch } from "@/components/libraries/libraries-search";
import { LibrariesTable } from "@/components/libraries/libraries-table";
import { OrderLibrariesBy } from "@/components/libraries/order-libraries-by";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { LibraryProvider } from "@/contexts/libraries-context";
import { LibraryNetworkProvider } from "@/contexts/library-networks-context";
import { getFilterOptions } from "@/lib/filter-options";
import { getLibraries } from "@/lib/libraries";
import { getLibraryNetworks } from "@/lib/library-networks";
import { Suspense } from "react";

export default async function LibraryPage() {

    const libraries = await getLibraries()
    const libraryNetworks = await getLibraryNetworks()
    const filterOptions = await getFilterOptions("libraries")

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <LibraryProvider initialEntities={libraries}>
                <LibraryNetworkProvider initialEntities={libraryNetworks}>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold tracking-tight">Bibliotecas</h1>
                        <CreateLibraryButton />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="w-full sm:max-w-sm">
                            <LibrariesSearch />
                        </div>
                        <div className="w-full sm:max-w-xs">
                            <OrderLibrariesBy />
                        </div>
                        <div className="w-full sm:max-w-xs">
                            <FilterLibraries filterOptions={filterOptions} />
                        </div>
                    </div>

                    <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
                        <LibrariesTable />
                    </Suspense>
                </LibraryNetworkProvider>
            </LibraryProvider>
        </div>
    )
}
