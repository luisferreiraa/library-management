"use server"

import { revalidatePath } from "next/cache"
import { createTranslator } from "@/lib/translators"

export async function createTranslatorAction(translatorData: { name: string }): Promise<any> {
    try {
        // Criar o tradutor na base de dados
        const newTranslator = await createTranslator(translatorData)

        // Revalidar o caminho para atualizar dados
        revalidatePath("/translators")

        return newTranslator
    } catch (error: any) {
        throw new Error("Erro ao criar translator: " + error.message)
    }
}