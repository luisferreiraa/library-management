"use client"

import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import { useAuditLogs } from "@/contexts/logs-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IndeterminateCheckbox } from "@/components/ui/indetermined-checkbox"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { deleteAuditLogsAction } from "@/app/logs/actions"
import { toast } from "@/components/ui/use-toast"

export function AuditLogsTable() {
    const { filteredAuditLogs, selectedAuditLogIds, toggleAuditLogSelection, toggleAllAuditLogs, hasSelection, removeAuditLogs } =
        useAuditLogs()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Verificar se todos os logs estão selecionados
    const allSelected =
        filteredAuditLogs.length > 0 && filteredAuditLogs.every((auditLog) => selectedAuditLogIds.includes(auditLog.id))

    // Verificar se alguns logs estão selecionados
    const someSelected = selectedAuditLogIds.length > 0 && !allSelected

    // Função para formatar a data corretamente
    const formatDate = (dateValue: Date | string) => {
        const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
        return format(date, "dd/MM/yyyy")
    }

    // Função para excluir os autores selecionados
    const handleDeleteSelected = async () => {
        if (selectedAuditLogIds.length === 0) return

        try {
            setIsDeleting(true)

            // Chamar a Server Action para excluir os logs
            await deleteAuditLogsAction(selectedAuditLogIds)

            // Atualizar o estado local otimisticamente
            removeAuditLogs(selectedAuditLogIds)

            toast({
                title: "Logs excluídos com sucesso",
                description: `${selectedAuditLogIds.length} log(s) foram excluídos.`,
            })

            setIsDialogOpen(false)
        } catch (error) {
            toast({
                title: "Erro ao excluir logs",
                description: "Ocorreu um erro ao excluir os logs selecionados.",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="space-y-4">
            {hasSelection && (
                <div className="flex justify-end">
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Excluir Selecionados ({selectedAuditLogIds.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Excluir logs</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja excluir {selectedAuditLogIds.length} log(s)? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteSelected}
                                    disabled={isDeleting}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {isDeleting ? "Excluindo..." : "Excluir"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}

            <div className="w-full mx-auto rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <IndeterminateCheckbox
                                    checked={allSelected}
                                    indeterminate={someSelected}
                                    onCheckedChange={toggleAllAuditLogs}
                                    aria-label="Selecionar todos os autores"
                                />
                            </TableHead>
                            <TableHead>#</TableHead>
                            <TableHead>Entidade</TableHead>
                            <TableHead>Id Entidade</TableHead>
                            <TableHead>Ação</TableHead>
                            <TableHead>Utilizador</TableHead>
                            <TableHead>Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAuditLogs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Nenhum log encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAuditLogs.map((log, index) => (
                                <TableRow key={log.id} className={selectedAuditLogIds.includes(log.id) ? "bg-muted/50" : ""}>
                                    <TableCell>
                                        <IndeterminateCheckbox
                                            checked={selectedAuditLogIds.includes(log.id)}
                                            onCheckedChange={() => toggleAuditLogSelection(log.id)}
                                            aria-label={`Selecionar ${log.id}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>{log.entity}</TableCell>
                                    <TableCell>{log.entityId}</TableCell>
                                    <TableCell>{log.action}</TableCell>
                                    <TableCell>{log.user.username}</TableCell>
                                    <TableCell>{formatDate(log.timestamp)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

