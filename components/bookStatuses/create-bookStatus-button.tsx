"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookStatusModal } from "./book-status-modal"

export function CreateBookStatusButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Estado
            </Button>
            <BookStatusModal open={open} onOpenChange={setOpen} />
        </>
    )
}