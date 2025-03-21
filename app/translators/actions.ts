"use server"

import { revalidatePath } from "next/cache"
import { createTranslator, deleteTranslators } from "@/lib/translators"
import { logAudit } from "@/lib/session";

export async function createTranslatorAction(translatorData: { name: string }): Promise<any> {
    try {
        // Criar o tradutor na base de dados
        const newTranslator = await createTranslator(translatorData)

        // Criar auditLog
        await logAudit("Translator", newTranslator.id, "CREATE_TRANSLATOR");

        // Revalidar o caminho para atualizar dados
        revalidatePath("/translators")

        return newTranslator
    } catch (error: any) {
        throw new Error("Erro ao criar translator: " + error.message)
    }
}

export async function deleteTranslatorsAction(translatorIds: string[]): Promise<void> {
    try {
        // Excluir os traadutores da base de dados
        await deleteTranslators(translatorIds)

        // Criar auditLog
        await logAudit("Translator", translatorIds, "DELETE_TRANSLATOR");

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/translators")
    } catch (error: any) {
        throw new Error("Erro ao excluir tradutor: " + error.message)
    }
}