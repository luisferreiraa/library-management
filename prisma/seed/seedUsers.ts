import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function seedUsers() {

    const hashedPassword = await bcrypt.hash("123456789", 10)

    const adminRole = await prisma.role.findUnique({
        where: { name: "ADMIN" }
    });
    const adminRoleId = adminRole?.id;

    const users = [
        {
            username: "luiscarneiroferreira",
            email: "luiscarneiroferreira@gmail.com",
            password: hashedPassword,
            firsName: "Luís",
            lastName: "Ferreira",
            address: "Rua Dom Henrique de Cernache, 490",
            phoneNumber: "911099269",
            idNumber: "130080640ZY7",
            nifNumber: 226460207,
            roleId: adminRoleId,

        }
    ]

    for (const userData of users) {
        await prisma.user.upsert({
            where: { username: userData.username },
            update: {},
            create: {
                username: userData.username,
                email: userData.email,
                password: userData.password,
                firstName: userData.firsName,
                lastName: userData.lastName,
                address: userData.address,
                phoneNumber: userData.phoneNumber,
                idNumber: userData.idNumber,
                nifNumber: userData.nifNumber,
                roleId: userData.roleId ?? null,
            }
        })
    }
}