"use server"

import { updateUserPassword } from "@/lib/users"
import bcrypt from "bcryptjs"

export async function updateUserPasswordAction(data: {
    userId: string,
    newPassword: string,
}) {
    try {
        const hashedNewPassword = await bcrypt.hash(data.newPassword, 10)

        await updateUserPassword(data.userId, hashedNewPassword)

        return { success: true }
    } catch (error) {
        console.error("Erro ao atualizar a senha:", error)
        return { success: false, error: "Ocorreu um erro ao atualizar a senha." }
    }
}