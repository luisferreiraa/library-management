"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CatalogModal } from "./catalog-modal"

export function CreateCatalogButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Catálogo
            </Button>
            <CatalogModal open={open} onOpenChange={setOpen} />
        </>
    )
}