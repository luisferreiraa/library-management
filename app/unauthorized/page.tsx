import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <div className="mx-auto max-w-md text-center">
                <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
                <h1 className="mt-6 text-3xl font-bold">Acesso Negado</h1>
                <p className="mt-4 text-gray-600">
                    Não tem permissão para aceder a esta página. Esta área é restrita a administradores.
                </p>
                <Button asChild className="mt-6">
                    <Link href="/">Voltar para a página inicial</Link>
                </Button>
            </div>
        </div>
    )
}

