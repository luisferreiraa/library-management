"use client"

import { deleteCatalogItems } from "@/lib/catalog-items"
import { Catalog, CatalogItem } from "@prisma/client"
import { Suspense, useState } from "react"
import { toast } from "react-toastify"
import { EmptyState } from "../ui/empty-state"
import { FolderOpen, PlusCircle } from "lucide-react"
import { Button } from "../ui/button"
import { CreateCatalogItemModal } from "./create-catalog-item-modal"
import { ItemsTable } from "./catalog-items-table"
import { ItemsProvider } from "@/contexts/catalog-items-context"
import { CreateItemButton } from "./create-catalog-item-button"
import { ItemsSearch } from "./catalog-items-search"
import { OrderItemsBy } from "./order-items-by"
import { FilterItems } from "./filter-items"
import { TableSkeleton } from "../ui/table-skeleton"

// Definir SortOptions type
export type SortOption = {
    value: string
    direction: "asc" | "desc"
}

interface CatalogItemsProps {
    catalog: Catalog
    catalogItems: CatalogItem[]
}

export default function CatalogItems({ catalog, catalogItems }: CatalogItemsProps) {

    const [isAddingItem, setIsAddingItem] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null)

    if (catalogItems.length === 0) {
        return (
            <>
                <EmptyState
                    icon={<FolderOpen className="h-10 w-10" />}
                    title="Nenhum item encontrado"
                    description="Este catálogo ainda não possui itens registados."
                    action={
                        <Button onClick={() => setIsAddingItem(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Adicionar Item
                        </Button>
                    }
                />
                <CreateCatalogItemModal
                    open={isAddingItem}
                    onOpenChange={setIsAddingItem}
                    catalogId={catalog.id}
                    catalogName={catalog.name}
                />
            </>
        )
    }

    return (
        <div className="space-y-4">
            <ItemsProvider initialItems={catalogItems}>
                <div className="container mx-auto px-4 py-10 max-w-6xl">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold tracking-tight">Itens</h1>
                        <CreateItemButton catalogId={catalog.id} catalogName={catalog.name} />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="w-full sm:max-w-sm">
                            <ItemsSearch />
                        </div>
                        <div className="w-full sm:max-w-xs">
                            <OrderItemsBy />
                        </div>
                        <div className="w-full sm:max-w-xs">
                            <FilterItems />
                        </div>
                    </div>
                    <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
                        <ItemsTable />
                    </Suspense>
                </div>
            </ItemsProvider>

            <CreateCatalogItemModal
                open={isAddingItem}
                onOpenChange={setIsAddingItem}
                catalogId={catalog.id}
                catalogName={catalog.name}
            />

            <CreateCatalogItemModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                catalogId={catalog.id}
                catalogName={catalog.name}
                item={selectedItem}
                onSuccess={() => {
                    setSelectedItem(null);
                }}
            />
        </div >
    )
}