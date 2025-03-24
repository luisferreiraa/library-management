"use client"

import { format } from "date-fns"
import Link from "next/link"
import { Trash2, ExternalLink } from "lucide-react"
import { useRoles } from "@/contexts/roles-context"
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
import { deleteRolesAction } from "@/app/roles/actions"
import { toast } from "@/components/ui/use-toast"
import { Pagination } from "../ui/pagination"

export function RolesTable() {
    const {
        paginatedRoles,
        filteredRoles,
        selectedRoleIds,
        toggleRoleSelection,
        toggleAllRoles,
        hasSelection,
        removeRoles,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalPages,
    } = useRoles()

    const [isDeleting, setIsDeleting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Verificar se todas os roles estão selecionados
    const allSelected =
        paginatedRoles.length > 0 && paginatedRoles.every((role) => selectedRoleIds.includes(role.id))

    // Verificar se alguns roles estão selecionados
    const someSelected = selectedRoleIds.length > 0 && !allSelected

    // Função para formatar a data corretamente
    const formatDate = (dateValue: Date | string) => {
        const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
        return format(date, "dd/MM/yyyy")
    }

    // Função para excluir as editoras selecionadas
    const handleDeleteSelected = async () => {
        if (selectedRoleIds.length === 0) return

        try {
            setIsDeleting(true)

            // Chamar a Server Action para excluir os roles
            await deleteRolesAction(selectedRoleIds)

            // Atualizar o estado local otimisticamente
            removeRoles(selectedRoleIds)

            toast({
                title: "Roles excluídos com sucesso",
                description: `${selectedRoleIds.length} role(s) foram excluídos.`,
            })

            setIsDialogOpen(false)
        } catch (error) {
            toast({
                title: "Erro ao excluir roles",
                description: "Ocorreu um erro ao exluir os roles selecionados",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="space-y-4">
            {hasSelection && (
                <div className="flex justify-end">
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Excluir Selecionados ({selectedRoleIds.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Excluir roles</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja excluir {selectedRoleIds.length} role(s)? Esta ação não pode ser desfeita.
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
                                    onCheckedChange={toggleAllRoles}
                                    aria-label="Selecionar todos os roles"
                                />
                            </TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Data de Criação</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedRoles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Nenhum role encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedRoles.map((role) => (
                                <TableRow key={role.id} className={selectedRoleIds.includes(role.id) ? "bg-muted/50" : ""}>
                                    <TableCell>
                                        <IndeterminateCheckbox
                                            checked={selectedRoleIds.includes(role.id)}
                                            onCheckedChange={() => toggleRoleSelection(role.id)}
                                            aria-label={`Selecionar ${role.name}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {/* Transformar o nome do role num link */}
                                        <Link
                                            href={`/roles/${role.slug}`}
                                            className="hover:underline hover:text-primary transition-colors"
                                        >
                                            {role.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{format(new Date(role.createdAt), "dd/MM/yyyy")}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/roles/${role.slug}`}>
                                                <ExternalLink className="h-4 w-4" />
                                                <span className="sr-only">Ver detalhes de {role.name}</span>
                                            </Link>
                                        </Button>
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
                totalItems={filteredRoles.length}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                className="mt-4"
            />
        </div>
    )
}

