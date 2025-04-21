"use client"

import { deleteCatalogItems } from "@/lib/catalog-items"
import { Catalog, CatalogItem } from "@prisma/client"
import { useState } from "react"
import { toast } from "react-toastify"
import { EmptyState } from "../ui/empty-state"
import { FolderOpen, PlusCircle } from "lucide-react"
import { Button } from "../ui/button"
import { CreateCatalogItemModal } from "./create-catalog-item-modal"

interface CatalogItemsProps {
    catalog: Catalog
    catalogItems: CatalogItem[]
}

export default function CatalogItems({ catalog, catalogItems }: CatalogItemsProps) {

    const [isAddingItem, setIsAddingItem] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null)
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])

    const allSelected = catalogItems.length > 0 && catalogItems.every((c) => selectedItemIds.includes(c.id))
    const someSelected = selectedItemIds.length > 0 && !allSelected;

    const toggleItemSelection = (id: string) => {
        setSelectedItemIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        )
    }

    const toggleAllItems = (selected: boolean) => {
        if (selected) {
            setSelectedItemIds(catalogItems.map((e) => e.id))
        } else {
            setSelectedItemIds([])
        }
    }

    const clearSelection = () => setSelectedItemIds([])

    const hasSelection = selectedItemIds.length > 0

    const handleEditItem = (catalogItem: CatalogItem) => {
        setSelectedItem(catalogItem)
        setIsEditModalOpen(true)
    }

    const handleDeleteSelected = async () => {
        if (selectedItemIds.length === 0) return

        try {
            setIsDeleting(true)
            await deleteCatalogItems(selectedItemIds)

            const message = selectedItemIds.length === 1
                ? "Item excluído com sucesso"
                : `Itens excluídos com sucesso (${selectedItemIds.length})`;

            toast.success(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })

            setIsDialogOpen(false)
        } catch (error) {

            const errorMessage = selectedItemIds.length === 1
                ? "Erro ao excluir item"
                : "Erro ao excluir itens";

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        } finally {
            setIsDeleting(false)
        }
    }

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
        <div>
            <Button onClick={() => setIsAddingItem(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Item
            </Button>

            <h2>{catalog.name}</h2>
            <ul>
                {catalogItems.map((item) => (
                    <li key={item.id}>{item.title}</li>
                ))}
            </ul>
            <CreateCatalogItemModal
                open={isAddingItem}
                onOpenChange={setIsAddingItem}
                catalogId={catalog.id}
                catalogName={catalog.name}
            />
        </div>
    )
}