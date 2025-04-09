import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Rota alternativa com nome diferente
export async function POST(request: Request) {
    try {
        // Verificar autenticação
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Não autorizado" }, { status: 401 })
        }

        // Obter o ID do usuário da sessão
        const userId = session.user.id
        console.log("[API] Atualizando último login para:", userId)

        // Atualizar o último login no banco de dados
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { lastLogin: new Date() },
            select: { id: true, lastLogin: true },
        })

        console.log("[API] Usuário atualizado:", updatedUser)

        return NextResponse.json({
            success: true,
            message: "Último login atualizado com sucesso",
            user: updatedUser,
        })
    } catch (error) {
        console.error("[API] Erro ao atualizar último login:", error)

        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Erro ao atualizar último login",
            },
            { status: 500 },
        )
    }
}
