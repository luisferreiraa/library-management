"use client"

import { FormDescription } from "@/components/ui/form"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createUserAction, updateUserAction, uploadProfilePictureAction } from "@/app/users/actions"
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
import { Switch } from "@/components/ui/switch"
import type { User } from "@/lib/users"

// Update the form schema to handle nifNumber correctly

const formSchema = z.object({
    username: z.string().min(3, { message: "Nome de usuário deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(8, { message: "Senha deve ter pelo menos 8 caracteres" }).optional(),
    firstName: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
    lastName: z.string().min(2, { message: "Sobrenome deve ter pelo menos 2 caracteres" }),
    address: z.string().min(5, { message: "Endereço deve ter pelo menos 5 caracteres" }),
    phoneNumber: z.string().min(9, { message: "Número de telefone inválido" }),
    idNumber: z.string().min(1, { message: "Número de identificação é obrigatório" }),
    nifNumber: z.string().refine((val) => !val || !isNaN(Number(val)), {
        message: "NIF deve ser um número",
    }),
    profilePicture: z.string().optional(),
    isActive: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

interface UserFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user?: User | null // Usuário para edição (opcional)
    mode: "create" | "edit"
}

export function CreateUserModal({ open, onOpenChange, user, mode = "create" }: UserFormModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
    const { addUser } = useUsers()
    const isEditMode = mode === "edit"

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
            isActive: true,
        },
    })

    // Preencher o formulário quando estiver no modo de edição e o usuário for fornecido
    useEffect(() => {
        if (isEditMode && user) {
            form.reset({
                username: user.username,
                email: user.email,
                // Não incluir senha no modo de edição
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address || "",
                phoneNumber: user.phoneNumber || "",
                idNumber: user.idNumber || "",
                nifNumber: user.nifNumber ? String(user.nifNumber) : "",
                profilePicture: user.profilePicture || "",
                isActive: user.isActive,
            })
        } else {
            // Resetar o formulário quando abrir no modo de criação
            form.reset({
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
                isActive: true,
            })
        }
    }, [form, user, isEditMode, open])

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

            if (isEditMode && user) {
                // Converter nifNumber para número e preparar dados para atualização
                const userData: {
                    id: string;
                    username: string;
                    email: string;
                    firstName: string;
                    lastName: string;
                    address: string;
                    phoneNumber: string;
                    idNumber: string;
                    nifNumber?: number;
                    isActive: boolean;
                    profilePicture?: string;
                    password?: string;
                } = {
                    id: user.id,
                    username: values.username,
                    email: values.email,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    address: values.address,
                    phoneNumber: values.phoneNumber,
                    idNumber: values.idNumber,
                    nifNumber: values.nifNumber ? Number(values.nifNumber) : undefined,
                    isActive: values.isActive,
                    profilePicture: values.profilePicture,
                }

                // Se a senha foi fornecida, incluí-la
                if (values.password) {
                    userData.password = values.password
                }

                // Atualizar usuário existente
                const updatedUser = await updateUserAction(userData)

                // Atualizar UI otimisticamente
                /* updateUser(updatedUser) */

                toast.success("Utilizador atualizado com sucesso", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
            } else {
                // Criar novo usuário
                const newUser = await createUserAction({
                    ...values,
                    nifNumber: values.nifNumber ? String(Number(values.nifNumber)) : "",
                    password: values.password || "", // Garantir que password não é undefined
                })

                // Atualizar UI otimisticamente
                addUser(newUser)

                toast.success("Utilizador adicionado com sucesso", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
            }

            // Fechar modal e resetar formulário
            onOpenChange(false)
            form.reset()
            setProfileImageFile(null)
        } catch (error: any) {
            setError(error.message || `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} o usuário`)

            toast.error(`Erro ao ${isEditMode ? "atualizar" : "adicionar"} utilizador`, {
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
                    <DialogTitle>{isEditMode ? "Editar Usuário" : "Criar Novo Usuário"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Atualize os dados do utilizador e clique em salvar quando terminar."
                            : "Preencha os dados do utilizador e clique em salvar quando terminar."}
                    </DialogDescription>
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

                                {!isEditMode && (
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
                                )}

                                {isEditMode && (
                                    <FormField
                                        control={form.control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                <div className="space-y-0.5">
                                                    <FormLabel>Status da Conta</FormLabel>
                                                    <FormDescription>{field.value ? "Conta ativa" : "Conta inativa"}</FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}
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
