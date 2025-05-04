import { Suspense } from "react"
import { getRecordsAction } from "./actions"
import RecordsClient from "@/components/records/records-client"

export const metadata = {
    title: "Registros Bibliográficos",
    description: "Gerenciamento de registros bibliográficos",
}

export default async function RecordsPage() {
    const records = await getRecordsAction()

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Registros Bibliográficos</h1>

            <Suspense fallback={<div>Carregando registros...</div>}>
                <RecordsClient initialRecords={records} />
            </Suspense>
        </div>
    )
}
