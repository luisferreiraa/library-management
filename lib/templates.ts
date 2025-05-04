import { prisma } from "./prisma"
import { Template as PrismaTemplate, Prisma } from "@prisma/client"

export interface CreateTemplateInput {
    name: string
    description?: string
    controlFieldDefinitionIds: string[]
    dataFieldDefinitionIds: string[]
}

export interface UpdateTemplateInput {
    id: string
    name: string
    description?: string | null
    controlFieldDefinitionIds: string[]
    dataFieldDefinitionIds: string[]
}

export type Template = Prisma.TemplateGetPayload<{
    include: {
        controlFields: {
            include: {
                definition: true;
            };
        };
        dataFields: {
            include: {
                definition: true;
            };
        };
    };
}>

export async function getTemplates(): Promise<Template[]> {
    return prisma.template.findMany({
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
    });
}

export async function getTemplateById(id: string): Promise<Template | null> {
    return prisma.template.findUnique({
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
                },
            },
        },
    });
}

export async function createTemplate({
    name,
    description,
    controlFieldDefinitionIds = [],
    dataFieldDefinitionIds = [],
}: CreateTemplateInput): Promise<Template> {
    try {
        // Verificar se todas as definições existem antes de criar
        const [existingControlDefs, existingDataDefs] = await Promise.all([
            prisma.controlFieldDefinition.findMany({
                where: { id: { in: controlFieldDefinitionIds } },
                select: { id: true },
            }),
            prisma.dataFieldDefinition.findMany({
                where: { id: { in: dataFieldDefinitionIds } },
                select: { id: true },
            }),
        ])

        // Verificar se todas as definições foram encontradas
        const missingControlDefIds = controlFieldDefinitionIds.filter(
            (id) => !existingControlDefs.some((def) => def.id === id),
        )

        const missingDataDefIds = dataFieldDefinitionIds.filter((id) => !existingDataDefs.some((def) => def.id === id))

        if (missingControlDefIds.length > 0) {
            throw new Error(`Definições de controle não encontradas: ${missingControlDefIds.join(", ")}`)
        }

        if (missingDataDefIds.length > 0) {
            throw new Error(`Definições de dados não encontradas: ${missingDataDefIds.join(", ")}`)
        }

        // Criar o template com as relações
        return await prisma.template.create({
            data: {
                name,
                description: description || null,
                controlFields: {
                    create: controlFieldDefinitionIds.map((definitionId) => ({
                        definition: {
                            connect: { id: definitionId },
                        },
                    })),
                },
                dataFields: {
                    create: dataFieldDefinitionIds.map((definitionId) => ({
                        definition: {
                            connect: { id: definitionId },
                        },
                        defaultInd1: null,
                        defaultInd2: null,
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
                    },
                },
            },
        })
    } catch (error) {
        console.error("Erro ao criar template:", error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new Error("Já existe um template com este nome")
            }
        }
        throw error
    }
}

export async function updateTemplate({
    id,
    name,
    description,
    controlFieldDefinitionIds,
    dataFieldDefinitionIds,
}: UpdateTemplateInput): Promise<Template> {
    try {
        // 1. Verificar existência do template
        const existingTemplate = await prisma.template.findUnique({
            where: { id },
            select: { id: true },
        })

        if (!existingTemplate) {
            throw new Error("Template não encontrado")
        }

        // 2. Verificar existência das definições antes de atualizar
        const [existingControlDefs, existingDataDefs] = await Promise.all([
            prisma.controlFieldDefinition.findMany({
                where: { id: { in: controlFieldDefinitionIds } },
                select: { id: true },
            }),
            prisma.dataFieldDefinition.findMany({
                where: { id: { in: dataFieldDefinitionIds } },
                select: { id: true },
            }),
        ])

        // 3. Identificar quais IDs estão faltando para melhor diagnóstico
        const missingControlDefIds = controlFieldDefinitionIds.filter(
            (id) => !existingControlDefs.some((def) => def.id === id),
        )

        const missingDataDefIds = dataFieldDefinitionIds.filter((id) => !existingDataDefs.some((def) => def.id === id))

        // Validar se todas as definições existem
        if (missingControlDefIds.length > 0) {
            throw new Error(`Definições de controle não encontradas: ${missingControlDefIds.join(", ")}`)
        }

        if (missingDataDefIds.length > 0) {
            throw new Error(`Definições de dados não encontradas: ${missingDataDefIds.join(", ")}`)
        }

        // 4. Atualizar usando transaction para garantir atomicidade
        return await prisma.$transaction(async (tx) => {
            // Primeiro deletar relações existentes
            await tx.templateControlField.deleteMany({
                where: { templateId: id },
            })

            await tx.templateDataField.deleteMany({
                where: { templateId: id },
            })

            // Depois atualizar o template básico
            await tx.template.update({
                where: { id },
                data: {
                    name,
                    description: description || null,
                },
            })

            // Criar novas relações de controle
            for (const defId of controlFieldDefinitionIds) {
                await tx.templateControlField.create({
                    data: {
                        template: { connect: { id } },
                        definition: { connect: { id: defId } },
                    },
                })
            }

            // Criar novas relações de dados
            for (const defId of dataFieldDefinitionIds) {
                await tx.templateDataField.create({
                    data: {
                        template: { connect: { id } },
                        definition: { connect: { id: defId } },
                        defaultInd1: null,
                        defaultInd2: null,
                    },
                })
            }

            // Retornar o template atualizado
            const updatedTemplate = await tx.template.findUniqueOrThrow({
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
                        },
                    },
                },
            })

            return updatedTemplate
        })
    } catch (error) {
        console.error("Erro ao atualizar template:", error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new Error("Já existe um template com este nome")
            }
        }
        throw error
    }
}