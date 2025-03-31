"use client"

import { format } from "date-fns"
import Link from "next/link"
import { Trash2, ExternalLink, Pencil } from "lucide-react"
import { useTranslators } from "@/contexts/translators-context"
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
import { deleteTranslatorsAction } from "@/app/translators/actions"
import { toast } from "@/components/ui/use-toast"
import { Pagination } from "../ui/pagination"
import { Translator } from "@/lib/translators"
import { TranslatorModal } from "./translator-modal"

export function TranslatorsTable() {
    const {
        paginatedTranslators,
        filteredTranslators,
        selectedTranslatorIds,
        toggleTranslatorSelection,
        toggleAllTranslators,
        hasSelection,
        removeTranslators,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalPages,
    } = useTranslators()

    const [isDeleting, setIsDeleting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedTranslator, setSelectedTranslator] = useState<Translator | null>(null)

    // Verificar se todos os editores estão selecionadas
    const allSelected =
        paginatedTranslators.length > 0 && paginatedTranslators.every((translator) => selectedTranslatorIds.includes(translator.id))

    // Verificar se alguns tradutores estão selecionados
    const someSelected = selectedTranslatorIds.length > 0 && !allSelected

    // Função para formatar a data corretamente
    const formatDate = (dateValue: Date | string) => {
        const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
        return format(date, "dd/MM/yyyy")
    }

    // Função para excluir os tradutores selecionados
    const handleDeleteSelected = async () => {
        if (selectedTranslatorIds.length === 0) return

        try {
            setIsDeleting(true)

            // Chamar a Server Action para excluir os tradutores
            await deleteTranslatorsAction(selectedTranslatorIds)

            // Atualizar o estado local otimisticamente
            removeTranslators(selectedTranslatorIds)

            toast({
                title: "Tradutores excluídos com sucesso",
                description: `${selectedTranslatorIds.length} tradutor(es) foram excluídos.`,
            })

            setIsDialogOpen(false)
        } catch (error) {
            toast({
                title: "Erro ao excluir tradutores",
                description: "Ocorreu um erro ao exluir os tradutores selecionados",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    // Função para abrir o modal de edição
    const handleEditTranslator = (translator: Translator) => {
        setSelectedTranslator(translator)
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
                                Excluir Selecionados ({selectedTranslatorIds.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Excluir tradutores</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja excluir {selectedTranslatorIds.length} tradutor(es)? Esta ação não pode ser desfeita.
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
                                    onCheckedChange={toggleAllTranslators}
                                    aria-label="Selecionar todos os tradutores"
                                />
                            </TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Data de Criação</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedTranslators.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Nenhum tradutor encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedTranslators.map((translator) => (
                                <TableRow key={translator.id} className={selectedTranslatorIds.includes(translator.id) ? "bg-muted/50" : ""}>
                                    <TableCell>
                                        <IndeterminateCheckbox
                                            checked={selectedTranslatorIds.includes(translator.id)}
                                            onCheckedChange={() => toggleTranslatorSelection(translator.id)}
                                            aria-label={`Selecionar ${translator.name}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {/* Transformar o nome do tradutor num link */}
                                        <Link
                                            href={`/translators/${translator.slug}`}
                                            className="hover:underline hover:text-primary transition-colors"
                                        >
                                            {translator.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{format(new Date(translator.createdAt), "dd/MM/yyyy")}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditTranslator(translator)}>
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Editar {translator.name}</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/translators/${translator.slug}`}>
                                                    <ExternalLink className="h-4 w-4" />
                                                    <span className="sr-only">Ver detalhes de {translator.name}</span>
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
                totalItems={filteredTranslators.length}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                className="mt-4"
            />
            <TranslatorModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} translator={selectedTranslator} />
        </div>
    )
}

