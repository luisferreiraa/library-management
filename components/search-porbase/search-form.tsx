"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { BookResult } from "./book-result"
import type { BookData } from "@/types/book"

interface SearchFormProps {
    searchAction: (isbn: string) => Promise<BookData | string>
}

export function SearchForm({ searchAction }: SearchFormProps) {
    const [isbn, setIsbn] = useState("")
    const [result, setResult] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isbn.trim()) {
            setError("Por favor, insira um ISBN válido")
            return
        }

        try {
            setIsLoading(true)
            setError(null)
            const data = await searchAction(isbn)

            // Se os dados retornados forem uma string, assumimos que é XML
            if (typeof data === "string") {
                setResult(data)
            } else {
                // Se for um objeto, convertemos para string JSON
                setResult(JSON.stringify(data))
            }
        } catch (err: any) {
            console.error("Erro na pesquisa:", err)
            setError(err.message || "Ocorreu um erro ao buscar os dados. Verifique o ISBN e tente novamente.")
            setResult(null)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="isbn">ISBN</Label>
                        <Input
                            id="isbn"
                            placeholder="Ex: 9789898855299"
                            value={isbn}
                            onChange={(e) => setIsbn(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "Pesquisando..." : "Pesquisar"}
                    </Button>
                </form>
            </Card>

            {result && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Resultado da Pesquisa</h2>
                    <BookResult data={result} />
                </div>
            )}
        </div>
    )
}

