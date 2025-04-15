"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LibraryModal } from "./library-modal"

export function CreateLibraryButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Biblioteca
            </Button>
            <LibraryModal open={open} onOpenChange={setOpen} />
        </>
    )
}