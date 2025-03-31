"use server"

import { revalidatePath } from "next/cache"
import { createCategory, deleteCategories, updateCategory } from "@/lib/categories"
import { logAudit } from "@/lib/session";

export async function createCategoryAction(categoryData: { name: string, isActive: boolean }): Promise<any> {
    try {
        // Criar a categoria na base de dados
        const newCategory = await createCategory(categoryData)

        // Criar auditLog
        await logAudit("Category", newCategory.id, "CREATE_CATEGORY");

        // Revalidar o caminho para atualizar dados
        revalidatePath("/categories")

        return newCategory
    } catch (error: any) {
        throw new Error("Erro ao criar categoria: " + error.message)
    }
}

export async function updateCategoryAction(categoryData: {
    id: string
    name: string
    isActive: boolean
}): Promise<any> {
    try {
        // Atualizar a categoria na base de dados
        const updatedCategory = await updateCategory(categoryData.id, {
            name: categoryData.name,
            isActive: categoryData.isActive,
        })

        // Criar auditLog
        await logAudit("Category", categoryData.id, "UPDATE_CATEGORY")

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/categories")
        revalidatePath(`/categories/${categoryData.id}`)

        return updatedCategory
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Erro ao atualizar categoria (ID: ${categoryData.id}): ${error.message}`);
        }
        throw new Error("Erro desconhecido ao atualizar categoria.");
    }
}

export async function deleteCategoriesAction(categoryIds: string[]): Promise<void> {
    try {
        // Excluir as categorias da base de dados
        await deleteCategories(categoryIds)

        // Criar auditLog
        await logAudit("Category", categoryIds, "DELETE_CATEGORY");

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/categories")
    } catch (error: any) {
        throw new Error("Erro ao excluir categorias: " + error.message)
    }
}