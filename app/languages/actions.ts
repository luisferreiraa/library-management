"use server"

import { revalidatePath } from "next/cache"
import { createLanguage } from "@/lib/languages"

export async function createLanguageAction(languageData: { name: string }): Promise<any> {
    try {
        // Criar a language na base de dados
        const newLanguage = await createLanguage(languageData)

        // Revalidar o caminho para atualizar dados
        revalidatePath("/languages")

        return newLanguage
    } catch (error: any) {
        throw new Error("Erro ao criar idioma: " + error.message)
    }
}