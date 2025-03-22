import { prisma } from "./prisma"
import type { PenaltyRule as PrismaPenaltyRule } from "@prisma/client"
import slugify from "slugify"

export type PenaltyRule = PrismaPenaltyRule

export async function getPenaltyRules(): Promise<PenaltyRule[]> {
    return prisma.penaltyRule.findMany({
        orderBy: {
            createdAt: "desc",
        },
    })
}

export async function getPenaltyRuleById(id: string): Promise<PenaltyRule | null> {
    return prisma.penaltyRule.findUnique({
        where: { id },
    })
}

export async function createPenaltyRule(data: {
    name: string;
    description: string;
    finePerDay: number;
    minDaysLate: number;
    maxDaysLate?: number;
}): Promise<PenaltyRule> {
    const slug: string = slugify(data.name, { lower: true });

    return prisma.penaltyRule.create({
        data: {
            ...data,
            slug,
        },
    });
}

export async function updatePenaltyRule(id: string, data: { name?: string; description?: string; finePerDay?: number }): Promise<PenaltyRule> {
    let updateData: { name?: string; slug?: string; description?: string; finePerDay?: number } = { ...data };

    if (data.name) {
        updateData.slug = slugify(data.name, { lower: true });
    }

    return prisma.penaltyRule.update({
        where: { id },
        data: updateData,
    });
}

export async function deletePenaltyRule(id: string): Promise<PenaltyRule> {
    return prisma.penaltyRule.delete({
        where: { id },
    });
}

export async function deletePenaltyRules(ids: string[]): Promise<number> {
    const result = await prisma.penaltyRule.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    })

    return result.count
}