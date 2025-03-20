import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

export default function CatalogPage() {
    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6">Catálogo de Livros</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Catálogo de Livros</CardTitle>
                        <CardDescription>Esta página está em desenvolvimento</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <BookOpen className="h-16 w-16 text-primary" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

