"use server"

import { revalidatePath } from "next/cache"
import { createUser, deleteUsers } from "@/lib/users"
import bcrypt from "bcryptjs"

export async function createUserAction(userData: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
    address: string
    phoneNumber: string
    idNumber: string
    nifNumber: string
    profilePicture?: string
}): Promise<any> {
    try {
        // Hash da senha
        const hashedPassword = await bcrypt.hash(userData.password, 10)

        // Criar o usuário no banco de dados
        const newUser = await createUser({
            ...userData,
            password: hashedPassword,
            nifNumber: Number.parseInt(userData.nifNumber),
        })

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/users")

        return {
            ...newUser,
            password: undefined, // Não retornar a senha
        }
    } catch (error: any) {
        // Verificar se é um erro de email ou username duplicado
        if (error.code === "P2002") {
            if (error.meta?.target?.includes("email")) {
                throw new Error("Este email já está em uso")
            }
            if (error.meta?.target?.includes("username")) {
                throw new Error("Este nome de usuário já está em uso")
            }
        }

        throw new Error("Erro ao criar usuário: " + error.message)
    }
}

export async function deleteUsersAction(userIds: string[]): Promise<void> {
    try {
        // Excluir os usuários do banco de dados
        await deleteUsers(userIds)

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/users")
    } catch (error: any) {
        throw new Error("Erro ao excluir usuários: " + error.message)
    }
}

