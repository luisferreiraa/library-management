"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRoles } from "@/contexts/roles-context"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createRoleAction } from "@/app/roles/actions"

const formSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
})

type FormValues = z.infer<typeof formSchema>

interface CreateRoleModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateRoleModal({ open, onOpenChange }: CreateRoleModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { addRole } = useRoles()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    async function onSubmit(values: FormValues) {
        setError(null)
        try {
            setIsSubmitting(true)

            // Criar role via Server Action
            const newRole = await createRoleAction(values)

            // Atualizar UI otimisticamente
            addRole(newRole)

            // Fechar modal e mostrar toast
            onOpenChange(false)
            form.reset()

            toast({
                title: "Role criado com sucesso",
                description: `${newRole.name} foi adicionado à lista de roles.`,
            })
        } catch (error: any) {
            setError(error.message || "Ocorreu um erro ao criar o role")

            toast({
                title: "Erro ao criar role",
                description: error.message || "Ocorreu um erro ao criar o role. Tente novamente.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Criar Novo Role</DialogTitle>
                    <DialogDescription>Preencha os dados do role e clique em salvar quando terminar.</DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome do role" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Salvando..." : "Salvar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

