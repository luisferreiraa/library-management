"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateCatalogItemModal } from "./create-catalog-item-modal"

interface CreateItemButtonProps {
    catalogId: string;
    catalogName: string;
}

export function CreateItemButton({ catalogId, catalogName }: CreateItemButtonProps) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Item
            </Button>
            <CreateCatalogItemModal catalogId={catalogId} catalogName={catalogName} open={open} onOpenChange={setOpen} />
        </>
    )
}