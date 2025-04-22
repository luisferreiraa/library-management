"use client"

import { format } from "date-fns"
import Link from "next/link"
import Image from "next/image"
import { Trash2, ExternalLink, BookIcon, Check, X, Pencil, PlusCircle } from "lucide-react"
import { useItems } from "@/contexts/catalog-items-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IndeterminateCheckbox } from "@/components/ui/indetermined-checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { deleteCatalogItemsAction } from "@/app/catalog-items/actions"
import { toast } from "react-toastify"
import { Pagination } from "../ui/pagination"
import { CreateCatalogItemModal } from "./create-catalog-item-modal"
import type { CatalogItem, ItemType } from "@prisma/client"

export function ItemsTable() {
    const {
        paginatedItems,
        filteredItems,
        selectedItemIds,
        toggleItemSelection,
        toggleAllItems,
        hasSelection,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalPages,
    } = useItems()

    const [isDeleting, setIsDeleting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null)
    const [typeToEdit, setTypeToEdit] = useState<ItemType | null>(null)

    // Verificar se todos os itens estão selecionados
    const allSelected = paginatedItems.length > 0 && paginatedItems.every((item) => selectedItemIds.includes(item.id))

    // Verificar se alguns itens estão selecionados
    const someSelected = selectedItemIds.length > 0 && !allSelected

    // Função para formatar a data corretamente
    const formatDate = (dateValue: Date | string | null) => {
        if (!dateValue) return "-"
        const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
        return format(date, "dd/MM/yyyy")
    }

    // Função para excluir os itens selecionados
    const handleDeleteSelected = async () => {
        if (selectedItemIds.length === 0) return

        try {
            setIsDeleting(true)

            // Chamar a Server Action para excluir os itens
            await deleteCatalogItemsAction(selectedItemIds)

            const message = selectedItemIds.length === 1
                ? "Item excluído com sucesso"
                : `Itens excluídos com sucesso (${selectedItemIds.length})`;

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

            const errorMessage = selectedItemIds.length === 1
                ? "Erro ao excluir item"
                : "Erro ao excluir itens";

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
    const handleEditItem = (item: CatalogItem) => {
        setSelectedItem(item)
        setTypeToEdit(item.type)
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
                                Excluir Selecionados ({selectedItemIds.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Excluir itens</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja excluir {selectedItemIds.length} item(s)? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteSelected}
                                    disabled={isDeleting}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {isDeleting ? "A excluir..." : "Excluir"}
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
                                    onCheckedChange={toggleAllItems}
                                    aria-label="Selecionar todos os itens"
                                />
                            </TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Data de Criação</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Nenhum item encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedItems.map((item) => (
                                <TableRow key={item.id} className={selectedItemIds.includes(item.id) ? "bg-muted/50" : ""}>
                                    <TableCell>
                                        <IndeterminateCheckbox
                                            checked={selectedItemIds.includes(item.id)}
                                            onCheckedChange={() => toggleItemSelection(item.id)}
                                            aria-label={`Selecionar ${item.title}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <Link
                                            href={`/catalog-items/${item.id}`}
                                            className="hover:underline hover:text-primary transition-colors"
                                        >
                                            {item.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{item.type}</TableCell>
                                    <TableCell>{format(new Date(item.createdAt), "dd/MM/yyyy")}</TableCell>
                                    <TableCell>
                                        {item.isActive ? (
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
                                            <Button variant="ghost" size="icon" onClick={() => handleEditItem(item)}>
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Editar {item.title}</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/catalog-items/${item.id}`}>
                                                    <ExternalLink className="h-4 w-4" />
                                                    <span className="sr-only">Ver detalhes de {item.title}</span>
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
                totalItems={filteredItems.length}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                className="mt-4"
            />

            <CreateCatalogItemModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} catalogItem={selectedItem} typeToEdit={typeToEdit} />
        </div>
    )
}

