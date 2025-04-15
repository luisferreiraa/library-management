"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"     // Para a construção do dropdown
import { Label } from "@/components/ui/label"   // Label para acessibilidade
import { cn } from "@/lib/utils"    // Utilitário para concatenar classes CSS com condicionais

// Define uma interface genérica para as props do component
// O <T extends string> significa que aceita qualquer tipo que seja string 
interface FilterEntitiesProps<T extends string = string> {
    value: T    // value: Valor atual selecionado(controlado)
    onValueChange: (value: T) => void   // Callback quando o valor muda
    options: readonly {     // Indica que o array e os seus objetos são imutáveis
        readonly value: T   // Define a estrutura das opções do dropdown (valor + rótulo)
        readonly label: string
    }[]
    label?: string      // Rótulo do filtro
    placeholder?: string    // Texto do placeholder
    className?: string      // Classes CSS para estilização personalizada
    selectClassName?: string
    labelClassName?: string
}

export function FilterEntities<T extends string>({
    // Desestruturação das props
    value,
    onValueChange,
    options,
    label = "Estado:",      // Valores padrão para label
    placeholder = "Filtrar",    // Valores padrão para placeholder
    className,
    selectClassName,
    labelClassName,
}: FilterEntitiesProps<T>) {    // Tipagem via destructuring
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <Label htmlFor="entity-filter" className={cn("text-sm font-medium", labelClassName)}>
                {label}
            </Label>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger id="entity-filter" className={cn("w-[180px]", selectClassName)}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}