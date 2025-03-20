"use server"

import { revalidatePath } from "next/cache"
import { createLanguage, deleteLanguages } from "@/lib/languages"
import { logAudit } from "@/lib/session";

export async function createLanguageAction(languageData: { name: string }): Promise<any> {
    try {
        // Criar a language na base de dados
        const newLanguage = await createLanguage(languageData)

        // Criar auditLog
        await logAudit("Language", newLanguage.id, "CREATE_LANGUAGE");

        // Revalidar o caminho para atualizar dados
        revalidatePath("/languages")

        return newLanguage
    } catch (error: any) {
        throw new Error("Erro ao criar idioma: " + error.message)
    }
}

export async function deleteLanguagesAction(languageIds: string[]): Promise<void> {
    try {
        // Excluir os idiomas da base de dados
        await deleteLanguages(languageIds)

        // Criar auditLog
        await logAudit("Language", languageIds, "CREATE_LANGUAGE");

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/languages")
    } catch (error: any) {
        throw new Error("Erro ao excluir idiomas: " + error.message)
    }
}