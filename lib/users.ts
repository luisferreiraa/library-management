import { revalidatePath } from "next/cache"
import { prisma } from "./prisma"
import type { User as PrismaUser } from "@prisma/client"

export type User = PrismaUser

export async function getUsers(): Promise<User[]> {
    return prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
    })
}

export async function getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: { id },
    })
}

export async function createUser(data: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
    address: string
    phoneNumber: string
    idNumber: string
    nifNumber: number
    profilePicture?: string
}): Promise<User> {
    return prisma.user.create({
        data,
    })
}

export async function updateUser(
    id: string,
    data: {
        username?: string
        email?: string
        password?: string
        firstName?: string
        lastName?: string
        address?: string
        phoneNumber?: string
        idNumber?: string
        nifNumber?: number
        profilePicture?: string
        isActive?: boolean
    },
): Promise<User> {
    return prisma.user.update({
        where: { id },
        data,
    })
}

export async function updateUserLastLogin(userId: string) {
    if (!userId) {
        console.log("ID do usuário não fornecido")
        return { success: false, message: "ID do usuário não fornecido" }
    }

    try {
        console.log("Atualizando último login para:", userId)

        // Atualizar o último login diretamente no banco de dados
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { lastLogin: new Date() },
            select: { id: true, lastLogin: true },
        })

        console.log("Usuário atualizado:", updatedUser)

        // Revalidar caminhos relevantes
        revalidatePath("/users")
        revalidatePath("/dashboard")

        return {
            success: true,
            message: "Último login atualizado com sucesso!",
            user: updatedUser,
        }
    } catch (error) {
        console.error("Erro ao atualizar último login:", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "Falha ao atualizar último login",
            error: error,
        }
    }
}

export async function deleteUser(id: string): Promise<User> {
    return prisma.user.delete({
        where: { id },
    })
}

export async function deleteUsers(ids: string[]): Promise<number> {
    const result = await prisma.user.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    })

    return result.count
}

