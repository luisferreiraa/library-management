"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateCategoryModal } from "./create-category-modal"

export function CreateCategoryButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Categoria
            </Button>
            <CreateCategoryModal open={open} onOpenChange={setOpen} />
        </>
    )
}