"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateUserModal } from "./create-user-modal"

export function CreateUserButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Utilizador
            </Button>
            <CreateUserModal open={open} onOpenChange={setOpen} />
        </>
    )
}

