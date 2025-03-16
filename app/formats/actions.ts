"use server"

import { revalidatePath } from "next/cache"
import { createFormat } from "@/lib/formats"

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