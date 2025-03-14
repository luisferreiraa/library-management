"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreatePublisherModal } from "./create-publisher-modal"

export function CreatePublisherButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Editora
            </Button>
            <CreatePublisherModal open={open} onOpenChange={setOpen} />
        </>
    )
}