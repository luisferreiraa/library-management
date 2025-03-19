"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateBookModal } from "./create-book-modal"

export function CreateBookButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Livro
            </Button>
            <CreateBookModal open={open} onOpenChange={setOpen} />
        </>
    )
}

