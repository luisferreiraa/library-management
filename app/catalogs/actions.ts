"use server"

import { createCatalog, deleteCatalogs, updateCatalog } from "@/lib/catalogs"
import { logAudit } from "@/lib/session"
import { revalidatePath } from "next/cache"

export async function createCatalogAction(catalogData: { name: string, libraryId: string, isActive: boolean }): Promise<any> {
    try {
        const newCatalog = await createCatalog(catalogData)

        await logAudit("Catalog", newCatalog.id, "CREATE_CATALOG")

        revalidatePath("/catalogs")

        return newCatalog
    } catch (error: any) {
        throw new Error("Erro ao criar catalog: " + error.message)
    }
}

export async function updateCatalogAction(catalogData: {
    id: string,
    name: string,
    libraryId: string,
    isActive: boolean
}): Promise<any> {
    try {
        const updatedCatalog = await updateCatalog(
            catalogData.id,
            {
                name: catalogData.name,
                libraryId: catalogData.id,
                isActive: catalogData.isActive
            }
        )

        await logAudit("Catalog", catalogData.id, "UPDATE_CATALOG")

        revalidatePath("/catalogs")
        revalidatePath(`/catalogs/${catalogData.id}`)

        return updateCatalog
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Erro ao atualizar catalog (ID: ${catalogData.id}): ${error.message}`)
        }
        throw new Error("Erro desconhecido ao atualizar catalog.")
    }
}

export async function deleteCatalogsAction(catalogIds: string[]): Promise<void> {
    try {
        await deleteCatalogs(catalogIds)

        await logAudit("Catalog", catalogIds, "DELETE_CATALOG")

        revalidatePath("/catalogs")
    } catch (error: any) {
        throw new Error("Erro ao excluir catalog: " + error.message)
    }
}