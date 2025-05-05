import { getRecordByIdAction } from "../actions"
import { extractBasicInfoFromUnimarc } from "@/lib/unimarc-converter"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft } from "lucide-react"

interface RecordPageProps {
    params: {
        id: string
    }
}

export default async function RecordPage({ params }: RecordPageProps) {
    const record = await getRecordByIdAction(params.id)

    if (!record) {
        notFound()
    }

    // Extrair informações básicas do metada UNIMARC
    const basicInfo = record.metadata
        ? extractBasicInfoFromUnimarc(record.metadata)
        : {
            title: "Sem título",
            author: "Autor desconhecido",
            year: "Ano desconhecido",
        }

    return (
        <div className="container mx-auto py-8">
            <div className="mb-6">
                <Link href="/records">
                    <Button variant="outline" size="sm">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Voltar para Registros
                    </Button>
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">{basicInfo.title}</h1>
                <p className="text-lg text-muted-foreground mt-2">
                    {basicInfo.author} • {basicInfo.year}
                </p>
            </div>

            <Tabs defaultValue="details" className="w-full">
                <TabsList>
                    <TabsTrigger value="details">Detalhes</TabsTrigger>
                    <TabsTrigger value="unimarc">UNIMARC</TabsTrigger>
                    <TabsTrigger value="fields">Campos</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Básicas</CardTitle>
                            <CardDescription>Detalhes do registro bibliográfico</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">ID</dt>
                                    <dd className="mt-1">{record.id}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Criado em</dt>
                                    <dd className="mt-1">
                                        {new Date(record.createdAt).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Última atualização</dt>
                                    <dd className="mt-1">
                                        {new Date(record.updatedAt).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="unimarc" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Metadata UNIMARC</CardTitle>
                            <CardDescription>Representação do registro no formato UNIMARC</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[600px] text-sm">
                                {JSON.stringify(record.metadata, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="fields" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Campos de Controle</CardTitle>
                            <CardDescription>Campos de controle do registro</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {record.controlFields.length === 0 ? (
                                    <p className="text-muted-foreground">Nenhum campo de controle</p>
                                ) : (
                                    record.controlFields.map((field) => (
                                        <div key={field.id} className="border p-4 rounded-md">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium">
                                                        {field.definition.tag} - {field.definition.name}
                                                    </h4>
                                                    <p className="mt-1">{field.value}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Campos de Dados</CardTitle>
                            <CardDescription>Campos de dados do registro</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {record.dataFields.length === 0 ? (
                                    <p className="text-muted-foreground">Nenhum campo de dados</p>
                                ) : (
                                    record.dataFields.map((field) => (
                                        <div key={field.id} className="border p-4 rounded-md">
                                            <div className="mb-2">
                                                <h4 className="font-medium">
                                                    {field.definition.tag} - {field.definition.name}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Indicadores: [{field.ind1 || " "}] [{field.ind2 || " "}]
                                                </p>
                                            </div>

                                            <div className="space-y-2 mt-3">
                                                <h5 className="text-sm font-medium">Subcampos:</h5>
                                                {field.subFields.map((subfield, index) => (
                                                    <div key={subfield.id} className="pl-4 border-l-2 border-gray-200">
                                                        <p>
                                                            <span className="text-muted-foreground">${String.fromCharCode(97 + (index % 26))}</span>{" "}
                                                            {subfield.value}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}