"use client"

import { format } from "date-fns"
import Link from "next/link"
import { Trash2, ExternalLink, Pencil } from "lucide-react"
import { usePublishers } from "@/contexts/publishers-context"
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
import { deletePublishersAction } from "@/app/publishers/actions"
import { toast } from "@/components/ui/use-toast"
import { Pagination } from "../ui/pagination"
import { Publisher } from "@/lib/publishers"
import { PublisherModal } from "./publisher-modal"

export function PublishersTable() {
    const {
        paginatedPublishers,
        filteredPublishers,
        selectedPublisherIds,
        togglePublisherSelection,
        toggleAllPublishers,
        hasSelection,
        removePublishers,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalPages,
    } = usePublishers()

    const [isDeleting, setIsDeleting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null)

    // Verificar se todas as editoras estão selecionadas
    const allSelected =
        paginatedPublishers.length > 0 && paginatedPublishers.every((publisher) => selectedPublisherIds.includes(publisher.id))

    // Verificar se algumas editoras estão selecionadas
    const someSelected = selectedPublisherIds.length > 0 && !allSelected

    // Função para formatar a data corretamente
    const formatDate = (dateValue: Date | string) => {
        const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
        return format(date, "dd/MM/yyyy")
    }

    // Função para excluir as editoras selecionadas
    const handleDeleteSelected = async () => {
        if (selectedPublisherIds.length === 0) return

        try {
            setIsDeleting(true)

            // Chamar a Server Action para excluir as editoras
            await deletePublishersAction(selectedPublisherIds)

            // Atualizar o estado local otimisticamente
            removePublishers(selectedPublisherIds)

            toast({
                title: "Editoras excluídas com sucesso",
                description: `${selectedPublisherIds.length} editora(s) foram excluídas.`,
            })

            setIsDialogOpen(false)
        } catch (error) {
            toast({
                title: "Erro ao excluir editoras",
                description: "Ocorreu um erro ao exluir as editoras selecionadas",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    // Função para abrir o modal de edição
    const handleEditPublisher = (publisher: Publisher) => {
        setSelectedPublisher(publisher)
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
                                Excluir Selecionados ({selectedPublisherIds.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Excluir editoras</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja excluir {selectedPublisherIds.length} categoria(s)? Esta ação não pode ser desfeita.
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
                                    onCheckedChange={toggleAllPublishers}
                                    aria-label="Selecionar todos os autores"
                                />
                            </TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Data de Criação</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedPublishers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Nenhuma editora encontrada.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedPublishers.map((publisher) => (
                                <TableRow key={publisher.id} className={selectedPublisherIds.includes(publisher.id) ? "bg-muted/50" : ""}>
                                    <TableCell>
                                        <IndeterminateCheckbox
                                            checked={selectedPublisherIds.includes(publisher.id)}
                                            onCheckedChange={() => togglePublisherSelection(publisher.id)}
                                            aria-label={`Selecionar ${publisher.name}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {/* Transformar o nome da editora num link */}
                                        <Link
                                            href={`/publishers/${publisher.slug}`}
                                            className="hover:underline hover:text-primary transition-colors"
                                        >
                                            {publisher.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{format(new Date(publisher.createdAt), "dd/MM/yyyy")}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditPublisher(publisher)}>
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Editar {publisher.name}</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/publishers/${publisher.slug}`}>
                                                    <ExternalLink className="h-4 w-4" />
                                                    <span className="sr-only">Ver detalhes de {publisher.name}</span>
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
                totalItems={filteredPublishers.length}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                className="mt-4"
            />

            {/* Usar o novo modal de editora */}
            <PublisherModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} publisher={selectedPublisher} />
        </div>
    )
}

