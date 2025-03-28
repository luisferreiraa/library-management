"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createAuthorAction, updateAuthorAction } from "@/app/authors/actions"
import { useAuthors } from "@/contexts/authors-context"
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
import { Author } from "@/lib/authors"

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  bio: z.string().min(10, { message: "Bio deve ter pelo menos 10 caracteres" }),
})

type FormValues = z.infer<typeof formSchema>

interface CreateAuthorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  author?: Author | null
}

export function CreateAuthorModal({ open, onOpenChange, author }: CreateAuthorModalProps) {
  const isEditMode = !!author
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addAuthor } = useAuthors()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: author?.name || "",
      email: author?.email || "",
      bio: author?.bio || "",
    },
  })

  // Atualizar valores quando o autor muda ou o modal abre/ fecha
  useEffect(() => {
    if (open) {
      form.reset({
        name: author?.name || "",
        email: author?.email || "",
        bio: author?.bio || "",
      })
      setError(null)
    }
  }, [open, author, form])

  async function onSubmit(values: FormValues) {
    setError(null)
    try {
      setIsSubmitting(true)

      let resultAuthor

      if (isEditMode && author) {
        // Atualizar autor via Server Action
        resultAuthor = await updateAuthorAction({
          id: author.id,
          ...values,
        })
      } else {
        // Criar autor via Server Action
        resultAuthor = await createAuthorAction(values)
      }

      // Atualizar UI otimisticamente
      addAuthor(resultAuthor)

      // Fechar modal e mostrar toast
      onOpenChange(false)
      form.reset()

      toast({
        title: isEditMode ? "Autor atualizado com sucesso" : "Autor criado com sucesso",
        description: `${resultAuthor.name} foi ${isEditMode ? "atualizado" : "adicionado"} à lista de autores.`,
      })
    } catch (error: any) {
      setError(error.message || `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} o autor`)

      toast({
        title: `Erro ao ${isEditMode ? "atualizar" : "criar"} autor`,
        description:
          error.message || `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} o autor. Tente novamente.`,
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
          <DialogTitle>{isEditMode ? "Editar Autor" : "Criar Novo Autor"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Edite os dados do autor e clique em salvar quando terminar."
              : "Preencha os dados do autor e clique em salvar quando terminar."}
          </DialogDescription>        </DialogHeader>

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
                    <Input placeholder="Nome do autor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biografia</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Breve biografia do autor" className="resize-none" rows={4} {...field} />
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

