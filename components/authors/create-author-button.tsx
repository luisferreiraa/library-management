"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateAuthorModal } from "./create-author-modal"

export function CreateAuthorButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Novo Autor
      </Button>
      <CreateAuthorModal open={open} onOpenChange={setOpen} />
    </>
  )
}

