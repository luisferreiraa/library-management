"use client"

import { format } from "date-fns"
import Link from "next/link"
import { Trash2, ExternalLink, Pencil } from "lucide-react"
import { useLanguages } from "@/contexts/languages-context"
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
import { deleteLanguagesAction } from "@/app/languages/actions"
import { toast } from "@/components/ui/use-toast"
import { Pagination } from "../ui/pagination"
import { Language } from "@/lib/languages"
import { LanguageModal } from "./language-modal"

export function LanguagesTable() {
    const {
        paginatedLanguages,
        filteredLanguages,
        selectedLanguageIds,
        toggleLanguageSelection,
        toggleAllLanguages,
        hasSelection,
        removeLanguages,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalPages,
    } = useLanguages()

    const [isDeleting, setIsDeleting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)

    // Verificar se todos os idiomas estão selecionados
    const allSelected =
        paginatedLanguages.length > 0 && paginatedLanguages.every((language) => selectedLanguageIds.includes(language.id))

    // Verificar se alguns idiomas estão selecionados
    const someSelected = selectedLanguageIds.length > 0 && !allSelected

    // Função para formatar a data corretamente
    const formatDate = (dateValue: Date | string) => {
        const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
        return format(date, "dd/MM/yyyy")
    }

    // Função para excluir os idiomas selecionados
    const handleDeleteSelected = async () => {
        if (selectedLanguageIds.length === 0) return

        try {
            setIsDeleting(true)

            // Chamar a Server Action para excluir os idiomas
            await deleteLanguagesAction(selectedLanguageIds)

            // Atualizar o estado local otimisticamente
            removeLanguages(selectedLanguageIds)

            toast({
                title: "Idiomas excluídos com sucesso",
                description: `${selectedLanguageIds.length} idioma(s) foram excluídos.`,
            })

            setIsDialogOpen(false)
        } catch (error) {
            toast({
                title: "Erro ao excluir idiomas",
                description: "Ocorreu um erro ao exluir os idiomas selecionados",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    // Função para abrir o modal de edição
    const handleEditLanguage = (language: Language) => {
        setSelectedLanguage(language)
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
                                Excluir Selecionados ({selectedLanguageIds.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Excluir categorias</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja excluir {selectedLanguageIds.length} idioma(s)? Esta ação não pode ser desfeita.
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
                                    onCheckedChange={toggleAllLanguages}
                                    aria-label="Selecionar todos os idiomas"
                                />
                            </TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Data de Criação</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedLanguages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Nenhum idioma encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedLanguages.map((language) => (
                                <TableRow key={language.id} className={selectedLanguageIds.includes(language.id) ? "bg-muted/50" : ""}>
                                    <TableCell>
                                        <IndeterminateCheckbox
                                            checked={selectedLanguageIds.includes(language.id)}
                                            onCheckedChange={() => toggleLanguageSelection(language.id)}
                                            aria-label={`Selecionar ${language.name}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {/* Transformar o nome do idioma num link */}
                                        <Link
                                            href={`/languages/${language.slug}`}
                                            className="hover:underline hover:text-primary transition-colors"
                                        >
                                            {language.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{format(new Date(language.createdAt), "dd/MM/yyyy")}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditLanguage(language)}>
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Editar {language.name}</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/languages/${language.slug}`}>
                                                    <ExternalLink className="h-4 w-4" />
                                                    <span className="sr-only">Ver detalhes de {language.name}</span>
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
                totalItems={filteredLanguages.length}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                className="mt-4"
            />

            <LanguageModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} language={selectedLanguage} />
        </div>
    )
}

