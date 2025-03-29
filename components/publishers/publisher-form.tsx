"use client"

import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { UseFormReturn } from "react-hook-form"

// Schema para validação da editora
export const publisherSchema = z.object({

    name: z.string().min(2, { message: "Nome deve ter pelo menos dois caracteres" }),
})

export type PublisherFormValues = z.infer<typeof publisherSchema>

// Valores padrão para o formulário
export const publisherDefaultValues: PublisherFormValues = {
    name: "",
}

interface PublisherFormProps {
    form: UseFormReturn<PublisherFormValues>
    onSubmit: () => void
    isSubmitting: boolean
}

export function PublisherForm({ form, onSubmit, isSubmitting }: PublisherFormProps) {
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
                                    <Input placeholder="Nome da editora" {...field} />
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