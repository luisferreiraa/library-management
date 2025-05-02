import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

const roles = [
    {
        name: "ADMIN",
        slug: "admin",
    },
    {
        name: "USER",
        slug: "user",
    }
]

export async function seedRoles() {
    for (const roleData of roles) {
        await prisma.role.upsert({
            where: { name: roleData.name },
            update: {},
            create: {
                name: roleData.name,
                slug: roleData.slug,
            }
        })

        console.log(`✅ Role "${roleData.name}" criado com sucesso.`)
    }
}