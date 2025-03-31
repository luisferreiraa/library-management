"use client"

import type { ReactNode } from "react"
import type { Path } from "react-hook-form"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { useEntityForm } from "@/hooks/use-entity-form"
import { Switch } from "./switch"

// Tipos de campos suportados
type FieldType = "text" | "email" | "number" | "password" | "textarea" | "select" | "switch"

// Interface para opções de select
interface SelectOption {
    value: string
    label: string
}

// Interface para definição de campos
interface FieldConfig<T> {
    name: keyof T
    label: string
    type?: FieldType
    placeholder?: string
    options?: SelectOption[] // Para campos do tipo select
    required?: boolean
    labelClass?: string // Classe para a label
    switchClass?: string // Classe para o switch
}

// Modifique a definição da interface EntityModalProps para adicionar a restrição ao tipo T
interface EntityModalProps<T extends Record<string, any>, E = any> {
    open: boolean
    onOpenChange: (open: boolean) => void
    entity?: E | null
    entityName: string
    formConfig: ReturnType<typeof useEntityForm<T, any>>
    fields: FieldConfig<T>[]
    description?: string
    maxWidth?: string
    children?: ReactNode
}

export function EntityModal<T extends Record<string, any>, E = any>({
    open,
    onOpenChange,
    entity,
    entityName,
    formConfig,
    fields,
    description,
    maxWidth = "sm:max-w-[425px]",
    children,
}: EntityModalProps<T, E>) {
    const { form, isSubmitting, error, handleSubmit, handleClose, isDirty } = formConfig

    // Função para fechar o modal
    const onClose = () => {
        handleClose()
        onOpenChange(false)
    }

    // Confirmar antes de fechar se houver mudanças não salvas
    const handleOpenChange = (open: boolean) => {
        if (!open && isDirty) {
            if (window.confirm("Há mudanças não salvas. Deseja realmente fechar?")) {
                onClose()
            }
        } else if (!open) {
            onClose()
        } else {
            onOpenChange(true)
        }
    }

    // Renderizar o campo apropriado com base no tipo
    const renderField = (field: FieldConfig<T>) => {
        return (
            <FormField
                key={String(field.name)}
                control={form.control}
                name={field.name as unknown as Path<T>}
                render={({ field: formField, fieldState }) => (
                    <FormItem>
                        {/* Se o campo não for um switch, renderiza a label normalmente */}
                        {field.type !== "switch" && (
                            <FormLabel className={field.labelClass}>
                                {field.label}
                                {field.required && <span className="text-destructive ml-1">*</span>}
                            </FormLabel>
                        )}

                        <FormControl>
                            {field.type === "textarea" ? (
                                <Textarea {...formField} placeholder={field.placeholder} className="resize-none" rows={4} />
                            ) : field.type === "select" && field.options ? (
                                <Select
                                    value={formField.value as string}
                                    onValueChange={formField.onChange}
                                    disabled={formField.disabled}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={field.placeholder || `Selecione ${field.label.toLowerCase()}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : field.type === "switch" ? (
                                // Alinhamento correto do switch e label à direita
                                <div className="flex justify-end items-center w-full">
                                    <FormLabel className="text-gray-800 dark:text-white mr-3">
                                        {field.label}
                                    </FormLabel>
                                    <Switch
                                        checked={formField.value}
                                        onCheckedChange={formField.onChange}
                                        disabled={formField.disabled}
                                        className={field.switchClass}
                                    />
                                </div>
                            ) : (
                                <Input {...formField} type={field.type || "text"} placeholder={field.placeholder} />
                            )}
                        </FormControl>

                        {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                    </FormItem>
                )}
            />
        )
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className={maxWidth}>
                <DialogTitle>{entity ? `Editar ${entityName}` : `Criar ${entityName}`}</DialogTitle>
                {description && <DialogDescription>{description}</DialogDescription>}

                {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {fields.map(renderField)}

                        {/* Slot para conteúdo adicional */}
                        {children}

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Salvando..." : entity ? "Atualizar" : "Criar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}


