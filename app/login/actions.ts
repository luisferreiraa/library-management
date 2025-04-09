"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Função alternativa para atualizar o último login
export async function updateUserLastLoginAction(id: string) {
    console.log("[updateUserLastLoginAction] Chamado com ID:", id)

    if (!id) {
        console.warn("[updateUserLastLoginAction] ID inválido recebido")
        return { success: false, message: "ID do utilizador inválido" }
    }

    try {
        const result = await prisma.user.update({
            where: { id },
            data: { lastLogin: new Date() },
            select: { id: true, lastLogin: true },
        })

        console.log("[updateUserLastLoginAction] Atualização bem-sucedida:", result)

        // Revalidar caminhos relevantes
        revalidatePath("/users")
        revalidatePath("/dashboard")

        return {
            success: true,
            message: "Último login atualizado com sucesso!",
            updatedUser: result,
        }
    } catch (error) {
        console.error("[updateUserLastLoginAction] Erro crítico:", error)

        return {
            success: false,
            message: error instanceof Error ? error.message : "Falha ao atualizar último login.",
        }
    }
}
