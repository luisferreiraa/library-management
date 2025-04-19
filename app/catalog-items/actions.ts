"use server"

import {
    createCatalogItem,
    updateCatalogItem,
    deleteCatalogItem,
    deleteCatalogItems,
    getItemsByCatalog
} from "@/lib/catalog-items"
import { revalidatePath } from "next/cache"
import { logAudit } from "@/lib/session"
import { ItemType } from "@prisma/client"

export async function getItemsByCatalogAction(catalogId: string) {
    const catalogItems = await getItemsByCatalog(catalogId)
    return catalogItems
}

export async function createCatalogItemAction<T extends ItemType>(
    type: T,
    catalogId: string,
    data: Parameters<typeof createCatalogItem<T>>[2]
) {
    try {
        const newItem = await createCatalogItem(type, catalogId, data)

        await logAudit("Catalog Item", newItem.id, "CREATE_ITEM")

        revalidatePath("/catalog-items")
        return newItem
    } catch (error) {
        console.error("Erro ao criar item:", error)
        throw new Error(`Falha ao criar ${type}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
}

export async function updateCatalogItemAction<T extends ItemType>(
    itemId: string,
    type: T,
    data: Parameters<typeof updateCatalogItem<T>>[2]
) {
    try {
        const updatedItem = await updateCatalogItem(itemId, type, data)

        await logAudit("Catalog Item", itemId, "UPDATE_ITEM")

        revalidatePath("/catalog-items")
        return updatedItem
    } catch (error) {
        console.error("Update failed:", error);
        throw new Error(`Falha ao atualizar ${type}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
}

export async function deleteCatalogItemAction(itemId: string) {
    try {
        const item = await deleteCatalogItem(itemId)

        await logAudit("Catalog Item", itemId, "DELETE_ITEM")

        revalidatePath("/catalog-items")
    } catch (error) {
        throw new Error(`Falha ao excluir item: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
}

export async function deleteCatalogItemsAction(itemIds: string[]) {
    try {
        const items = await deleteCatalogItems(itemIds)

        await logAudit("Catalog Item", itemIds, "DELETE_ITEM")

        revalidatePath("/catalog-items")
    } catch (error) {
        throw new Error(`Falha ao excluir itens: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
}