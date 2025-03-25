"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createBookAction, uploadCoverImageAction } from "@/app/books/actions"
import { useBooks } from "@/contexts/books-context"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageUpload } from "@/components/ui/image-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getAuthors } from "@/lib/authors"
import { getFormats, getLanguages, getCategories, getTranslators, getBookStatuses } from "@/lib/books"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const formSchema = z.object({
    title: z.string().min(2, { message: "Título deve ter pelo menos 2 caracteres" }),
    isbn: z.string().min(10, { message: "ISBN inválido" }),
    publishingDate: z.date({ required_error: "Data de publicação é obrigatória" }),
    edition: z.coerce.number().int().positive({ message: "Edição deve ser um número positivo" }),
    pageCount: z.coerce.number().int().positive({ message: "Número de páginas deve ser um número positivo" }),
    summary: z.string().optional(),
    coverImage: z.string().optional(),
    formatId: z.string().min(1, { message: "Formato é obrigatório" }),
    languageId: z.string().min(1, { message: "Idioma é obrigatório" }),
    publisherId: z.string().min(1, { message: "Editora é obrigatória" }),
    authorId: z.string().min(1, { message: "Autor é obrigatório" }),
    translatorId: z.string().optional(),
    bookStatusId: z.string().min(1, { message: "Status é obrigatório" }),
    categoryIds: z.array(z.string()).min(1, { message: "Selecione pelo menos uma categoria" }),
})

type FormValues = z.infer<typeof formSchema>

interface CreateTranslatorBookModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    translatorId: string
    translatorName: string
}

export function CreateTranslatorBookModal({

})