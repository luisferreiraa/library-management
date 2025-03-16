"use client"

import { format } from "date-fns"
import { useTranslators } from "@/contexts/translators-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function TranslatorsTable() {
    const { translators } = useTranslators()

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
                    {translators.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                Nenhum tradutor encontrado.
                            </TableCell>
                        </TableRow>
                    ) : (
                        translators.map((translator) => (
                            <TableRow key={translator.id}>
                                <TableCell className="font-medium">{translator.name}</TableCell>
                                <TableCell>{format(new Date(translator.createdAt), "dd/MM/yyyy")}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

