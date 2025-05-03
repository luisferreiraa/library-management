"use client"

import { getControlFieldDefinitions, getDataFieldDefinitions } from "@/lib/field-definitions"
import { zodResolver } from "@hookform/resolvers/zod"
import { Template } from "@/lib/templates"
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"
import { createTemplateAction, getControlFieldDefinitionsAction, getDataFieldDefinitionsAction, updateTemplateAction } from "@/app/record-templates/actions"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { X } from "lucide-react"

const formSchema = z.object({
    name: z.string().min(1, { message: "Nome do template é obrigatório" }),
    description: z.string().optional(),
    controlFieldDefinitionIds: z.array(z.string()).min(1, { message: "Selecione pelo menos um campo de controlo" }),
    dataFieldDefinitionIds: z.array(z.string()).min(1, { message: "Selecione pelo menos um campo de dados" })
})

type TemplateFormValues = z.infer<typeof formSchema>

interface CreateTemplateModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    template?: Template | null
    mode?: "create" | "edit"
    onSuccess?: () => void
}

export default function CreateTemplateModal({
    open,
    onOpenChange,
    template = null,
    mode = "create",
    onSuccess
}: CreateTemplateModalProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const isEditMode = mode === "edit"

    // Estado para dados relacionados
    const [controlFieldDefinitions, setControlFieldDefinitions] = useState<{ id: string; name: string }[]>([])
    const [dataFieldDefinitions, setDataFieldDefinitions] = useState<{ id: string; name: string }[]>([])

    // Estado para o comando de control e data field definitions
    const [commandOpen, setCommandOpen] = useState(false)
    const [selectedControlFields, setSelectedControlFields] = useState<{ id: string; name: string }[]>([])
    const [selectedDataFields, setSelectedDataFields] = useState<{ id: string; name: string }[]>([])

    const form = useForm<TemplateFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            controlFieldDefinitionIds: [],
            dataFieldDefinitionIds: [],
        }
    })

    // Carregar dados relacionados quando o modal abrir
    useEffect(() => {
        if (open) {
            const loadRelatedData = async () => {
                try {
                    const [controlData, dataData] = await Promise.all([
                        getControlFieldDefinitionsAction(),
                        getDataFieldDefinitionsAction(),
                    ])

                    setControlFieldDefinitions(controlData)
                    setDataFieldDefinitions(dataData)
                } catch (error) {
                    console.error("Erro ao carregar campos:", error)
                    toast.error("Erro ao carregar campos", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    })
                }
            }
            loadRelatedData()
        }
    }, [open])

    // Preencher o formulário quando estiver no modo de edição e o template for fornecido
    useEffect(() => {
        if (isEditMode && template && open) {
            const templateControlFields = template.controlFields?.map((cf) => ({
                id: cf.id,
                name: cf.definition.name
            })) || []

            const templateDataFields = template.dataFields?.map((df) => ({
                id: df.id,
                name: df.definition.name
            })) || []

            setSelectedControlFields(templateControlFields)
            setSelectedDataFields(templateDataFields)

            // Preencher o formulário com dados do template
            form.reset({
                name: template.name,
                description: template.description || "",
                controlFieldDefinitionIds: templateControlFields.map((cf) => cf.id),
                dataFieldDefinitionIds: templateDataFields.map((df) => df.id)
            })
        } else if (!isEditMode && open) {
            form.reset({
                name: "",
                description: "",
                controlFieldDefinitionIds: [],
                dataFieldDefinitionIds: [],
            })
            setSelectedControlFields([])
            setSelectedDataFields([])
        }
    }, [form, template, isEditMode, open])

    // Função para adicionar um Control Field
    const addControlField = (controlField: { id: string, name: string }) => {
        if (!selectedControlFields.some((cf) => cf.id === controlField.id)) {
            const newSelectedControlFields = [...selectedControlFields, controlField]
            setSelectedControlFields(newSelectedControlFields)
            form.setValue(
                "controlFieldDefinitionIds",
                newSelectedControlFields.map((cf) => cf.id),
                { shouldValidate: true }
            )
        }
    }

    // Função para remover um Control Field
    const removeControlField = (controlFieldId: string) => {
        const newSelectedControlFields = selectedControlFields.filter((cf) => cf.id !== controlFieldId)
        setSelectedControlFields(newSelectedControlFields)
        form.setValue(
            "controlFieldDefinitionIds",
            newSelectedControlFields.map((cf) => cf.id),
            { shouldValidate: true }
        )
    }

    // Função para adicionar um Data Field
    const addDataField = (dataField: { id: string, name: string }) => {
        if (!selectedDataFields.some((df) => df.id === dataField.id)) {
            const newSelectedDataFields = [...selectedDataFields, dataField]
            setSelectedDataFields(newSelectedDataFields)
            form.setValue(
                "dataFieldDefinitionIds",
                newSelectedDataFields.map((df) => df.id),
                { shouldValidate: true }
            )
        }
    }

    // Função para remover um Data Field
    const removeDataField = (dataFieldId: string) => {
        const newSelectedDataFields = selectedDataFields.filter((df) => df.id !== dataFieldId)
        setSelectedDataFields(newSelectedDataFields)
        form.setValue(
            "dataFieldDefinitionIds",
            newSelectedDataFields.map((df) => df.id),
            { shouldValidate: true }
        )
    }

    function onSubmit(values: TemplateFormValues) {
        startTransition(async () => {
            setError(null)
            try {
                setIsSubmitting(true)

                if (isEditMode && template) {
                    const updateData = {
                        id: template.id,
                        ...values
                    }

                    await updateTemplateAction(updateData)
                    toast.success("Template atualizado com sucesso", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    })
                } else {
                    await createTemplateAction(values)
                    toast.success("Template criado com sucesso", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    })
                }

                if (onSuccess) onSuccess()
                onOpenChange(false)
                form.reset()
            } catch (error: any) {
                console.error("Erro ao processar template:", error)
                setError(error.message || `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} o template`)
                toast.error(`Erro ao ${isEditMode ? "atualizar" : "adicionar"} template`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
            } finally {
                setIsSubmitting(false)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Editar Template" : "Criar Novo Template"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Atualize os dados do template"
                            : "Preencha os dados do novo template"}
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nome do Template" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descrição</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Descrição do Template" rows={4} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="controlFieldDefinitionIds"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Campos de Controlo</FormLabel>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className="w-full justify-between"
                                                            >
                                                                Selecionar Campos de Controlo
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-full p-0">
                                                            <Command>
                                                                <CommandInput placeholder="Buscar campo..." />
                                                                <CommandEmpty>Nenhum campo encontrado</CommandEmpty>
                                                                <CommandGroup>
                                                                    <CommandList>
                                                                        {controlFieldDefinitions.map((field) => (
                                                                            <CommandItem
                                                                                key={field.id}
                                                                                onSelect={() => addControlField(field)}
                                                                            >
                                                                                {field.name}
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandList>
                                                                </CommandGroup>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>

                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedControlFields.length === 0 ? (
                                                            <span className="text-sm text-muted-foreground">
                                                                Nenhum campo selecionado
                                                            </span>
                                                        ) : (
                                                            selectedControlFields.map((field) => (
                                                                <Badge key={field.id} variant="secondary" className="flex items-center gap-1">
                                                                    {field.name}
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-4 w-4 p-0 ml-1"
                                                                        onClick={() => removeControlField(field.id)}
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </Button>
                                                                </Badge>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dataFieldDefinitionIds"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Campos de Dados</FormLabel>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className="w-full justify-between"
                                                            >
                                                                Selecionar Campos de Dados
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-full p-0">
                                                            <Command>
                                                                <CommandInput placeholder="Buscar campo..." />
                                                                <CommandEmpty>Nenhum campo encontrado</CommandEmpty>
                                                                <CommandGroup>
                                                                    <CommandList>
                                                                        {dataFieldDefinitions.map((field) => (
                                                                            <CommandItem
                                                                                key={field.id}
                                                                                onSelect={() => addDataField(field)}
                                                                            >
                                                                                {field.name}
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandList>
                                                                </CommandGroup>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>

                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedDataFields.length === 0 ? (
                                                            <span className="text-sm text-muted-foreground">
                                                                Nenhum campo selecionado
                                                            </span>
                                                        ) : (
                                                            selectedDataFields.map((field) => (
                                                                <Badge key={field.id} variant="secondary" className="flex items-center gap-1">
                                                                    {field.name}
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-4 w-4 p-0 ml-1"
                                                                        onClick={() => removeDataField(field.id)}
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </Button>
                                                                </Badge>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "A salvar..." : "Salvar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}