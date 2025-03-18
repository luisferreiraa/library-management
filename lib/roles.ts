import { prisma } from "./prisma"
import type { Role as PrismaRole } from "@prisma/client"
import slugify from "slugify"

export type Role = PrismaRole

export async function getRoles(): Promise<Role[]> {
    return prisma.role.findMany({
        orderBy: {
            createdAt: "desc",
        },
    })
}

export async function getRoleById(id: string): Promise<Role | null> {
    return prisma.role.findUnique({
        where: { id },
    })
}

export async function createRole(data: { name: string }): Promise<Role> {
    const slug: string = slugify(data.name, { lower: true });

    return prisma.role.create({
        data: {
            ...data,
            slug,
        },
    });
}

export async function updateRole(id: string, data: { name?: string }): Promise<Role> {
    let updateData: { name?: string; slug?: string } = { ...data };

    if (data.name) {
        updateData.slug = slugify(data.name, { lower: true });
    }

    return prisma.translator.update({
        where: { id },
        data: updateData,
    });
}

export async function deleteRole(id: string): Promise<Role> {
    return prisma.role.delete({
        where: { id },
    });
}

export async function deleteRoles(ids: string[]): Promise<number> {
    const result = await prisma.role.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    })

    return result.count
}