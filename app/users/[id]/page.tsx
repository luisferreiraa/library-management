import { notFound } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { ChevronLeft, Mail, Phone, MapPin, CreditCardIcon, UserIcon } from "lucide-react"
import { getUserById } from "@/lib/users"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface UserPageProps {
    params: {
        id: string
    }
}

export default async function UserPage({ params }: UserPageProps) {
    const { id } = params
    const user = await getUserById(id)

    if (!user) {
        notFound()
    }

    // Função para formatar a data
    const formatDate = (dateValue: Date | string | null) => {
        if (!dateValue) return "-"
        const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
        return format(date, "dd/MM/yyyy HH:mm")
    }

    // Função para obter as iniciais do nome
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <div className="mb-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/users" className="flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        Voltar para a lista
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader className="flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={user.profilePicture || undefined} alt={`${user.firstName} ${user.lastName}`} />
                                <AvatarFallback className="text-2xl">{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                            </Avatar>
                            <CardTitle>
                                {user.firstName} {user.lastName}
                            </CardTitle>
                            <CardDescription>@{user.username}</CardDescription>
                            <div className="mt-2">
                                {user.isActive ? (
                                    <Badge variant="success" className="flex items-center gap-1 w-fit mx-auto">
                                        Ativo
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive" className="flex items-center gap-1 w-fit mx-auto">
                                        Inativo
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.phoneNumber}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                                    <span>NIF: {user.nifNumber}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                                    <span>ID: {user.idNumber}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Detalhadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">ID do Sistema</dt>
                                    <dd className="mt-1 text-sm">{user.id}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Registado em</dt>
                                    <dd className="mt-1 text-sm">{formatDate(user.createdAt)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Última atualização</dt>
                                    <dd className="mt-1 text-sm">{formatDate(user.updatedAt)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Último login</dt>
                                    <dd className="mt-1 text-sm">{formatDate(user.lastLogin)}</dd>
                                </div>
                            </dl>

                            <Separator className="my-6" />

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Ações</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Button variant="outline">Editar Utilizador</Button>
                                    <Button variant="outline">Redefinir Senha</Button>
                                    {user.isActive ? (
                                        <Button variant="destructive">Desativar Conta</Button>
                                    ) : (
                                        <Button variant="default">Ativar Conta</Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

