"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import CreateTemplateModal from "@/components/record-templates/create-template-modal"


export function CreateTemplateButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Template
            </Button>
            <CreateTemplateModal open={open} onOpenChange={setOpen} />
        </>
    )
}