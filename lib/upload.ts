import { put } from "@vercel/blob"
import { nanoid } from "nanoid"

export async function uploadProfilePicture(file: File): Promise<string> {
    try {
        // Verificar se é uma imagem
        if (!file.type.startsWith("image/")) {
            throw new Error("O ficheiro deve ser uma imagem")
        }

        // Limitar o tamanho do arquivo (5MB)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error("A imagem deve ter menos de 5MB")
        }

        // Gerar um ID único para o arquivo
        const uniqueId = nanoid()
        const fileName = `${uniqueId}-${file.name.replace(/\s+/g, "_")}`

        // Fazer upload para o Vercel Blob Storage
        const blob = await put(fileName, file, {
            access: "public",
            contentType: file.type,
        })

        // Retornar a URL da imagem
        return blob.url
    } catch (error: any) {
        console.error("Erro ao fazer upload da imagem:", error)
        throw new Error(error.message || "Erro ao fazer upload da imagem")
    }
}

