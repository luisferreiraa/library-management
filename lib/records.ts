import { prisma } from "./prisma"
import { Record as PrismaRecord, Prisma } from "@prisma/client"
import { convertToUnimarc } from "./unimarc-converter";

export type Record = {
    id: string
    metadata: any
    controlFields: {
        id: string
        value: string
        definition: {
            id: string
            tag: string
            name: string
            tips: string[]
        }
    }[]
    dataFields: {
        id: string
        ind1: string
        ind2: string
        definition: {
            id: string
            tag: string
            name: string
            ind1Name: string
            ind2Name: string
            tips: string[]
        }
        subFields: {
            id: string
            value: string
        }[]
    }[]
    createdAt: Date
    updatedAt: Date
}

export type CreateRecordInput = {
    metadata?: any
    templateId: string | null
    controlFields: {
        definitionId: string
        value: string
    }[]
    dataFields: {
        definitionId: string
        ind1: string
        ind2: string
        subFields: {
            value: string
        }[]
    }[]
}

export type UpdateRecordInput = {
    id: string
    metadata?: any
    controlFields: {
        id?: string
        definitionId: string
        value: string
    }[]
    dataFields: {
        id?: string
        definitionId: string
        ind1: string
        ind2: string
        subFields: {
            id?: string
            value: string
        }[]
    }[]
}

export async function getRecords(): Promise<Record[]> {
    return await prisma.record.findMany({
        include: {
            controlFields: {
                include: {
                    definition: true,
                },
            },
            dataFields: {
                include: {
                    definition: true,
                    subFields: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    })
}

export async function getRecordById(id: string): Promise<Record | null> {
    return await prisma.record.findUnique({
        where: { id },
        include: {
            controlFields: {
                include: {
                    definition: true,
                },
            },
            dataFields: {
                include: {
                    definition: true,
                    subFields: true,
                },
            },
        },
    })
}

export async function createRecord({
    metadata = {},
    templateId = null,
    controlFields,
    dataFields,
}: CreateRecordInput): Promise<Record> {
    try {
        // Se um templateId for fornecido, buscar o template para usar como base
        let templateControlFields: { definitionId: string }[] = []
        let templateDataFields: { definitionId: string }[] = []

        if (templateId) {
            const template = await prisma.template.findUnique({
                where: { id: templateId },
                include: {
                    controlFields: {
                        include: {
                            definition: true,
                        },
                    },
                    dataFields: {
                        include: {
                            definition: true,
                        },
                    },
                },
            })

            if (template) {
                templateControlFields = template.controlFields.map((cf) => ({
                    definitionId: cf.definitionId,
                }))

                templateDataFields = template.dataFields.map((df) => ({
                    definitionId: df.definitionId,
                }))
            }
        }

        // Buscar todas as definições de campos para a conversão UNIMARC
        const [controlFieldDefinitions, dataFieldDefinitions] = await Promise.all([
            prisma.controlFieldDefinition.findMany(),
            prisma.dataFieldDefinition.findMany(),
        ])

        // Converter para formato UNIMARC
        const unimarcMetadata = convertToUnimarc(
            { controlFields, dataFields },
            { controlFieldDefinitions, dataFieldDefinitions },
        )

        // Criar o registro com os campos fornecidos e o metadata UNIMARC
        return await prisma.record.create({
            data: {
                metadata: unimarcMetadata,
                controlFields: {
                    create: controlFields.map((cf) => ({
                        value: cf.value,
                        definition: {
                            connect: { id: cf.definitionId },
                        },
                    })),
                },
                dataFields: {
                    create: dataFields.map((df) => ({
                        ind1: df.ind1,
                        ind2: df.ind2,
                        definition: {
                            connect: { id: df.definitionId },
                        },
                        subFields: {
                            create: df.subFields.map((sf) => ({
                                value: sf.value,
                            })),
                        },
                    })),
                },
            },
            include: {
                controlFields: {
                    include: {
                        definition: true,
                    },
                },
                dataFields: {
                    include: {
                        definition: true,
                        subFields: true,
                    },
                },
            },
        })
    } catch (error) {
        console.error("Erro ao criar registro:", error)
        throw new Error("Ocorreu um erro ao criar o registro")
    }
}

export async function updateRecord({ id, metadata, controlFields, dataFields }: UpdateRecordInput): Promise<Record> {
    try {
        // Verificar se o registro existe
        const existingRecord = await prisma.record.findUnique({
            where: { id },
            include: {
                controlFields: {
                    include: {
                        definition: true,
                    },
                },
                dataFields: {
                    include: {
                        definition: true,
                        subFields: true,
                    },
                },
            },
        })

        if (!existingRecord) {
            throw new Error("Registro não encontrado")
        }

        // Buscar todas as definições de campos para a conversão UNIMARC
        const [controlFieldDefinitions, dataFieldDefinitions] = await Promise.all([
            prisma.controlFieldDefinition.findMany(),
            prisma.dataFieldDefinition.findMany(),
        ])

        // Converter para formato UNIMARC
        const unimarcMetadata = convertToUnimarc(
            {
                controlFields: controlFields.map((cf) => ({
                    ...cf,
                    definition: existingRecord.controlFields.find((ecf) => ecf.id === cf.id)?.definition,
                })),
                dataFields: dataFields.map((df) => ({
                    ...df,
                    definition: existingRecord.dataFields.find((edf) => edf.id === df.id)?.definition,
                })),
            },
            { controlFieldDefinitions, dataFieldDefinitions },
        )

        // Atualizar usando transaction para garantir atomicidade
        return await prisma.$transaction(async (tx) => {
            // 1. Atualizar metadados do registro
            await tx.record.update({
                where: { id },
                data: {
                    metadata: unimarcMetadata,
                },
            })

            // 2. Processar campos de controle
            // Primeiro, identificar quais campos existentes devem ser mantidos, atualizados ou removidos
            const existingControlFieldIds = existingRecord.controlFields.map((cf) => cf.id)
            const updatedControlFieldIds = controlFields.filter((cf) => cf.id).map((cf) => cf.id as string)

            // Campos a serem removidos (existem no banco mas não na atualização)
            const controlFieldIdsToRemove = existingControlFieldIds.filter((id) => !updatedControlFieldIds.includes(id))

            // Remover campos que não estão mais presentes
            if (controlFieldIdsToRemove.length > 0) {
                await tx.controlField.deleteMany({
                    where: {
                        id: {
                            in: controlFieldIdsToRemove,
                        },
                    },
                })
            }

            // Atualizar ou criar campos de controle
            for (const cf of controlFields) {
                if (cf.id) {
                    // Atualizar campo existente
                    await tx.controlField.update({
                        where: { id: cf.id },
                        data: {
                            value: cf.value,
                            definition: {
                                connect: { id: cf.definitionId },
                            },
                        },
                    })
                } else {
                    // Criar novo campo
                    await tx.controlField.create({
                        data: {
                            value: cf.value,
                            record: { connect: { id } },
                            definition: { connect: { id: cf.definitionId } },
                        },
                    })
                }
            }

            // 3. Processar campos de dados
            // Primeiro, identificar quais campos existentes devem ser mantidos, atualizados ou removidos
            const existingDataFieldIds = existingRecord.dataFields.map((df) => df.id)
            const updatedDataFieldIds = dataFields.filter((df) => df.id).map((df) => df.id as string)

            // Campos a serem removidos (existem no banco mas não na atualização)
            const dataFieldIdsToRemove = existingDataFieldIds.filter((id) => !updatedDataFieldIds.includes(id))

            // Remover campos que não estão mais presentes
            if (dataFieldIdsToRemove.length > 0) {
                // Primeiro remover subcampos relacionados
                await tx.subfield.deleteMany({
                    where: {
                        dataFieldId: {
                            in: dataFieldIdsToRemove,
                        },
                    },
                })

                // Depois remover os campos de dados
                await tx.dataField.deleteMany({
                    where: {
                        id: {
                            in: dataFieldIdsToRemove,
                        },
                    },
                })
            }

            // Atualizar ou criar campos de dados
            for (const df of dataFields) {
                if (df.id) {
                    // Atualizar campo existente
                    await tx.dataField.update({
                        where: { id: df.id },
                        data: {
                            ind1: df.ind1,
                            ind2: df.ind2,
                            definition: {
                                connect: { id: df.definitionId },
                            },
                        },
                    })

                    // Processar subcampos
                    // Obter subcampos existentes
                    const existingSubfields =
                        existingRecord.dataFields.find((existingDf) => existingDf.id === df.id)?.subFields || []

                    const existingSubfieldIds = existingSubfields.map((sf) => sf.id)
                    const updatedSubfieldIds = df.subFields.filter((sf) => sf.id).map((sf) => sf.id as string)

                    // Subcampos a serem removidos
                    const subfieldIdsToRemove = existingSubfieldIds.filter((id) => !updatedSubfieldIds.includes(id))

                    // Remover subcampos que não estão mais presentes
                    if (subfieldIdsToRemove.length > 0) {
                        await tx.subfield.deleteMany({
                            where: {
                                id: {
                                    in: subfieldIdsToRemove,
                                },
                            },
                        })
                    }

                    // Atualizar ou criar subcampos
                    for (const sf of df.subFields) {
                        if (sf.id) {
                            // Atualizar subcampo existente
                            await tx.subfield.update({
                                where: { id: sf.id },
                                data: {
                                    value: sf.value,
                                },
                            })
                        } else {
                            // Criar novo subcampo
                            await tx.subfield.create({
                                data: {
                                    value: sf.value,
                                    dataField: { connect: { id: df.id } },
                                },
                            })
                        }
                    }
                } else {
                    // Criar novo campo de dados com seus subcampos
                    await tx.dataField.create({
                        data: {
                            ind1: df.ind1,
                            ind2: df.ind2,
                            record: { connect: { id } },
                            definition: { connect: { id: df.definitionId } },
                            subFields: {
                                create: df.subFields.map((sf) => ({
                                    value: sf.value,
                                })),
                            },
                        },
                    })
                }
            }

            // 4. Retornar o registro atualizado
            return await tx.record.findUniqueOrThrow({
                where: { id },
                include: {
                    controlFields: {
                        include: {
                            definition: true,
                        },
                    },
                    dataFields: {
                        include: {
                            definition: true,
                            subFields: true,
                        },
                    },
                },
            })
        })
    } catch (error) {
        console.error("Erro ao atualizar registro:", error)
        if (error instanceof Error) {
            throw new Error(error.message)
        }
        throw new Error("Ocorreu um erro ao atualizar o registro")
    }
}

export async function deleteRecord(id: string): Promise<void> {
    try {
        // Verificar se o registro existe
        const existingRecord = await prisma.record.findUnique({
            where: { id },
            include: {
                dataFields: {
                    include: {
                        subFields: true,
                    },
                },
            },
        })

        if (!existingRecord) {
            throw new Error("Registro não encontrado")
        }

        // Deletar usando transaction para garantir atomicidade
        await prisma.$transaction(async (tx) => {
            // 1. Deletar subcampos
            for (const df of existingRecord.dataFields) {
                await tx.subfield.deleteMany({
                    where: {
                        dataFieldId: df.id,
                    },
                })
            }

            // 2. Deletar campos de dados
            await tx.dataField.deleteMany({
                where: {
                    recordId: id,
                },
            })

            // 3. Deletar campos de controle
            await tx.controlField.deleteMany({
                where: {
                    recordId: id,
                },
            })

            // 4. Deletar holdings (se houver)
            await tx.holding.deleteMany({
                where: {
                    recordId: id,
                },
            })

            // 5. Finalmente, deletar o registro
            await tx.record.delete({
                where: { id },
            })
        })
    } catch (error) {
        console.error("Erro ao deletar registro:", error)
        if (error instanceof Error) {
            throw new Error(error.message)
        }
        throw new Error("Ocorreu um erro ao deletar o registro")
    }
}