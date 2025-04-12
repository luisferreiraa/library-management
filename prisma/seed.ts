import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {

    // Criar hash de senha
    const hashedPassword = await bcrypt.hash("123456789", 10)

    // Criar os Roles
    const adminRole = await prisma.role.create({
        data: {
            name: "ADMIN",
            slug: "admin",
        },
    })

    const userRole = await prisma.role.create({
        data: {
            name: "USER",
            slug: "user",
        },
    })

    // Criar um utilizador ADMIn
    const adminUser = await prisma.user.create({
        data: {
            username: "luiscarneiroferreira",
            email: "luiscarneiroferreira@gmail.com",
            password: hashedPassword,
            firstName: "Luís",
            lastName: "Ferreira",
            address: "Rua Dom Henrique de Cernache, 490",
            phoneNumber: "911099269",
            idNumber: "130080640ZY7",
            nifNumber: 226460207,
            roleId: adminRole.id,
        }
    })

    console.log({ adminRole, userRole, adminUser })
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect()
    })