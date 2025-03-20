"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateBarcodeModal } from "./create-barcode-modal"

export function CreateBarcodeButton({ bookId }: { bookId: string }) {
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <>
            <Button className="mt-2" onClick={() => setModalOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Exemplar
            </Button>
            <CreateBarcodeModal open={modalOpen} onOpenChange={setModalOpen} bookId={bookId} />
        </>
    )
}