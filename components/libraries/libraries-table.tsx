"use client"

import { format } from "date-fns"
import Link from "next/link"
import { Trash2, ExternalLink, Pencil, Check, X } from "lucide-react"
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
import { useEffect, useState } from "react"
import { deleteLibrariesAction } from "@/app/(super-admin)/libraries/actions"
import { toast } from "react-toastify"
import { Pagination } from "../ui/pagination"
import { LibraryModal } from "./library-modal"
import { Library } from "@/lib/libraries"
import { Badge } from "../ui/badge"
import { useLibraries } from "@/contexts/libraries-context"

export function LibrariesTable() {
    const {
        paginatedEntities,
        filteredEntities,
        selectedEntityIds,
        toggleEntitySelection,
        toggleAllEntities,
        hasSelection,
        removeEntities,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalPages,
    } = useLibraries()

    const [isDeleting, setIsDeleting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null)

    // Verificar se todas os roles estão selecionados
    const allSelected =
        paginatedEntities.length > 0 && paginatedEntities.every((entity) => selectedEntityIds.includes(entity.id))

    // Verificar se alguns roles estão selecionados
    const someSelected = selectedEntityIds.length > 0 && !allSelected

    // Função para formatar a data corretamente
    const formatDate = (dateValue: Date | string) => {
        const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
        return format(date, "dd/MM/yyyy")
    }

    // Função para excluir as editoras selecionadas
    const handleDeleteSelected = async () => {
        if (selectedEntityIds.length === 0) return

        try {
            setIsDeleting(true)

            // Chamar a Server Action para excluir
            await deleteLibrariesAction(selectedEntityIds)

            // Atualizar o estado local otimisticamente
            removeEntities(selectedEntityIds)

            const message = selectedEntityIds.length === 1
                ? "Biblioteca excluída com sucesso"
                : `Bibliotecas excluídas com sucesso (${selectedEntityIds.length})`;

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

            const errorMessage = selectedEntityIds.length === 1
                ? "Erro ao excluir biblioteca"
                : "Erro ao excluir bibliotecas";

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
    const handleEditLibrary = (entity: Library) => {
        setSelectedLibrary(entity)
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
                                Excluir Selecionados ({selectedEntityIds.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Excluir bibliotecas</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja excluir {selectedEntityIds.length} biblioteca(s)? Esta ação não pode ser desfeita.
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
                                    onCheckedChange={toggleAllEntities}
                                    aria-label="Selecionar todas as bibliotecas"
                                />
                            </TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Data de Criação</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedEntities.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Nenhuma biblioteca encontrada.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedEntities.map((entity) => (
                                <TableRow key={entity.id} className={selectedEntityIds.includes(entity.id) ? "bg-muted/50" : ""}>
                                    <TableCell>
                                        <IndeterminateCheckbox
                                            checked={selectedEntityIds.includes(entity.id)}
                                            onCheckedChange={() => toggleEntitySelection(entity.id)}
                                            aria-label={`Selecionar ${entity.name}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">

                                        <Link
                                            href={`/libraries/${entity.slug}`}
                                            className="hover:underline hover:text-primary transition-colors"
                                        >
                                            {entity.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{format(new Date(entity.createdAt), "dd/MM/yyyy")}</TableCell>
                                    <TableCell>
                                        {entity.isActive ? (
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
                                            <Button variant="ghost" size="icon" onClick={() => handleEditLibrary(entity)}>
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Editar {entity.name}</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/libraries/${entity.slug}`}>
                                                    <ExternalLink className="h-4 w-4" />
                                                    <span className="sr-only">Ver detalhes de {entity.name}</span>
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
                totalItems={filteredEntities.length}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                className="mt-4"
            />
            <LibraryModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} library={selectedLibrary} />
        </div>
    )
}

