import { prisma } from "./prisma"
import type {
    ControlFieldDefinition as PrismaControlFieldDefinition,
    DataFieldDefinition as PrismaDataFieldDefinition,
    Prisma
} from "@prisma/client"

export type ControlFieldDefinition = PrismaControlFieldDefinition
export type DataFieldDefinition = PrismaDataFieldDefinition

export async function getControlFieldDefinitions(): Promise<ControlFieldDefinition[]> {
    return prisma.controlFieldDefinition.findMany()
}

export async function getDataFieldDefinitions(): Promise<DataFieldDefinition[]> {
    return prisma.dataFieldDefinition.findMany()
}