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

    // Criar ControlFields
    const controlFieldDefinitions = await prisma.controlFieldDefinition.createMany({
        data: [
            {
                tag: "001",
                name: "Record Identifier",
                tips: [
                    "Este campo contém caracteres associados exclusivamente ao registo, ou seja, o identificador do registo da agência que o preparou.",
                    "Em conformidade com a norma ISO 2709, este campo não contém subcampos.",
                    "Em conformidade com a norma ISO 2709, este campo não contém indicadores.",
                    "Quando consiste ou incorpora qualquer forma de um ISN, a informação deve ser inserida no campo especificado para estes dados, além de as registar como identificador de registo neste campo."
                ]
            },
            {
                tag: "003",
                name: "Persistent Record Identifier",
                tips: [
                    "Este campo contém contém o identificador persistente do registo atribuído pela agência que cria, utiliza ou emite o registo.",
                    "É o identificador persistente para o registo bibliográfico, e não o recurso em si.",
                    "Em conformidade com a norma ISO 2709, este campo não contém subcampos.",
                    "Em conformidade com a norma ISO 2709, este campo não contém indicadores.",
                    "São endereços de internet específicos que permitem referenciar um recurso eletrónico com o auxílio de um link de hipertexto, garantindo que esse link não se altera.",
                    "Existem vários sistemas que permitem a criação de identificadores persistentes."
                ]
            },
            {
                tag: "005",
                name: "Version Identifier",
                tips: [
                    "O campo contém a data e a hora da útlima transação de registo.",
                    "Permite que os sistemas de máquina determinem se a versão do registo que está a ser processado é posterior, anterior ou igual a uma processada anteriormente.",
                    "Em conformidade com a norma ISO 2709, este campo não contém subcampos.",
                    "Em conformidade com a norma ISO 2709, este campo não contém indicadores.",
                    "Introduzir no formato standard (ISO 8601-1): AAAAMMDD. O tempo é introduzido no formato HHMMSS. Em todos os casos, é adicionado um 0 inicial, se necessário."
                ]
            },


        ]
    })

    const dataFieldDefinitions = await prisma.dataFieldDefinition.createMany({
        data: [
            {
                tag: "010",
                name: "International Standard Book Number (ISBN)",
                ind1Tips: [
                    "Em branco (não definido)",
                ],
                ind2Tips: [
                    "Em branco (não definido)",
                ],
                tips: [
                    "Este campo contém um ISBN e uma qualificação que o distingue quando mais do que um está contido num registo.",
                    "Área de Identificação de Recursos e Termos de Disponibilidade. O campo pode conter os termos de disponibilidade e ou preço, mesmo que não contenha ISBN."
                ]
            },

        ]

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