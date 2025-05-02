import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

const controlFieldDefinitions = [
    {
        tag: "001",
        name: "RECORD IDENTIFIER",
        tips: [
            "Este campo contém caracteres associados exclusivamente ao registo, ou seja, o identificador do registo da agência que o preparou.",
            "Em conformidade com a norma ISO 2709, este campo não contém subcampos.",
            "Em conformidade com a norma ISO 2709, este campo não contém indicadores.",
            "Quando consiste ou incorpora qualquer forma de um ISN, a informação deve ser inserida no campo especificado para estes dados, além de as registar como identificador de registo neste campo."
        ]
    },
    {
        tag: "003",
        name: "PERSISTENT RECORD IDENTIFIER",
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
        name: "VERSION IDENTIFIER",
        tips: [
            "O campo contém a data e a hora da útlima transação de registo.",
            "Permite que os sistemas de máquina determinem se a versão do registo que está a ser processado é posterior, anterior ou igual a uma processada anteriormente.",
            "Em conformidade com a norma ISO 2709, este campo não contém subcampos.",
            "Em conformidade com a norma ISO 2709, este campo não contém indicadores.",
            "Introduzir no formato standard (ISO 8601-1): AAAAMMDD. O tempo é introduzido no formato HHMMSS. Em todos os casos, é adicionado um 0 inicial, se necessário."
        ]
    }
]

export async function seedControlFieldDefinitions() {
    for (const controlFieldDefinitionData of controlFieldDefinitions) {
        await prisma.controlFieldDefinition.upsert({
            where: { tag: controlFieldDefinitionData.tag },
            update: {},
            create: {
                tag: controlFieldDefinitionData.tag,
                name: controlFieldDefinitionData.name,
                tips: controlFieldDefinitionData.tips,
            }
        })

        console.log(`✅ Control Field Definition "${controlFieldDefinitionData.tag}" criado com sucesso.`)
    }
}