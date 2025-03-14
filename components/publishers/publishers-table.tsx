"use client"

import { format } from "date-fns"
import { usePublishers } from "@/contexts/publishers-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function PublishersTable() {
    const { publishers } = usePublishers()

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
                    {publishers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                Nenhuma editora encontrada.
                            </TableCell>
                        </TableRow>
                    ) : (
                        publishers.map((publisher) => (
                            <TableRow key={publisher.id}>
                                <TableCell className="font-medium">{publisher.name}</TableCell>
                                <TableCell>{format(new Date(publisher.createdAt), "dd/MM/yyyy")}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

