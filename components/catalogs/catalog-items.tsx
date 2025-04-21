"use client"

import { deleteCatalogItems } from "@/lib/catalog-items"
import { Catalog, CatalogItem } from "@prisma/client"
import { useState } from "react"
import { toast } from "react-toastify"
import { EmptyState } from "../ui/empty-state"
import { Check, ExternalLink, FolderOpen, Pencil, PlusCircle, Trash2, X } from "lucide-react"
import { Button } from "../ui/button"
import { CreateCatalogItemModal } from "./create-catalog-item-modal"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { IndeterminateCheckbox } from "../ui/indetermined-checkbox"
import Link from "next/link"
import { format } from "date-fns"
import { Badge } from "../ui/badge"

interface CatalogItemsProps {
    catalog: Catalog
    catalogItems: CatalogItem[]
}

export default function CatalogItems({ catalog, catalogItems }: CatalogItemsProps) {

    const [isAddingItem, setIsAddingItem] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null)
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])

    const allSelected = catalogItems.length > 0 && catalogItems.every((c) => selectedItemIds.includes(c.id))
    const someSelected = selectedItemIds.length > 0 && !allSelected;

    const toggleItemSelection = (id: string) => {
        setSelectedItemIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        )
    }

    const toggleAllItems = (selected: boolean) => {
        if (selected) {
            setSelectedItemIds(catalogItems.map((e) => e.id))
        } else {
            setSelectedItemIds([])
        }
    }

    const clearSelection = () => setSelectedItemIds([])

    const hasSelection = selectedItemIds.length > 0

    const handleEditItem = (catalogItem: CatalogItem) => {
        setSelectedItem(catalogItem)
        setIsEditModalOpen(true)
    }

    const handleDeleteSelected = async () => {
        if (selectedItemIds.length === 0) return

        try {
            setIsDeleting(true)
            await deleteCatalogItems(selectedItemIds)

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

    if (catalogItems.length === 0) {
        return (
            <>
                <EmptyState
                    icon={<FolderOpen className="h-10 w-10" />}
                    title="Nenhum item encontrado"
                    description="Este catálogo ainda não possui itens registados."
                    action={
                        <Button onClick={() => setIsAddingItem(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Adicionar Item
                        </Button>
                    }
                />
                <CreateCatalogItemModal
                    open={isAddingItem}
                    onOpenChange={setIsAddingItem}
                    catalogId={catalog.id}
                    catalogName={catalog.name}
                />
            </>
        )
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
                                    {isDeleting ? "Excluindo..." : "Excluir"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-medium">Lista de Itens</h3>
                    <p className="text-sm text-muted-foreground">
                        {catalogItems.length} {catalogItems.length === 1 ? "item encontrado" : "itens encontrados"}
                    </p>
                </div>
                <Button onClick={() => setIsAddingItem(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Item
                </Button>
            </div>

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
                            <TableHead>Data de Criação</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {catalogItems.map((item) => (
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
                                <TableCell>{format(new Date(item.createdAt), "dd/MM/yyyy")}</TableCell>
                                <TableCell>{item.type}</TableCell>
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
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEditItem(item)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">Editar {item.title}</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/catalogs/${catalog.slug}`}>
                                                <ExternalLink className="h-4 w-4" />
                                                <span className="sr-only">Ver detalhes de {item.title}</span>
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <CreateCatalogItemModal
                open={isAddingItem}
                onOpenChange={setIsAddingItem}
                catalogId={catalog.id}
                catalogName={catalog.name}
            />

            <CreateCatalogItemModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                catalogId={catalog.id}
                catalogName={catalog.name}
                item={selectedItem}
                onSuccess={() => {
                    setSelectedItem(null);
                }}
            />
        </div>
    )
}