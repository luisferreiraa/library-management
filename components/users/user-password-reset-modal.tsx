"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Alert, AlertDescription } from "../ui/alert"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@/lib/users"
import { updateUserPasswordAction } from "@/app/users/[id]/actions"
import { Button } from "../ui/button"
import { toast } from "react-toastify"

export const formSchema = z.object({
    password: z.string().min(1, { message: "A nova senha é obrigatória" })
})

export type FormValues = z.infer<typeof formSchema>

interface PasswordFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: User | null
    isAdmin: boolean
}

export function ResetPasswordModal({ open, onOpenChange, user, isAdmin }: PasswordFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
        },
    })

    useEffect(() => {
        if (user) {
            form.reset({
                password: "",
            })
        }
    }, [form, user, open])

    async function onSubmit(values: FormValues) {
        setError(null)
        try {
            setIsSubmitting(true)

            // Certifique-se de que a senha está presente
            if (!values.password) {
                console.error("A nova senha não foi fornecida")
            }

            // Envia a nova senha para a API de atualização
            await updateUserPasswordAction({
                userId: user?.id ?? "",
                newPassword: values.password,
            })

            toast.success("Senha redefinida com sucesso", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })

            // Após a senha ser atualizada com sucesso, fecha o modal
            onOpenChange(false)

        } catch (error: any) {
            setError(error.message || "Ocorreu um erro ao atualizar a senha.")

            toast.error("Ocorreu um erro ao redefinir a senha", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Redefinir Senha</DialogTitle>
                    <DialogDescription>
                        {isAdmin
                            ? "Atualize a senha do utilizador e clique em salvar"
                            : "Atualize a sua senha e clique em salvar"}
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Redefinir Senha</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nova senha"
                                                type="password" // Senha oculta
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <DialogFooter className="mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)} // Fecha o modal ao cancelar
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Salvando..." : "Salvar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}