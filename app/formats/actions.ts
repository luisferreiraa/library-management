"use server"

import { revalidatePath } from "next/cache"
import { createFormat, deleteFormats } from "@/lib/formats"

export async function createFormatAction(formatData: { name: string }): Promise<any> {
    try {
        // Criar o formato na base de dados
        const newFormat = await createFormat(formatData)

        // Revalidar o caminho para atualizar dados
        revalidatePath("/formats")

        return newFormat
    } catch (error: any) {
        throw new Error("Erro ao criar formato: " + error.message)
    }
}

export async function deleteFormatsAction(formatIds: string[]): Promise<void> {
    try {
        // Excluir os formatos da base de dados
        await deleteFormats(formatIds)

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/formats")
    } catch (error: any) {
        throw new Error("Erro ao excluir formatos: " + error.message)
    }
}