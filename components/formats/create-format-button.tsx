"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormatModal } from "./format-modal"

export function CreateFormatButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Formato
            </Button>
            <FormatModal open={open} onOpenChange={setOpen} />
        </>
    )
}