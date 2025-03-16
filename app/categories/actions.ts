"use server"

import { revalidatePath } from "next/cache"
import { createCategory } from "@/lib/categories"

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