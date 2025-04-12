import { date } from "zod"
import { prisma } from "./prisma"
import type { Review as PrismaReview } from "@prisma/client"
import { now } from "lodash"

export type Review = PrismaReview

export async function getReviewById(id: string) {
    return await prisma.review.findUnique({
        where: { id },
        include: {
            user: true,
            book: true,
        },
    })
}

export async function getReviewsByUserId(userId: string) {
    return await prisma.review.findMany({
        where: { userId },
        include: {
            user: true,
        },
    })
}

export async function deleteReviews(reviewIds: string[]) {
    const result = await prisma.review.deleteMany({
        where: {
            id: {
                in: reviewIds,
            },
        },
    })
    return result.count
}

export async function approveReviews(reviewIds: string[]) {
    const result = await prisma.review.updateMany({
        where: {
            id: {
                in: reviewIds,
            },
        },
        data: {
            isAproved: true,
            isActive: true,
            approvalDate: new Date,
        },
    })
    return result.count
}

export async function rejectReviews(reviewIds: string[]) {
    const result = await prisma.review.updateMany({
        where: {
            id: {
                in: reviewIds,
            },
        },
        data: {
            isAproved: false,
            isActive: false,
            approvalDate: new Date(),
        }
    })
    return result.count
}
