"use client"

import { format } from "date-fns"
import Link from "next/link"
import { Trash2, ExternalLink, Pencil } from "lucide-react"
import { useFormats } from "@/contexts/formats-context"
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
import { deleteFormatsAction } from "@/app/formats/actions"
import { toast } from "@/components/ui/use-toast"
import { Pagination } from "../ui/pagination"
import { Format } from "@/lib/formats"
import { CreateFormatModal } from "./create-format-modal"
import { FormatModal } from "./format-modal"

export function FormatsTable() {
    const {
        paginatedFormats,
        filteredFormats,
        selectedFormatIds,
        toggleFormatSelection,
        toggleAllFormats,
        hasSelection,
        removeFormats,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalPages,
    } = useFormats()

    const [isDeleting, setIsDeleting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedFormat, setSelectedFormat] = useState<Format | null>(null)

    // Verificar se todos os formatos estão selecionadas
    const allSelected =
        paginatedFormats.length > 0 && paginatedFormats.every((format) => selectedFormatIds.includes(format.id))

    // Verificar se alguns formatos estão selecionadas
    const someSelected = selectedFormatIds.length > 0 && !allSelected

    // Função para formatar a data corretamente
    const formatDate = (dateValue: Date | string) => {
        const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
        return format(date, "dd/MM/yyyy")
    }

    // Função para excluir os formatos selecionadas
    const handleDeleteSelected = async () => {
        if (selectedFormatIds.length === 0) return

        try {
            setIsDeleting(true)

            // Chamar a Server Action para excluir os formatos
            await deleteFormatsAction(selectedFormatIds)

            // Atualizar o estado local otimisticamente
            removeFormats(selectedFormatIds)

            toast({
                title: "Formatos excluídos com sucesso",
                description: `${selectedFormatIds.length} formato(s) foram excluídos.`,
            })

            setIsDialogOpen(false)
        } catch (error) {
            toast({
                title: "Erro ao excluir formatos",
                description: "Ocorreu um erro ao exluir os formatos selecionados",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    // Função para abrir o modal de edição
    const handleEditFormat = (format: Format) => {
        setSelectedFormat(format)
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
                                Excluir Selecionados ({selectedFormatIds.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Excluir formatos</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja excluir {selectedFormatIds.length} formato(s)? Esta ação não pode ser desfeita.
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
                                    onCheckedChange={toggleAllFormats}
                                    aria-label="Selecionar todos os formatos"
                                />
                            </TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Data de Criação</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedFormats.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Nenhum formato encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedFormats.map((fmats) => (
                                <TableRow key={fmats.id} className={selectedFormatIds.includes(fmats.id) ? "bg-muted/50" : ""}>
                                    <TableCell>
                                        <IndeterminateCheckbox
                                            checked={selectedFormatIds.includes(fmats.id)}
                                            onCheckedChange={() => toggleFormatSelection(fmats.id)}
                                            aria-label={`Selecionar ${fmats.name}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {/* Transformar o nome do formato num link */}
                                        <Link
                                            href={`/formats/${fmats.slug}`}
                                            className="hover:underline hover:text-primary transition-colors"
                                        >
                                            {fmats.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{format(new Date(fmats.createdAt), "dd/MM/yyyy")}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditFormat(fmats)}>
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Editar {fmats.name}</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/categories/${fmats.slug}`}>
                                                    <ExternalLink className="h-4 w-4" />
                                                    <span className="sr-only">Ver detalhes de {fmats.name}</span>
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
                totalItems={filteredFormats.length}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                className="mt-4"
            />

            <FormatModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} format={selectedFormat} />
        </div>
    )
}

