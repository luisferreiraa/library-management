"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSession, signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

const loginSchema = z.object({
    username: z.string().min(1, "Nome de utilizador é obrigatório"),
    password: z.string().min(1, "Senha é obrigatória"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(data: LoginFormValues) {
        setIsLoading(true)
        setError(null)

        try {
            // Tentar fazer login
            const result = await signIn("credentials", {
                username: data.username,
                password: data.password,
                redirect: false,
            })

            if (result?.error) {
                // Verificar se a mensagem de erro é sobre conta desativada
                if (result.error.includes("Conta desativada")) {
                    setError("Conta desativada. Por favor, contacte o administrador.")
                } else {
                    setError("Credenciais inválidas. Por favor, tente novamente.")
                }
                setIsLoading(false)
                return
            }

            // Se o login for bem-sucedido, redirecionar para a página de destino
            // A atualização do último login é feita no método authorize
            window.location.href = callbackUrl // Usar window.location em vez de router.push
        } catch (error) {
            console.error("Erro ao fazer login:", error)
            setError("Ocorreu um erro ao fazer login. Por favor, tente novamente.")
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Login</CardTitle>
                <CardDescription>Entre com o seu nome de utilizador e senha</CardDescription>
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
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome de Utilizador</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Digite o seu nome de utilizador" {...field} />
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
                                        <Input type="password" placeholder="Digite a sua senha" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />A entrar...
                                </>
                            ) : (
                                "Entrar"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-2">
                <div className="flex gap-4">
                    <Link
                        href="/sign-up"
                        className="text-sm font-medium text-primary hover:underline"
                        prefetch={false}
                    >
                        Criar nova conta
                    </Link>
                    <Link
                        href="/recuperar-password"
                        className="text-sm font-medium text-primary hover:underline"
                        prefetch={false}
                    >
                        Recuperar senha
                    </Link>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Sistema de Gestão de Biblioteca</p>
            </CardFooter>
        </Card>
    )
}
