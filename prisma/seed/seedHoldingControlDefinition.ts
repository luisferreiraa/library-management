import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

const holdingControlDefinitionsData = [
    {
        tag: "001",
        name: "HOLDINGS RECORD IDENTIFIER",
        tips: ["Este campo contém o número de controlo de registo atribuído pela agência que prepara o registo."],
    },
    {
        tag: "004",
        name: "RELATED BIBLIOGRAPHIC RECORD IDENTIFIER",
        tips: ["Este campo contém um identificador do registo bibliográfico do item para o qual os acervos são relatado.", "Se o identificador for o número de controlo do registo bibliográfico ao qual o registo de participações estiver relacionado, recomenda-se que seja precedido diretamente por uma designação padrão para a instituição ou sistema pelo qual foi atribuído, entre parênteses."],
    },
    {
        tag: "005",
        name: "VERSION IDENTIFIER",
        tips: ["Este campo é constituído por 16 caracteres que indicam a data e hora da última transação/atualização do registo."],
    },
]

export async function seedHoldingControlDefinitionsData() {
    for (const holdingControlDefintionData of holdingControlDefinitionsData) {
        await prisma.holdingControlDefinition.upsert({
            where: { tag: holdingControlDefintionData.tag },
            update: {},
            create: {
                tag: holdingControlDefintionData.tag,
                name: holdingControlDefintionData.name,
                tips: holdingControlDefintionData.tips,
            }
        })
        console.log(`✅ Holding Control Field Definition "${holdingControlDefintionData.tag}" criado com sucesso.`)
    }
}