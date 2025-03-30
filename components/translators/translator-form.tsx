"use client"

import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { UseFormReturn } from "react-hook-form"

// Schema para validação da editora
export const translatorSchema = z.object({

    name: z.string().min(2, { message: "Nome deve ter pelo menos dois caracteres" }),
})

export type TranslatorFormValues = z.infer<typeof translatorSchema>

// Valores padrão para o formulário
export const translatorDefaultValues: TranslatorFormValues = {
    name: "",
}

interface TranslatorFormProps {
    form: UseFormReturn<TranslatorFormValues>
    onSubmit: () => void
    isSubmitting: boolean
}

export function TranslatorForm({ form, onSubmit, isSubmitting }: TranslatorFormProps) {
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
                                    <Input placeholder="Nome do tradutor" {...field} />
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