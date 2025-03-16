"use client"

import { format } from "date-fns"
import { useFormats } from "@/contexts/formats-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function FormatsTable() {
    const { formats } = useFormats()

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
                    {formats.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                Nenhum formato encontrado.
                            </TableCell>
                        </TableRow>
                    ) : (
                        formats.map((fmats) => (
                            <TableRow key={fmats.id}>
                                <TableCell className="font-medium">{fmats.name}</TableCell>
                                <TableCell>{format(new Date(fmats.createdAt), "dd/MM/yyyy")}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

