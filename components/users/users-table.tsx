"use client"

import { format } from "date-fns"
import Link from "next/link"
import { Trash2, ExternalLink, Check, X } from "lucide-react"
import { useUsers } from "@/contexts/users-context"
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
import { deleteUsersAction } from "@/app/users/actions"
import { toast } from "react-toastify"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pagination } from "../ui/pagination"

export function UsersTable() {
    const {
        paginatedUsers,
        filteredUsers,
        selectedUserIds,
        toggleUserSelection,
        toggleAllUsers,
        hasSelection,
        removeUsers,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalPages,
    } = useUsers()

    const [isDeleting, setIsDeleting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Verificar se todos os usuários estão selecionados
    const allSelected = paginatedUsers.length > 0 && paginatedUsers.every((user) => selectedUserIds.includes(user.id))

    // Verificar se alguns usuários estão selecionados
    const someSelected = selectedUserIds.length > 0 && !allSelected

    // Função para formatar a data corretamente
    const formatDate = (dateValue: Date | string | null) => {
        if (!dateValue) return "-"
        const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
        return format(date, "dd/MM/yyyy")
    }

    // Função para obter as iniciais do nome
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    // Função para excluir os usuários selecionados
    const handleDeleteSelected = async () => {
        if (selectedUserIds.length === 0) return

        try {
            setIsDeleting(true)

            // Chamar a Server Action para excluir os usuários
            await deleteUsersAction(selectedUserIds)

            // Atualizar o estado local otimisticamente
            removeUsers(selectedUserIds)

            const message = selectedUserIds.length === 1
                ? "Utilizador excluído com sucesso"
                : `Utilizadores excluídos com sucesso (${selectedUserIds.length})`;

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

            const errorMessage = selectedUserIds.length === 1
                ? "Erro ao excluir utilizador"
                : "Erro ao excluir utilizadores";

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

    return (
        <div className="space-y-4">
            {hasSelection && (
                <div className="flex justify-end">
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Excluir Selecionados ({selectedUserIds.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Excluir usuários</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja excluir {selectedUserIds.length} usuário(s)? Esta ação não pode ser desfeita.
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
                                    onCheckedChange={toggleAllUsers}
                                    aria-label="Selecionar todos os usuários"
                                />
                            </TableHead>
                            <TableHead>Usuário</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Último Login</TableHead>
                            <TableHead className="w-[80px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Nenhum utilizador encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedUsers.map((user) => (
                                <TableRow key={user.id} className={selectedUserIds.includes(user.id) ? "bg-muted/50" : ""}>
                                    <TableCell>
                                        <IndeterminateCheckbox
                                            checked={selectedUserIds.includes(user.id)}
                                            onCheckedChange={() => toggleUserSelection(user.id)}
                                            aria-label={`Selecionar ${user.firstName} ${user.lastName}`}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage
                                                    src={user.profilePicture || undefined}
                                                    alt={`${user.firstName} ${user.lastName}`}
                                                />
                                                <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <Link
                                                    href={`/users/${user.id}`}
                                                    className="font-medium hover:underline hover:text-primary transition-colors"
                                                >
                                                    {user.firstName} {user.lastName}
                                                </Link>
                                                <div className="text-xs text-muted-foreground">@{user.username}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phoneNumber}</TableCell>
                                    <TableCell>
                                        {user.isActive ? (
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
                                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/users/${user.id}`}>
                                                <ExternalLink className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Ver detalhes de {user.firstName} {user.lastName}
                                                </span>
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
                totalItems={filteredUsers.length}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                className="mt-4"
            />
        </div>
    )
}

