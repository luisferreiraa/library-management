import { prisma } from "./prisma"
import type { Template as PrismaTemplate, Prisma } from "@prisma/client"

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