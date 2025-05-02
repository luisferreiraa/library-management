import { PrismaClient } from "@prisma/client"
import { seedRoles } from "./seed/seedRoles";
import { seedUsers } from "./seed/seedUsers";
import { seedControlFieldDefinitions } from "./seed/seedControlFieldDefinitions";
import { seedDataFieldDefinitions } from "./seed/seedDataFieldDefinitions";
import { seedTemplates } from "./seed/seedTemplates.ts";

const prisma = new PrismaClient()

async function main() {

    // Clean up first
    /* await prisma.subfieldDefinition.deleteMany();
    await prisma.dataFieldDefinition.deleteMany();
    await prisma.controlFieldDefinition.deleteMany(); */

    // Increase timeout and connection limit
    await prisma.$executeRaw`SET statement_timeout = 60000;`; // 60 seconds
    await prisma.$executeRaw`SET idle_in_transaction_session_timeout = 30000;`;

    /*     await seedRoles()
        await seedUsers() */
    await seedTemplates()
    /*     await seedControlFieldDefinitions()
        await seedDataFieldDefinitions() */
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })