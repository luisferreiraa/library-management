"use server"

import { revalidatePath } from "next/cache"
import { createUser, deleteUsers, registerUser, User } from "@/lib/users"
import { uploadProfilePicture } from "@/lib/upload"
import bcrypt from "bcryptjs"
import { logAudit } from "@/lib/session"
import { createRole, getRoleByName } from "@/lib/roles"
import prisma from "@/lib/prisma"

export async function uploadProfilePictureAction(formData: FormData): Promise<string> {
    try {
        const file = formData.get("file") as File

        if (!file) {
            throw new Error("Nenhum arquivo enviado")
        }

        const imageUrl = await uploadProfilePicture(file)
        return imageUrl
    } catch (error: any) {
        throw new Error(error.message || "Erro ao fazer upload da imagem")
    }
}

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

        // Criar auditLog
        await logAudit("User", newUser.id, "CREATE_USER");

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

export async function registerUserAction(userData: {
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
}): Promise<Omit<User, 'password'>> {
    try {
        let roleId: string
        const existingRole = await getRoleByName("USER")

        if (existingRole) {
            roleId = existingRole.id
        } else {
            const newRole = await createRole({
                name: "USER",
                isActive: true,
            })
            roleId = newRole.id
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(userData.password, 10)

        // Criar o usuário no banco de dados
        const newUser = await registerUser({
            ...userData,
            password: hashedPassword,
            nifNumber: Number.parseInt(userData.nifNumber),
            isActive: false,
            role: {
                connect: {
                    id: roleId
                }
            }
        })

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/login")

        const { password, ...safeUser } = newUser
        return safeUser

    } catch (error: any) {
        // Verificar se é um erro de email ou username duplicado
        if (error.code === "P2002") {
            if (error.meta?.target?.includes("email")) {
                throw new Error("Este email já está em uso")
            }
            if (error.meta?.target?.includes("username")) {
                throw new Error("Este nome de utilizador já está em uso")
            }
        }

        throw new Error("Erro ao criar usuário: " + error.message)
    }
}

export async function deleteUsersAction(userIds: string[]): Promise<void> {
    try {
        // Excluir os usuários do banco de dados
        await deleteUsers(userIds)

        // Criar auditLog
        await logAudit("User", userIds, "DELETE_USER");

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/users")
    } catch (error: any) {
        throw new Error("Erro ao excluir usuários: " + error.message)
    }
}

export async function updateUserAction(userData: Partial<User> & { id: string }): Promise<User> {
    try {
        const { id, password, nifNumber, ...rest } = userData

        // Preparar os dados para atualização
        const updateData: any = {
            ...rest,
            // Garantir que nifNumber seja um número se fornecido
            ...(nifNumber !== undefined ? { nifNumber: Number(nifNumber) } : {}),
        }

        // Se uma nova senha foi fornecida, hash
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            updateData.password = hashedPassword
        }

        // Atualizar o utilizador na base de dados
        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            include: {
                role: true,
            },
        })

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/users")

        // Retornar o utilizador atualizado
        return {
            ...updatedUser,
            role: updatedUser,
        } as unknown as User
    } catch (error) {
        console.error("Erro ao atualizar o utilizador:", error)
        throw new Error("Falha ao atualizar o utilizador. Por favor, tente novamente.")
    }
}

