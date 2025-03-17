"use server"

import { revalidatePath } from "next/cache"
import { createAuthor, deleteAuthors } from "@/lib/authors"

export async function createAuthorAction(authorData: { name: string; email: string; bio: string }): Promise<any> {
  try {
    // Criar o autor no banco de dados
    const newAuthor = await createAuthor(authorData)

    // Revalidar o caminho para atualizar os dados
    revalidatePath("/authors")

    return newAuthor
  } catch (error: any) {
    // Verificar se é um erro de email duplicado
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      throw new Error("Este email já está em uso")
    }

    throw new Error("Erro ao criar autor: " + error.message)
  }
}

export async function deleteAuthorsAction(authorIds: string[]): Promise<void> {
  try {
    // Excluir os autores do banco de dados
    await deleteAuthors(authorIds)

    // Revalidar o caminho para atualizar os dados
    revalidatePath("/authors")
  } catch (error: any) {
    throw new Error("Erro ao excluir autores: " + error.message)
  }
}

