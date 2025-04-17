import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

type EntityNotFoundProps = {
    entityName: string // Ex: "Biblioteca"
    entityGender?: "masculino" | "feminino" // Default: "masculino"
    entityPlural?: string // Ex: "Bibliotecas"
    backHref: string
    listHref: string
}

export default function EntityNotFound({
    entityName,
    entityGender = "masculino",
    entityPlural,
    backHref,
    listHref,
}: EntityNotFoundProps) {
    const artigoSingular = entityGender === "feminino" ? "A" : "O"
    const artigoMin = artigoSingular.toLowerCase()
    const sufixoEncontrado = entityGender === "feminino" ? "encontrada" : "encontrado"
    const plural = entityPlural ?? `${entityName}s`
    const artigoPlural = entityGender === "feminino" ? "todas as" : "todos os"

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <div className="mb-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={backHref} className="flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        Voltar para a lista
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col items-center justify-center text-center py-20">
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                    {entityName} não {sufixoEncontrado}
                </h1>
                <p className="text-muted-foreground mb-8 max-w-md">
                    {artigoSingular} {entityName.toLowerCase()} que procura não existe ou foi removid{entityGender === "feminino" ? "a" : "o"}.
                </p>
                <Button asChild>
                    <Link href={listHref}>
                        Ver {artigoPlural} {plural.toLowerCase()}
                    </Link>
                </Button>
            </div>
        </div>
    )
}
