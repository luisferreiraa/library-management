import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthorNotFound() {
    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <div className="mb-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/authors" className="flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        Voltar para a lista
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col items-center justify-center text-center py-20">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Autor não encontrado</h1>
                <p className="text-muted-foreground mb-8 max-w-md">
                    O autor que você está procurando não existe ou foi removido.
                </p>
                <Button asChild>
                    <Link href="/authors">Ver todos os autores</Link>
                </Button>
            </div>
        </div>
    )
}

