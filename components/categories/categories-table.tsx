"use client"

import { format } from "date-fns"
import Link from "next/link"
import { Trash2, ExternalLink, Pencil, Check, X } from "lucide-react"
import { useCategories } from "@/contexts/categories-context"
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
import { deleteCategoriesAction } from "@/app/categories/actions"
import { toast } from "@/components/ui/use-toast"
import { Pagination } from "../ui/pagination"
import { Category } from "@/lib/categories"
import { CategoryModal } from "./category-modal"
import { Badge } from "../ui/badge"

export function CategoriesTable() {
    const {
        paginatedCategories,
        filteredCategories,
        selectedCategoryIds,
        toggleCategorySelection,
        toggleAllCategories,
        hasSelection,
        removeCategories,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalPages,
    } = useCategories()

    const [isDeleting, setIsDeleting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    // Verificar se todas as categorias estão selecionadas
    const allSelected =
        paginatedCategories.length > 0 && paginatedCategories.every((category) => selectedCategoryIds.includes(category.id))

    // Verificar se algumas categorias estão selecionadas
    const someSelected = selectedCategoryIds.length > 0 && !allSelected

    // Função para formatar a data corretamente
    const formatDate = (dateValue: Date | string) => {
        const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
        return format(date, "dd/MM/yyyy")
    }

    // Função para excluir as categorias selecionadas
    const handleDeleteSelected = async () => {
        if (selectedCategoryIds.length === 0) return

        try {
            setIsDeleting(true)

            // Chamar a Server Action para excluir as categorias
            await deleteCategoriesAction(selectedCategoryIds)

            // Atualizar o estado local otimisticamente
            removeCategories(selectedCategoryIds)

            toast({
                title: "Categorias excluídas com sucesso",
                description: `${selectedCategoryIds.length} categoria(s) foram excluídas.`,
            })

            setIsDialogOpen(false)
        } catch (error) {
            toast({
                title: "Erro ao excluir categorias",
                description: "Ocorreu um erro ao exluir as categorias selecionadas",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    // Função para abrir o modal de edição
    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category)
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
                                Excluir Selecionados ({selectedCategoryIds.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Excluir categorias</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja excluir {selectedCategoryIds.length} categoria(s)? Esta ação não pode ser desfeita.
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
                                    onCheckedChange={toggleAllCategories}
                                    aria-label="Selecionar todas as categorias"
                                />
                            </TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Data de Criação</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedCategories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Nenhuma categoria encontrada.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedCategories.map((category) => (
                                <TableRow key={category.id} className={selectedCategoryIds.includes(category.id) ? "bg-muted/50" : ""}>
                                    <TableCell>
                                        <IndeterminateCheckbox
                                            checked={selectedCategoryIds.includes(category.id)}
                                            onCheckedChange={() => toggleCategorySelection(category.id)}
                                            aria-label={`Selecionar ${category.name}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {/* Transformar o nome da categoria num link */}
                                        <Link
                                            href={`/categories/${category.slug}`}
                                            className="hover:underline hover:text-primary transition-colors"
                                        >
                                            {category.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{format(new Date(category.createdAt), "dd/MM/yyyy")}</TableCell>
                                    <TableCell>
                                        {category.isActive ? (
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
                                            <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Editar {category.name}</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/categories/${category.slug}`}>
                                                    <ExternalLink className="h-4 w-4" />
                                                    <span className="sr-only">Ver detalhes de {category.name}</span>
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
                totalItems={filteredCategories.length}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                className="mt-4"
            />
            <CategoryModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} category={selectedCategory} />
        </div>
    )
}
