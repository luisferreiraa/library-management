"use client"

import { format } from "date-fns"
import { useLanguages } from "@/contexts/languages-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function LanguagesTable() {
    const { languages } = useLanguages()

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
                    {languages.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                Nenhum idioma encontrado.
                            </TableCell>
                        </TableRow>
                    ) : (
                        languages.map((language) => (
                            <TableRow key={language.id}>
                                <TableCell className="font-medium">{language.name}</TableCell>
                                <TableCell>{format(new Date(language.createdAt), "dd/MM/yyyy")}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

