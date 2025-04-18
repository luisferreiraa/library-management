"use server"

import { createCatalog, deleteCatalogs, updateCatalog } from "@/lib/catalogs"
import { getLibraryById } from "@/lib/libraries"
import prisma from "@/lib/prisma"
import { logAudit } from "@/lib/session"
import { revalidatePath } from "next/cache"
import slugify from "slugify"

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

export async function updateCatalogAction({
    id,
    name,
    libraryId,
    isActive
}: {
    id: string,
    name: string,
    libraryId: string,
    isActive: boolean
}) {
    try {
        // 1. Busca o catálogo atual
        const currentCatalog = await prisma.catalog.findUnique({ where: { id } });

        // 2. Gera novo slug apenas se o nome mudou
        const slug = (name !== currentCatalog?.name)
            ? slugify(name, { lower: true })
            : currentCatalog.slug;

        // 3. Atualiza com o novo slug
        const updatedCatalog = await prisma.catalog.update({
            where: { id },
            data: {
                name,
                isActive,
                slug,
                libraryId
            }
        });

        await logAudit("Catalog", id, "UPDATE_CATALOG");
        revalidatePaths(id);

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erro na atualização"
        };
    }
}

// Função auxiliar para revalidação
function revalidatePaths(catalogId: string) {
    revalidatePath("/catalogs");
    revalidatePath(`/catalogs/${catalogId}`);
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