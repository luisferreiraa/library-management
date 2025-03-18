import { prisma } from "./prisma"
import type { User as PrismaUser } from "@prisma/client"
import bcrypt from "bcryptjs";

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

export async function createUser(data:
    {
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
    }): Promise<User> {

    // Hash da password antes armazenar na base de dados
    const hashedPassword = await bcrypt.hash(data.password, 10)

    return prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
        },
    });
}

export async function updateUser(id: string, data: {
    username?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    phoneNumber?: string;
    idNumber?: string;
    nifNumber?: number;
    profilePicture?: string;
}): Promise<User> {
    // Criar um objeto para armazenar os dados atualizados
    let updateData = { ...data };

    // Se o utilizador forneceu uma nova password, precisamos de a hashear
    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
    }

    return prisma.user.update({
        where: { id },
        data: updateData,
    });
}

export async function deleteUser(id: string): Promise<User> {
    return prisma.user.delete({
        where: { id },
    });
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