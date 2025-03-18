import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <h1 className="text-4xl font-bold mb-6">Bem-vindo ao Biblio.Gest</h1>
            <p className="text-xl mb-8">Gerencie seus autores e livros de forma simples e eficiente.</p>
            <div className="space-x-4">
                <Button asChild>
                    <Link href="/authors">Ver Autores</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/books">Ver Livros</Link>
                </Button>
            </div>
        </div>
    )
}