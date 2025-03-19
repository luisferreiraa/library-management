"use server"

import { prisma } from "./prisma"
import type { Author as PrismaAuthor, Book as PrismaBook, Prisma } from "@prisma/client"

export type Author = PrismaAuthor
export type Book = PrismaBook

// Definir o tipo correto usando o Prisma.AuthorGetPayload
export type AuthorWithBooks = Prisma.AuthorGetPayload<{
  include: { books: true }
}>

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

export async function getAuthorWithBooks(id: string): Promise<AuthorWithBooks | null> {
  return prisma.author.findUnique({
    where: { id },
    include: {
      books: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
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

export async function deleteAuthors(ids: string[]): Promise<number> {
  const result = await prisma.author.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  })

  return result.count
}

