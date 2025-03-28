"use server"

import { revalidatePath } from "next/cache"
import { createLanguage, deleteLanguages, updateLanguage } from "@/lib/languages"
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

export async function updateLanguageAction(languageData: {
    id: string
    name: string
}): Promise<any> {
    try {
        // Atualizar o idioma na base de dados
        const updatedLanguage = await updateLanguage(languageData.id, {
            name: languageData.name,
        })

        // Criar auditLog
        await logAudit("Language", languageData.id, "UPDATE_LANGUAGE")

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/languages")
        revalidatePath(`/languages/${languageData.id}`)

        return updatedLanguage
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Erro ao atualizar idioma (ID: ${languageData.id}): ${error.message}`);
        }
        throw new Error("Erro desconhecido ao atualizar idioma.");
    }
}

export async function deleteLanguagesAction(languageIds: string[]): Promise<void> {
    try {
        // Excluir os idiomas da base de dados
        await deleteLanguages(languageIds)

        // Criar auditLog
        await logAudit("Language", languageIds, "DELETE_LANGUAGE");

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/languages")
    } catch (error: any) {
        throw new Error("Erro ao excluir idiomas: " + error.message)
    }
}