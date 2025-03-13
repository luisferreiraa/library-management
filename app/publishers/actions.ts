"use server"

import { revalidatePath } from "next/cache"
import { createPublisher } from "@/lib/publishers"

export async function createPublisherAction(publisherData: { name: string }): Promise<any> {
    try {
        // Criar a editora na base de dados
        const newPublisher = await createPublisher(publisherData)

        // Revalidar o caminho para atualizar dados
        revalidatePath("/publishers")

        return newPublisher
    } catch (error: any) {
        throw new Error("Erro ao criar publisher: " + error.message)
    }
}