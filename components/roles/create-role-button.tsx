"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateRoleModal } from "./create-role-modal"

export function CreateRoleButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Role
            </Button>
            <CreateRoleModal open={open} onOpenChange={setOpen} />
        </>
    )
}