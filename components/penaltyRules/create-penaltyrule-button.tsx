"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PenaltyRuleModal } from "./penalty-rule-modal"

export function CreatePenaltyRuleButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Regra
            </Button>
            <PenaltyRuleModal open={open} onOpenChange={setOpen} />
        </>
    )
}