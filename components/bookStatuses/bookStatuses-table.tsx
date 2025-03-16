"use client"

import { format } from "date-fns"
import { useBookStatuses } from "@/contexts/bookstatus-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function BookStatusesTable() {
    const { bookStatuses } = useBookStatuses()

    return (
        <div className="w-full mx-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Data de Criação</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bookStatuses.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                Nenhum book status encontrado.
                            </TableCell>
                        </TableRow>
                    ) : (
                        bookStatuses.map((bookStatus) => (
                            <TableRow key={bookStatus.id}>
                                <TableCell className="font-medium">{bookStatus.name}</TableCell>
                                <TableCell>{format(new Date(bookStatus.createdAt), "dd/MM/yyyy")}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

