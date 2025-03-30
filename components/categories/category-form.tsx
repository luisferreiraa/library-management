"use client"

import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { UseFormReturn } from "react-hook-form"

// Schema para validação da editora
export const categorySchema = z.object({

    name: z.string().min(2, { message: "Nome deve ter pelo menos dois caracteres" }),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

// Valores padrão para o formulário
export const categoryDefaultValues: CategoryFormValues = {
    name: "",
}

interface CategoryFormProps {
    form: UseFormReturn<CategoryFormValues>
    onSubmit: () => void
    isSubmitting: boolean
}

export function CategoryForm({ form, onSubmit, isSubmitting }: CategoryFormProps) {
    return (
        <Form {...form}>
            <form id="entity-form" onSubmit={onSubmit} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nome da categoria" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )
                    }}
                />
            </form>
        </Form>
    )
}