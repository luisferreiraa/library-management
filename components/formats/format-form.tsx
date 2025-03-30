"use client"

import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { UseFormReturn } from "react-hook-form"

// Schema para validação da editora
export const formatSchema = z.object({

    name: z.string().min(2, { message: "Nome deve ter pelo menos dois caracteres" }),
})

export type FormatFormValues = z.infer<typeof formatSchema>

// Valores padrão para o formulário
export const formatDefaultValues: FormatFormValues = {
    name: "",
}

interface FormatFormProps {
    form: UseFormReturn<FormatFormValues>
    onSubmit: () => void
    isSubmitting: boolean
}

export function FormatForm({ form, onSubmit, isSubmitting }: FormatFormProps) {
    return (
        <Form {...form}>
            <form id="entity-form" onSubmit={onSubmit} className="space-y-4">
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => {
                        console.log("Valor do input name:", field.value); // Debug
                        return (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nome do formato" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )
                    }}
                />
                {/* </div> */}
            </form>
        </Form>
    )
}