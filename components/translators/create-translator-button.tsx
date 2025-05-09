"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TranslatorModal } from "./translator-modal"

export function CreateTranslatorButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Tradutor
            </Button>
            <TranslatorModal open={open} onOpenChange={setOpen} />
        </>
    )
}