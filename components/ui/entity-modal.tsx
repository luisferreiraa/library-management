"use client"

import type { ReactNode } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EntityModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    children: ReactNode
    footer?: ReactNode
    isSubmitting?: boolean
    error?: string | null
    onCancel?: () => void
    maxWidth?: string
}

export function EntityModal({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    isSubmitting = false,
    error = null,
    onCancel,
    maxWidth = "sm:max-w-[425px]",
}: EntityModalProps) {
    const handleCancel = () => {
        if (onCancel) {
            onCancel()
        } else {
            onOpenChange(false)
        }
    }

    const defaultFooter = (
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancelar
            </Button>
            <Button type="submit" form="entity-form" disabled={isSubmitting}>
                {isSubmitting ? "A salvar..." : "Salvar"}
            </Button>
        </div>
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={maxWidth}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {children}

                <DialogFooter>{footer || defaultFooter}</DialogFooter>
            </DialogContent>
        </Dialog>
    )
}