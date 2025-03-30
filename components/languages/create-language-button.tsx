"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageModal } from "./language-modal"

export function CreateLanguageButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Idioma
            </Button>
            <LanguageModal open={open} onOpenChange={setOpen} />
        </>
    )
}