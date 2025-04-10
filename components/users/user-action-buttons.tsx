"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { updateUserIsActiveAction } from "@/app/users/actions"
import { toast } from "react-toastify"
import { CreateUserModal } from "./create-user-modal"
import type { User } from "@/lib/users"
import { UsersProvider } from "@/contexts/users-context"

interface UserActionButtonsProps {
    user: User
}

export function UserActionButtons({ user }: UserActionButtonsProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Função para alternar o status do utilizador
    const toggleUserActiveStatus = async () => {
        try {
            setIsLoading(true)

            // Chamar a server action para atualizar o status
            const newStatus = !user.isActive
            await updateUserIsActiveAction(user.id, newStatus)

            // Mostrar mensagem de sucesso
            toast.success(newStatus
                ? "Conta ativada com sucesso"
                : "Conta desativada com sucesso", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })

            // Atualizar a página
            router.refresh()
        } catch (error) {
            console.error("Erro ao atualizar status:", error)

            toast.error("Erro ao atualizar o status da conta", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Função para abrir o modal de edição
    const handleEditUser = () => {
        setIsEditModalOpen(true)
    }

    return (
        <>
            <UsersProvider initialUsers={[]}>
                <Button variant="outline" onClick={handleEditUser}>
                    Editar Utilizador
                </Button>
                <Button variant="outline">Redefinir Senha</Button>
                {user.isActive ? (
                    <Button variant="destructive" onClick={toggleUserActiveStatus} disabled={isLoading}>
                        {isLoading ? "Processando..." : "Desativar Conta"}
                    </Button>
                ) : (
                    <Button variant="default" onClick={toggleUserActiveStatus} disabled={isLoading}>
                        {isLoading ? "Processando..." : "Ativar Conta"}
                    </Button>
                )}

                {/* Modal de edição */}
                <CreateUserModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} user={user} mode="edit" />
            </UsersProvider>
        </>
    )
}