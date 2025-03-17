"use client"

import { format } from "date-fns"
import { usePenaltyRules } from "@/contexts/penaltyrules-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function PenaltyRulesTable() {
    const { penaltyRules } = usePenaltyRules()

    return (
        <div className="w-full mx-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Valor p/ dia</TableHead>
                        <TableHead>Data de Criação</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {penaltyRules.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                Nenhuma regra encontrada.
                            </TableCell>
                        </TableRow>
                    ) : (
                        penaltyRules.map((rule) => (
                            <TableRow key={rule.id}>
                                <TableCell className="font-medium">{rule.name}</TableCell>
                                <TableCell>{rule.description}</TableCell>
                                <TableCell className="max-w-xs truncate">{rule.finePerDay + " €" || "-"}</TableCell>
                                <TableCell>{format(new Date(rule.createdAt), "dd/MM/yyyy")}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

