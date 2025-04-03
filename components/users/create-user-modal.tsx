"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createUserAction, uploadProfilePictureAction } from "@/app/users/actions"
import { useUsers } from "@/contexts/users-context"
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
import { toast } from "react-toastify"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUpload } from "@/components/ui/image-upload"

const formSchema = z.object({
    username: z.string().min(3, { message: "Nome de usuário deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
    firstName: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
    lastName: z.string().min(2, { message: "Sobrenome deve ter pelo menos 2 caracteres" }),
    address: z.string().min(5, { message: "Endereço deve ter pelo menos 5 caracteres" }),
    phoneNumber: z.string().min(9, { message: "Número de telefone inválido" }),
    idNumber: z.string().min(1, { message: "Número de identificação é obrigatório" }),
    nifNumber: z.string().refine((val) => !isNaN(Number(val)), { message: "NIF deve ser um número" }),
    profilePicture: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CreateUserModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
    const { addUser } = useUsers()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            address: "",
            phoneNumber: "",
            idNumber: "",
            nifNumber: "",
            profilePicture: "",
        },
    })

    async function onSubmit(values: FormValues) {
        setError(null)
        try {
            setIsSubmitting(true)

            // Se houver uma imagem para upload, processar primeiro
            if (profileImageFile) {
                const formData = new FormData()
                formData.append("file", profileImageFile)

                const imageUrl = await uploadProfilePictureAction(formData)
                values.profilePicture = imageUrl
            }

            // Criar usuário via Server Action
            const newUser = await createUserAction(values)

            // Atualizar UI otimisticamente
            addUser(newUser)

            // Fechar modal e mostrar toast
            onOpenChange(false)
            form.reset()
            setProfileImageFile(null)

            toast.success("Utilizador adicionado com sucesso", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })

        } catch (error: any) {
            setError(error.message || "Ocorreu um erro ao criar o usuário")

            toast.success("Erro ao adicionar utilizador", {
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
                    <DialogTitle>Criar Novo Usuário</DialogTitle>
                    <DialogDescription>Preencha os dados do usuário e clique em salvar quando terminar.</DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Tabs defaultValue="account" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="account">Conta</TabsTrigger>
                                <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
                                <TabsTrigger value="documents">Documentos</TabsTrigger>
                            </TabsList>

                            <TabsContent value="account" className="space-y-4 mt-4">
                                <div className="flex flex-col items-center mb-4">
                                    <FormField
                                        control={form.control}
                                        name="profilePicture"
                                        render={({ field }) => (
                                            <FormItem className="w-full flex flex-col items-center">
                                                <FormLabel className="text-center mb-2">Foto de Perfil</FormLabel>
                                                <FormControl>
                                                    <ImageUpload
                                                        value={field.value}
                                                        onChange={(file) => {
                                                            setProfileImageFile(file)
                                                            // Manter o valor atual se o arquivo for nulo
                                                            if (file === null && field.value) {
                                                                return
                                                            }
                                                            // Limpar o valor se o arquivo for nulo
                                                            if (file === null) {
                                                                field.onChange("")
                                                            }
                                                        }}
                                                        onClear={() => {
                                                            field.onChange("")
                                                            setProfileImageFile(null)
                                                        }}
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome de Usuário</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="johndoe" {...field} />
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
                                                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Senha</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="********" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>

                            <TabsContent value="personal" className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sobrenome</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Endereço</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Rua Exemplo, 123" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Telefone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="912345678" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>

                            <TabsContent value="documents" className="space-y-4 mt-4">
                                <FormField
                                    control={form.control}
                                    name="idNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número de Identificação</FormLabel>
                                            <FormControl>
                                                <Input placeholder="12345678" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="nifNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número de NIF</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123456789" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>
                        </Tabs>

                        <DialogFooter className="mt-6">
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

