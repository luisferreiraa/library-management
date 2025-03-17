"use server"

import { revalidatePath } from "next/cache"
import { createCategory, deleteCategories } from "@/lib/categories"

export async function createCategoryAction(categoryData: { name: string }): Promise<any> {
    try {
        // Criar a categoria na base de dados
        const newCategory = await createCategory(categoryData)

        // Revalidar o caminho para atualizar dados
        revalidatePath("/categories")

        return newCategory
    } catch (error: any) {
        throw new Error("Erro ao criar categoria: " + error.message)
    }
}

export async function deleteCategoriesAction(categoryIds: string[]): Promise<void> {
    try {
        // Excluir as categorias da base de dados
        await deleteCategories(categoryIds)

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/categories")
    } catch (error: any) {
        throw new Error("Erro ao excluir categorias: " + error.message)
    }
}