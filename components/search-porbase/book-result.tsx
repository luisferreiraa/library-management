"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { BookData } from "@/types/book"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parseXML } from "@/utils/xml-parser"
import { createBookWithSearchElements } from "@/app/search-porbase/actions"
import { Button } from "../ui/button"

interface BookResultProps {
    data: string
}

export function BookResult({ data }: BookResultProps) {
    const [bookData, setBookData] = useState<BookData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [rawXml, setRawXml] = useState<string>(data)
    const [isAddingBook, setIsAddingBook] = useState(false)

    useEffect(() => {
        let getTextContent: (elements: Element[]) => string | null
        let getTextContents: (elements: Element[]) => string[]

        try {
            console.log("Dados recebidos:", data)
            setRawXml(data)

            // Verificar se os dados são XML
            if (data.includes("<dc") || data.includes("<?xml")) {
                // Criar um parser de XML
                const parser = new DOMParser()
                const xmlDoc = parser.parseFromString(data, "application/xml")

                // Verificar se houve erro no parsing
                const parseError = xmlDoc.querySelector("parsererror")
                if (parseError) {
                    console.error("Erro de parsing XML:", parseError.textContent)
                    throw new Error("Erro ao processar XML: " + parseError.textContent)
                }

                console.log("XML Document:", xmlDoc)

                // Função para obter elementos considerando namespaces
                const getElements = (tagName: string): Element[] => {
                    // Tentar diferentes abordagens para lidar com namespaces
                    const elements =
                        xmlDoc.getElementsByTagName(tagName) ||
                        xmlDoc.getElementsByTagName(`dc:${tagName}`) ||
                        xmlDoc.querySelectorAll(`[*|${tagName}]`) ||
                        xmlDoc.querySelectorAll(`*|${tagName}`)

                    return Array.from(elements)
                }

                // Função auxiliar para obter o texto de um elemento XML
                getTextContent = (elements: Element[]): string | null => {
                    return elements.length > 0 ? elements[0].textContent : null
                }

                // Função auxiliar para obter o texto de múltiplos elementos XML
                getTextContents = (elements: Element[]): string[] => {
                    return elements.map((el) => el.textContent || "").filter(Boolean)
                }

                // Extrair os dados do XML usando diferentes abordagens
                const title = getTextContent(getElements("title")) || ""
                const creator = getTextContent(getElements("creator")) || ""
                const subject = getTextContent(getElements("subject")) || ""
                const descriptions = getTextContents(getElements("description"))
                const publishers = getTextContents(getElements("publisher"))
                const contributors = getTextContents(getElements("contributor"))
                const date = getTextContent(getElements("date")) || ""
                const type = getTextContent(getElements("type")) || ""
                const format = getTextContent(getElements("format")) || ""
                const identifiers = getTextContents(getElements("identifier"))
                const language = getTextContent(getElements("language")) || ""

                console.log("Dados extraídos:", {
                    title,
                    creator,
                    subject,
                    descriptions,
                    publishers,
                    contributors,
                    date,
                    type,
                    format,
                    identifiers,
                    language,
                })

                // Se não conseguimos extrair o título, tentar uma abordagem alternativa
                if (!title) {
                    console.log("Tentando abordagem alternativa para extrair dados")

                    // Extrair todos os elementos e seus conteúdos
                    const allElements = xmlDoc.getElementsByTagName("*")
                    const extractedData: Record<string, string[]> = {}

                    for (let i = 0; i < allElements.length; i++) {
                        const element = allElements[i]
                        const tagName = element.localName || element.nodeName.split(":").pop() || ""

                        if (tagName && element.textContent) {
                            if (!extractedData[tagName]) {
                                extractedData[tagName] = []
                            }
                            extractedData[tagName].push(element.textContent)
                        }
                    }

                    console.log("Dados extraídos (alternativa):", extractedData)

                    // Construir o objeto BookData a partir dos dados extraídos
                    const bookData: BookData = {
                        title: extractedData.title?.[0] || "",
                        creator: extractedData.creator?.[0] || "",
                        subject: extractedData.subject?.[0] || "",
                        description: extractedData.description || [],
                        publisher: extractedData.publisher || [],
                        contributor: extractedData.contributor || [],
                        date: extractedData.date?.[0] || "",
                        type: extractedData.type?.[0] || "",
                        format: extractedData.format?.[0] || "",
                        identifier: extractedData.identifier || [],
                        language: extractedData.language?.[0] || "",
                    }

                    setBookData(bookData)
                } else {
                    // Construir o objeto BookData a partir dos dados extraídos
                    const extractedData: BookData = {
                        title,
                        creator,
                        subject,
                        description: descriptions,
                        publisher: publishers,
                        contributor: contributors,
                        date,
                        type,
                        format,
                        identifier: identifiers,
                        language,
                    }

                    setBookData(extractedData)
                }
            } else {
                // Se não for XML, exibir erro
                console.error("Os dados não parecem ser XML:", data)
                setError("Os dados recebidos não estão no formato XML esperado")
            }
        } catch (err: any) {
            console.error("Erro ao processar dados:", err)
            setError(`Erro ao processar os dados do livro: ${err instanceof Error ? err.message : String(err)}`)
        }

        try {
            // Se o parsing falhar, tentar o método de fallback
            if (!bookData) {
                console.log("Tentando método de fallback para parsing XML")
                const fallbackData = parseXML(data)

                if (fallbackData) {
                    console.log("Dados extraídos via fallback:", fallbackData)
                    setBookData(fallbackData)
                } else {
                    setError("Não foi possível extrair dados do XML")
                }
            }
        } catch (err: any) {
            console.error("Erro ao processar dados:", err)
            setError(`Erro ao processar os dados do livro: ${err instanceof Error ? err.message : String(err)}`)
        }
    }, [data])

    // Função auxiliar para obter o texto de um elemento XML
    function getTextContent(elements: Element[]): string | null {
        return elements.length > 0 ? elements[0].textContent : null
    }

    // Função auxiliar para obter o texto de múltiplos elementos XML
    function getTextContents(elements: Element[]): string[] {
        return elements.map((el) => el.textContent || "").filter(Boolean)
    }

    // Função para adicionar o livro à base de dados
    const handleAddBook = async () => {
        if (!bookData) return

        try {
            setIsAddingBook(true)

            // Chamando a função para criar o livro
            const newBook = await createBookWithSearchElements(bookData)

            console.log("Livro adicionado com sucesso:", newBook)

        } catch (err: any) {
            console.error("Erro ao adicionar livro:", err)

        } finally {
            setIsAddingBook(false)
        }
    }

    if (error) {
        return (
            <Card className="p-4 bg-red-50 text-red-800">
                <p>{error}</p>
                <Tabs defaultValue="raw">
                    <TabsList className="mt-4">
                        <TabsTrigger value="raw">XML Bruto</TabsTrigger>
                    </TabsList>
                    <TabsContent value="raw">
                        <pre className="mt-2 p-4 bg-gray-100 text-xs overflow-auto rounded">{rawXml}</pre>
                    </TabsContent>
                </Tabs>
            </Card>
        )
    }

    if (!bookData) {
        return (
            <Card className="p-4">
                <p>Carregando dados do livro...</p>
                <pre className="mt-4 text-xs overflow-auto">{rawXml}</pre>
            </Card>
        )
    }

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <Tabs defaultValue="formatted">
                    <TabsList>
                        <TabsTrigger value="formatted">Dados Formatados</TabsTrigger>
                        <TabsTrigger value="raw">XML Bruto</TabsTrigger>
                    </TabsList>

                    <TabsContent value="formatted">
                        <div className="space-y-6 mt-4">
                            <div>
                                <h3 className="text-2xl font-bold">{bookData.title || "Sem título"}</h3>
                                <p className="text-lg text-gray-700">{bookData.creator || "Autor desconhecido"}</p>
                            </div>

                            {/* Botão para adicionar livro */}
                            <Button
                                onClick={handleAddBook}
                                disabled={isAddingBook}
                                className="ml-4"
                            >
                                Adicionar Livro
                            </Button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900">Detalhes da Publicação</h4>
                                    <ul className="mt-2 space-y-1">
                                        <li>
                                            <span className="font-medium">Editora:</span>{" "}
                                            {bookData.publisher.join(", ") || "Não especificada"}
                                        </li>
                                        <li>
                                            <span className="font-medium">Data:</span> {bookData.date || "Não especificada"}
                                        </li>
                                        <li>
                                            <span className="font-medium">Formato:</span> {bookData.format || "Não especificado"}
                                        </li>
                                        <li>
                                            <span className="font-medium">Idioma:</span> {bookData.language || "Não especificado"}
                                        </li>
                                        <li>
                                            <span className="font-medium">Tipo:</span> {bookData.type || "Não especificado"}
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900">Identificadores</h4>
                                    <ul className="mt-2 space-y-1">
                                        {bookData.identifier.length > 0 ? (
                                            bookData.identifier.map((id, index) => (
                                                <li key={index}>
                                                    {id.startsWith("http") ? (
                                                        <a
                                                            href={id}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {id.includes("img") ? "Ver imagem da capa" : id}
                                                        </a>
                                                    ) : (
                                                        id
                                                    )}
                                                </li>
                                            ))
                                        ) : (
                                            <li>Nenhum identificador disponível</li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            {bookData.description.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-900">Descrição</h4>
                                    <ul className="mt-2 space-y-1">
                                        {bookData.description.map((desc, index) => (
                                            <li key={index}>{desc}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {bookData.contributor.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-900">Contribuidores</h4>
                                    <ul className="mt-2 space-y-1">
                                        {bookData.contributor.map((contributor, index) => (
                                            <li key={index}>{contributor}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div>
                                <h4 className="font-semibold text-gray-900">Assunto</h4>
                                <p className="mt-2">{bookData.subject || "Não especificado"}</p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="raw">
                        <pre className="mt-2 p-4 bg-gray-100 text-xs overflow-auto rounded">{rawXml}</pre>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

