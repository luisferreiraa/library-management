"use client"

import { registerUserAction } from "@/app/users/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Alert, AlertDescription } from "../ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"

const registerSchema = z.object({
    username: z.string().min(1, "Nome de utilizador é obrigatório"),
    email: z.string().min(1, "Email é obrigatório").email("Introduza um email válido"),
    password: z.string().min(1, "Senha é obrigatória"),
    firstName: z.string().min(1, "Nome é obrigatório"),
    lastName: z.string().min(1, "Sobrenome é obrigatório"),
    address: z.string().min(1, "Morada é obrigatório"),
    phoneNumber: z.string().min(9, "Introduza um número de telefone válido"),
    idNumber: z.string().min(12, "Cartão de Cidadão deve ser composto por 12 caracteres"),
    nifNumber: z.string().min(9, "NIF deve ser composto por 9 dígitos")
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
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
        },
    })

    async function onSubmit(data: RegisterFormValues) {
        setIsLoading(true)
        setError(null)

        try {
            // Chama a ação de registro
            const user = await registerUserAction(data);

            // Se chegou aqui, o registro foi bem-sucedido
            window.location.href = "/login";

        } catch (error: any) {
            console.error("Erro ao criar utilizador:", error);
            // Usa a mensagem de erro específica que vem da action
            setError(error.message || "Ocorreu um erro ao criar utilizador. Por favor, tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="py-8">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Preencha seus dados para acessar o sistema
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Nome Completo */}
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Nome Completo</Label>
                                <div className="flex gap-2">
                                    <Input id="firstName" placeholder="Nome" {...form.register("firstName")} />
                                    <Input placeholder="Sobrenome" {...form.register("lastName")} />
                                </div>
                            </div>

                            {/* Dados de Acesso */}
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome de Usuário</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Escolha um nome de usuário" {...field} />
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
                                            <Input type="email" placeholder="seu@email.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Contato */}
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="000 000 000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Documentos */}
                            <FormField
                                control={form.control}
                                name="idNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Documento de Identificação</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nº do documento" {...field} />
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
                                        <FormLabel>NIF</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Número de identificação fiscal" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Morada */}
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Morada</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Sua morada completa" {...field} rows={2} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full mt-6" size="lg" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        A criar conta...
                                    </>
                                ) : (
                                    "Finalizar Cadastro"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>

                <CardFooter className="flex flex-col items-center gap-2 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                        Já possui uma conta?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Faça login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )


}