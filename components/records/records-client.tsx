"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Record } from "@/lib/records"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import RecordsTable from "./records-table"
import RecordModal from "./record-modal"

interface RecordsClientProps {
    initialRecords: Record[]
}

export default function RecordsClient({ initialRecords }: RecordsClientProps) {
    const router = useRouter()
    const [records, setRecords] = useState<Record[]>(initialRecords)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState<Record | null>(null)
    const [modalMode, setModalMode] = useState<"create" | "edit">("create")

    const handleCreateRecord = () => {
        setSelectedRecord(null)
        setModalMode("create")
        setIsModalOpen(true)
    }

    const handleEditRecord = (record: Record) => {
        setSelectedRecord(record)
        setModalMode("edit")
        setIsModalOpen(true)
    }

    const handleModalSuccess = () => {
        router.refresh()
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Lista de Registros</h2>
                <Button onClick={handleCreateRecord}>
                    <Plus className="mr-2 h-4 w-4" /> Novo Registro
                </Button>
            </div>

            <RecordsTable records={records} onEdit={handleEditRecord} />

            <RecordModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                record={selectedRecord}
                mode={modalMode}
                onSuccess={handleModalSuccess}
            />
        </div>
    )
}
