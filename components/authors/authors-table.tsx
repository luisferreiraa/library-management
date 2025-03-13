"use client"

import { format } from "date-fns"
import { useAuthors } from "@/contexts/authors-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function AuthorsTable() {
  const { authors } = useAuthors()

  return (
    <div className="w-full mx-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Bio</TableHead>
            <TableHead>Data de Criação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {authors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Nenhum autor encontrado.
              </TableCell>
            </TableRow>
          ) : (
            authors.map((author) => (
              <TableRow key={author.id}>
                <TableCell className="font-medium">{author.name}</TableCell>
                <TableCell>{author.email}</TableCell>
                <TableCell className="max-w-xs truncate">{author.bio || "-"}</TableCell>
                <TableCell>{format(new Date(author.createdAt), "dd/MM/yyyy")}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

