"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreatePenaltyRuleModal } from "./create-penaltyrule-modal"

export function CreatePenaltyRuleButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Multa
            </Button>
            <CreatePenaltyRuleModal open={open} onOpenChange={setOpen} />
        </>
    )
}