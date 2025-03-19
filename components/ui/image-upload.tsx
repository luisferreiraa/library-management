"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X } from "lucide-react"

interface ImageUploadProps {
    value?: string
    onChange: (value: File | null) => void
    onClear?: () => void
    disabled?: boolean
}

export function ImageUpload({ value, onChange, onClear, disabled }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(value || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null

        if (file) {
            // Criar uma URL temporária para preview
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)
            onChange(file)
        }
    }

    const handleClear = () => {
        setPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        onChange(null)
        onClear?.()
    }

    const handleClick = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                disabled={disabled}
            />

            <div className="relative">
                <Avatar
                    className="h-24 w-24 cursor-pointer border-2 border-dashed border-muted-foreground/25 hover:border-primary/50"
                    onClick={handleClick}
                >
                    {preview ? (
                        <AvatarImage src={preview} alt="Preview" />
                    ) : (
                        <AvatarFallback className="bg-muted">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                        </AvatarFallback>
                    )}
                </Avatar>

                {preview && (
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={handleClear}
                        disabled={disabled}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                )}
            </div>

            <Button type="button" variant="outline" size="sm" onClick={handleClick} disabled={disabled}>
                {preview ? "Alterar imagem" : "Carregar imagem"}
            </Button>
        </div>
    )
}

