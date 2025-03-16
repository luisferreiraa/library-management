"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateBookStatusModal } from "./create-bookStatus-modal"

export function CreateBookStatusButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Book Status
            </Button>
            <CreateBookStatusModal open={open} onOpenChange={setOpen} />
        </>
    )
}