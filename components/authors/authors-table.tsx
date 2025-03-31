"use client"

import { format } from "date-fns"
import Link from "next/link"
import { Trash2, ExternalLink, Pencil } from "lucide-react"
import { useAuthors } from "@/contexts/authors-context"
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
import { deleteAuthorsAction } from "@/app/authors/actions"
import { toast } from "@/components/ui/use-toast"
import { Pagination } from "../ui/pagination"
import { Author } from "@/lib/authors"
import { AuthorModal } from "./author-modal"

export function AuthorsTable() {
  const {
    paginatedAuthors,
    filteredAuthors,
    selectedAuthorIds,
    toggleAuthorSelection,
    toggleAllAuthors,
    hasSelection,
    removeAuthors,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
  } = useAuthors()

  const [isDeleting, setIsDeleting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null)

  // Verificar se todos os autores estão selecionados
  const allSelected =
    paginatedAuthors.length > 0 && paginatedAuthors.every((author) => selectedAuthorIds.includes(author.id))

  // Verificar se alguns autores estão selecionados
  const someSelected = selectedAuthorIds.length > 0 && !allSelected

  // Função para formatar a data corretamente
  const formatDate = (dateValue: Date | string) => {
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
    return format(date, "dd/MM/yyyy")
  }

  // Função para excluir os autores selecionados
  const handleDeleteSelected = async () => {
    if (selectedAuthorIds.length === 0) return

    try {
      setIsDeleting(true)

      // Chamar a Server Action para excluir os autores
      await deleteAuthorsAction(selectedAuthorIds)

      // Atualizar o estado local otimisticamente
      removeAuthors(selectedAuthorIds)

      toast({
        title: "Autores excluídos com sucesso",
        description: `${selectedAuthorIds.length} autor(es) foram excluídos.`,
      })

      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Erro ao excluir autores",
        description: "Ocorreu um erro ao excluir os autores selecionados.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Função para abir o modal de edição
  const handleEditAuthor = (author: Author) => {
    setSelectedAuthor(author)
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
                Excluir Selecionados ({selectedAuthorIds.length})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir autores</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir {selectedAuthorIds.length} autor(es)? Esta ação não pode ser desfeita.
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
                  onCheckedChange={toggleAllAuthors}
                  aria-label="Selecionar todos os autores"
                />
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Bio</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAuthors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum autor encontrado.
                </TableCell>
              </TableRow>
            ) : (
              paginatedAuthors.map((author) => (
                <TableRow key={author.id} className={selectedAuthorIds.includes(author.id) ? "bg-muted/50" : ""}>
                  <TableCell>
                    <IndeterminateCheckbox
                      checked={selectedAuthorIds.includes(author.id)}
                      onCheckedChange={() => toggleAuthorSelection(author.id)}
                      aria-label={`Selecionar ${author.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {/* Transformar o nome do autor em um link */}
                    <Link
                      href={`/authors/${author.id}`}
                      className="hover:underline hover:text-primary transition-colors"
                    >
                      {author.name}
                    </Link>
                  </TableCell>
                  <TableCell>{author.email}</TableCell>
                  <TableCell className="max-w-xs truncate">{author.bio || "-"}</TableCell>
                  <TableCell>{formatDate(author.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditAuthor(author)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar {author.name}</span>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/authors/${author.id}`}>
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Ver detalhes de {author.name}</span>
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
        totalItems={filteredAuthors.length}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        className="mt-4"
      />

      <AuthorModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} author={selectedAuthor} />
    </div>
  )
}

