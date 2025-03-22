"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateBorrowedBookModal } from "./create-borrowed-book-modal"

export function CreateBorrowedBookButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Registar Empréstimo
            </Button>
            <CreateBorrowedBookModal open={open} onOpenChange={setOpen} />
        </>
    )
}

