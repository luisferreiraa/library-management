import { z } from "zod"

export const translatorSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
})

export type TranslatorFormValues = z.infer<typeof translatorSchema>
