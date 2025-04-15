// app/(super-admin)/library-networks/page.tsx
import { CreateLibraryNetworkButton } from "@/components/library-networks/create-library-network-button";
import { FilterLibraryNetworks } from "@/components/library-networks/filter-library-networks";
import { LibraryNetworksSearch } from "@/components/library-networks/library-networks-search";
import { LibraryNetworksTable } from "@/components/library-networks/library-networks-table";
import { OrderLibraryNetworksBy } from "@/components/library-networks/order-library-networks-by";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { LibraryNetworkProvider } from "@/contexts/library-networks-context";
import { getLibraryNetworks } from "@/lib/library-networks";
import { Suspense } from "react";

// LibraryNetworkPage vai buscar os dados do servidor
export default async function LibraryNetworkPage() {
    const libraryNetworks = await getLibraryNetworks()

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <LibraryNetworkProvider initialEntities={libraryNetworks}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Redes de Bibliotecas</h1>
                    <CreateLibraryNetworkButton />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="w-full sm:max-w-sm">
                        <LibraryNetworksSearch />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <OrderLibraryNetworksBy />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <FilterLibraryNetworks />
                    </div>
                </div>

                <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
                    <LibraryNetworksTable />
                </Suspense>
            </LibraryNetworkProvider>
        </div>
    )
}
