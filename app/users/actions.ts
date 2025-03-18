"use server"

import { revalidatePath } from "next/cache"
import { createUser, deleteUsers } from "@/lib/users"

export async function createUsersAction(authorData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    idNumber: string;
    nifNumber: number;
    profilePicture: string;
}): Promise<any> {
    try {
        // Criar o user no banco de dados
        const newUser = await createUser(authorData)

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/users")

        return newUser
    } catch (error: any) {
        // Verificar se é um erro de email duplicado
        if (error.code === "P2002" && error.meta?.target?.includes("email")) {
            throw new Error("Este email já está em uso")
        }

        throw new Error("Erro ao criar utilizador: " + error.message)
    }
}

export async function deleteUsersAction(userIds: string[]): Promise<void> {
    try {
        // Excluir os users da base de dados
        await deleteUsers(userIds)

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/users")
    } catch (error: any) {
        throw new Error("Erro ao excluir utilizadores: " + error.message)
    }
}