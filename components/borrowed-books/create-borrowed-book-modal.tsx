"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createBorrowedBookAction } from "@/app/borrowed-books/actions"
import { useBorrowedBooks } from "@/contexts/borrowed-books-context"
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

const formSchema = z.object({
    code: z.string().nonempty({ message: "Código de Barras é obrigatório" }),
    userId: z.string().nonempty({ message: "Id de utilizador é obrigatório" }),
})

type FormValues = z.infer<typeof formSchema>

interface CreateBorrowedBookModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateBorrowedBookModal({ open, onOpenChange }: CreateBorrowedBookModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { addBorrowedBook } = useBorrowedBooks()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            userId: "",
        },
    })

    async function onSubmit(values: FormValues) {
        setError(null)
        try {
            setIsSubmitting(true)

            // Criar borrowedBook via Server Action
            const newBorrowedBook = await createBorrowedBookAction(values)

            // Atualizar UI otimisticamente
            addBorrowedBook(newBorrowedBook)

            // Fechar modal e mostrar toast
            onOpenChange(false)
            form.reset()

            toast({
                title: "Livro emprestado com sucesso",
                description: `${newBorrowedBook.id} foi adicionado à lista de empréstimos.`,
            })
        } catch (error: any) {
            setError(error.message || "Ocorreu um erro ao emprestar livro")

            toast({
                title: "Erro ao emprestar livro",
                description: error.message || "Ocorreu um erro ao emprestar o livro. Tente novamente.",
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
                    <DialogTitle>Registar Empréstimo</DialogTitle>
                    <DialogDescription>Preencha os dados do empréstimo e clique em salvar quando terminar.</DialogDescription>
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
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Livro</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Código de Barras..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Utilizador</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Id do Utilizador..." {...field} />
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
                                {isSubmitting ? "A salvar..." : "Salvar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

