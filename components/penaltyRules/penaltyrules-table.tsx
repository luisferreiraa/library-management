"use client"

import { format } from "date-fns"
import Link from "next/link"
import { Trash2, ExternalLink, Pencil, Check, X } from "lucide-react"
import { usePenaltyRules } from "@/contexts/penaltyrules-context"
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
import { deletePenaltyRulesAction } from "@/app/penalty-rules/actions"
import { toast } from "react-toastify"
import { Pagination } from "../ui/pagination"
import { PenaltyRuleModal } from "./penalty-rule-modal"
import { PenaltyRule } from "@/lib/penaltyrules"
import { Badge } from "../ui/badge"

export function PenaltyRulesTable() {
    const {
        paginatedRules,
        filteredPenaltyRules,
        selectedPenaltyRuleIds,
        togglePenaltyRuleSelection,
        toggleAllPenaltyRules,
        hasSelection,
        removePenaltyRules,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalPages,
    } = usePenaltyRules()

    const [isDeleting, setIsDeleting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedPenaltyRule, setSelectedPenaltyRule] = useState<PenaltyRule | null>(null)

    // Verificar se todas as penalty rules estão selecionadas
    const allSelected =
        paginatedRules.length > 0 && paginatedRules.every((penaltyRule) => selectedPenaltyRuleIds.includes(penaltyRule.id))

    // Verificar se algumas penalty rules estão selecionadas
    const someSelected = selectedPenaltyRuleIds.length > 0 && !allSelected

    // Função para formatar a data corretamente
    const formatDate = (dateValue: Date | string) => {
        const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
        return format(date, "dd/MM/yyyy")
    }

    // Função para excluir as penalty rules selecionadas
    const handleDeleteSelected = async () => {
        if (selectedPenaltyRuleIds.length === 0) return

        try {
            setIsDeleting(true)

            // Chamar a Server Action para excluir as penalty rules
            await deletePenaltyRulesAction(selectedPenaltyRuleIds)

            // Atualizar o estado local otimisticamente
            removePenaltyRules(selectedPenaltyRuleIds)

            const message = selectedPenaltyRuleIds.length === 1
                ? "Regra excluída com sucesso"
                : `Regras excluídas com sucesso (${selectedPenaltyRuleIds.length})`;

            toast.success(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })

            setIsDialogOpen(false)
        } catch (error) {

            const errorMessage = selectedPenaltyRuleIds.length === 1
                ? "Erro ao excluir regra"
                : "Erro ao excluir regras";

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })

        } finally {
            setIsDeleting(false)
        }
    }

    // Função para abrir o modal de edição
    const handleEditPenaltyRule = (penaltyRule: PenaltyRule) => {
        setSelectedPenaltyRule(penaltyRule)
        setIsEditModalOpen(true)
    }

    return (
        <div className="space-y-4">
            {hasSelection && (
                <div className="flex justify-end">
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Excluir Selecionados ({selectedPenaltyRuleIds.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Excluir multas</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja excluir {selectedPenaltyRuleIds.length} multa(s)? Esta ação não pode ser desfeita.
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
                                    onCheckedChange={toggleAllPenaltyRules}
                                    aria-label="Selecionar todas as multas"
                                />
                            </TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Valor p/ dia</TableHead>
                            <TableHead>Data de Criação</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedRules.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Nenhuma regra encontrada.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedRules.map((rule) => (
                                <TableRow key={rule.id} className={selectedPenaltyRuleIds.includes(rule.id) ? "bg-muted/50" : ""}>
                                    <TableCell>
                                        <IndeterminateCheckbox
                                            checked={selectedPenaltyRuleIds.includes(rule.id)}
                                            onCheckedChange={() => togglePenaltyRuleSelection(rule.id)}
                                            aria-label={`Selecionar ${rule.name}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{rule.name}</TableCell>
                                    <TableCell>{rule.description}</TableCell>
                                    <TableCell className="max-w-xs truncate">{rule.finePerDay + " €" || "-"}</TableCell>
                                    <TableCell>{format(new Date(rule.createdAt), "dd/MM/yyyy")}</TableCell>
                                    <TableCell>
                                        {rule.isActive ? (
                                            <Badge variant="success" className="flex items-center gap-1 w-fit">
                                                <Check className="h-3 w-3" />
                                                Ativo
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                                                <X className="h-3 w-3" />
                                                Inativo
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditPenaltyRule(rule)}>
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Editar {rule.name}</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/penalty-rules/${rule.slug}`}>
                                                    <ExternalLink className="h-4 w-4" />
                                                    <span className="sr-only">Ver detalhes de {rule.name}</span>
                                                </Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredPenaltyRules.length}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                className="mt-4"
            />

            <PenaltyRuleModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} penaltyRule={selectedPenaltyRule} />
        </div>
    )
}

