import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PublisherNotFound() {
    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <div className="mb-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/books" className="flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        Voltar para a lista
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col items-center justify-center text-center py-20">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Editora não encontrada</h1>
                <p className="text-muted-foreground mb-8 max-w-md">
                    A editora que procura não existe ou foi removida.
                </p>
                <Button asChild>
                    <Link href="/publishers">Ver todas as editoras</Link>
                </Button>
            </div>
        </div>
    )
}

