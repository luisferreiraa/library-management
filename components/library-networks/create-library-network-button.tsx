"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LibraryNetworkModal } from "./library-network-modal"

export function CreateLibraryNetworkButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Rede de Bibliotecas
            </Button>
            <LibraryNetworkModal open={open} onOpenChange={setOpen} />
        </>
    )
}