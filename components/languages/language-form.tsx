"use client"

import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { UseFormReturn } from "react-hook-form"

// Schema para validação da editora
export const languageSchema = z.object({

    name: z.string().min(2, { message: "Nome deve ter pelo menos dois caracteres" }),
})

export type LanguageFormValues = z.infer<typeof languageSchema>

// Valores padrão para o formulário
export const languageDefaultValues: LanguageFormValues = {
    name: "",
}

interface LanguageFormProps {
    form: UseFormReturn<LanguageFormValues>
    onSubmit: () => void
    isSubmitting: boolean
}

export function LanguageForm({ form, onSubmit, isSubmitting }: LanguageFormProps) {
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
                                    <Input placeholder="Nome do idioma" {...field} />
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