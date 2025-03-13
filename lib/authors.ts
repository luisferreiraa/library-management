import { prisma } from "./prisma"
import type { Author as PrismaAuthor } from "@prisma/client"

export type Author = PrismaAuthor

export async function getAuthors(): Promise<Author[]> {
  return prisma.author.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getAuthorById(id: string): Promise<Author | null> {
  return prisma.author.findUnique({
    where: { id },
  })
}

export async function createAuthor(data: { name: string; email: string; bio?: string }): Promise<Author> {
  return prisma.author.create({
    data,
  })
}

export async function updateAuthor(id: string, data: { name?: string; email?: string; bio?: string }): Promise<Author> {
  return prisma.author.update({
    where: { id },
    data,
  })
}

export async function deleteAuthor(id: string): Promise<Author> {
  return prisma.author.delete({
    where: { id },
  })
}

