"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-toastify"
import type { Record, CreateRecordInput, UpdateRecordInput } from "@/lib/records"
import {
    createRecordAction,
    updateRecordAction,
    getTemplatesAction,
    getFieldDefinitionsAction,
} from "@/app/records/actions"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Minus, X, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Interfaces que correspondem exatamente ao modelo Prisma
interface SubfieldDefinition {
    id: string
    code: string
    label: string
    repeatable?: boolean
    mandatory?: boolean
    tips?: string[]
}

interface DataFieldDefinition {
    id: string
    tag: string
    name: string
    tips: string[]
    subFieldDef?: SubfieldDefinition[]
    [key: string]: any // Para outras propriedades
}

const formSchema = z.object({
    templateId: z.string().optional(),
    controlFields: z.array(
        z.object({
            id: z.string().optional(),
            definitionId: z.string(),
            value: z.string(),
        }),
    ),
    dataFields: z.array(
        z.object({
            id: z.string().optional(),
            definitionId: z.string(),
            ind1: z.string().default(""),
            ind2: z.string().default(""),
            subFields: z.array(
                z.object({
                    id: z.string().optional(),
                    code: z.string(),
                    value: z.string(),
                }),
            ),
        }),
    ),
})

type FormValues = z.infer<typeof formSchema>

interface RecordModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    record?: Record | null
    mode: "create" | "edit"
    onSuccess?: () => void
}

// Componente para o tooltip paginado
interface PaginatedTooltipProps {
    tips: string[]
    children: React.ReactNode
}

// Modifique o componente PaginatedTooltip para garantir que o tooltip seja renderizado fora dos limites do modal

function PaginatedTooltip({ tips, children }: PaginatedTooltipProps) {
    const [currentTipIndex, setCurrentTipIndex] = useState(0)

    const nextTip = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentTipIndex((prev) => (prev + 1) % tips.length)
    }

    const prevTip = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length)
    }

    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side="right" align="start" className="w-80 p-0" sideOffset={5}>
                    <div className="p-4">
                        <p className="text-sm">{tips[currentTipIndex]}</p>
                    </div>
                    {tips.length > 1 && (
                        <div className="flex items-center justify-between border-t p-2 bg-muted/50">
                            <div className="text-xs text-muted-foreground">
                                {currentTipIndex + 1} de {tips.length}
                            </div>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={prevTip} disabled={tips.length <= 1}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={nextTip} disabled={tips.length <= 1}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default function RecordModal({
    open,
    onOpenChange,
    record = null,
    mode = "create",
    onSuccess,
}: RecordModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [templates, setTemplates] = useState<any[]>([])
    const [controlFieldDefinitions, setControlFieldDefinitions] = useState<any[]>([])
    const [dataFieldDefinitions, setDataFieldDefinitions] = useState<DataFieldDefinition[]>([])
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("general")
    const [newSubFieldCode, setNewSubFieldCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const isEditMode = mode === "edit"

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            templateId: "",
            controlFields: [],
            dataFields: [],
        },
    })

    useEffect(() => {
        if (open) {
            const loadData = async () => {
                try {
                    setIsLoading(true)
                    const [templatesData, fieldDefinitionsData] = await Promise.all([
                        getTemplatesAction(),
                        getFieldDefinitionsAction(),
                    ])

                    setTemplates(templatesData)
                    setControlFieldDefinitions(fieldDefinitionsData.controlFieldDefinitions)

                    // Log para verificar a estrutura exata dos dados recebidos
                    console.log("Dados de definições de campos recebidos:", fieldDefinitionsData)

                    // Verificar se os subcampos estão sendo incluídos na consulta
                    if (fieldDefinitionsData.dataFieldDefinitions && fieldDefinitionsData.dataFieldDefinitions.length > 0) {
                        const sampleField = fieldDefinitionsData.dataFieldDefinitions[0]
                        console.log("Exemplo de campo:", sampleField.name || sampleField.tag)
                        console.log("Propriedades do campo:", Object.keys(sampleField))

                        // Verificar especificamente a propriedade subFieldDef
                        if (sampleField.subFieldDef) {
                            console.log("subFieldDef está presente com", sampleField.subFieldDef.length, "subcampos")
                            console.log("Exemplo de subcampo:", sampleField.subFieldDef[0])
                        } else {
                            console.error("ALERTA: subFieldDef não está presente no objeto. Verifique a consulta no backend!")
                            console.log("Dados completos do campo:", JSON.stringify(sampleField, null, 2))
                        }
                    }

                    setDataFieldDefinitions(fieldDefinitionsData.dataFieldDefinitions)
                } catch (error) {
                    console.error("Erro ao carregar dados:", error)
                    toast.error("Erro ao carregar dados necessários")
                } finally {
                    setIsLoading(false)
                }
            }

            loadData()
        }
    }, [open])

    useEffect(() => {
        if (isEditMode && record && open) {
            const controlFields = record.controlFields.map((cf) => ({
                id: cf.id,
                definitionId: cf.definition.id,
                value: cf.value,
            }))

            const dataFields = record.dataFields.map((df) => ({
                id: df.id,
                definitionId: df.definition.id,
                ind1: df.ind1,
                ind2: df.ind2,
                subFields: df.subFields.map((sf) => ({
                    id: sf.id,
                    code: sf.code,
                    value: sf.value,
                })),
            }))

            form.reset({
                controlFields,
                dataFields,
            })
        } else if (!isEditMode && open) {
            form.reset({
                templateId: "",
                controlFields: [],
                dataFields: [],
            })
            setSelectedTemplateId(null)
        }
    }, [form, record, isEditMode, open])

    const handleTemplateChange = async (templateId: string) => {
        setSelectedTemplateId(templateId)

        try {
            const selectedTemplate = templates.find((t) => t.id === templateId)

            if (selectedTemplate) {
                const controlFields = selectedTemplate.controlFields.map((cf: any) => ({
                    definitionId: cf.definition.id,
                    value: "",
                }))

                const dataFields = selectedTemplate.dataFields.map((df: any) => {
                    // Verificar onde estão os subcampos no template
                    const subFieldDefs = df.definition.subFieldDef || []
                    console.log(`Template: Campo ${df.definition.tag} tem ${subFieldDefs.length} subcampos`)

                    return {
                        definitionId: df.definition.id,
                        ind1: df.defaultInd1 || "",
                        ind2: df.defaultInd2 || "",
                        subFields: subFieldDefs.map((subDef: any) => ({
                            code: subDef.code,
                            value: "",
                        })),
                    }
                })

                form.setValue("controlFields", controlFields)
                form.setValue("dataFields", dataFields)
            }
        } catch (error) {
            console.error("Erro ao carregar template:", error)
            toast.error("Erro ao carregar campos do template")
        }
    }

    const addControlField = () => {
        const currentFields = form.getValues("controlFields")
        form.setValue("controlFields", [...currentFields, { definitionId: "", value: "" }])
    }

    const removeControlField = (index: number) => {
        const currentFields = form.getValues("controlFields")
        form.setValue(
            "controlFields",
            currentFields.filter((_, i) => i !== index),
        )
    }

    const addDataField = () => {
        const currentFields = form.getValues("dataFields")

        form.setValue("dataFields", [
            ...currentFields,
            {
                definitionId: "",
                ind1: "",
                ind2: "",
                subFields: [{ code: "a", value: "" }],
            },
        ])
    }

    const removeDataField = (index: number) => {
        const currentFields = form.getValues("dataFields")
        form.setValue(
            "dataFields",
            currentFields.filter((_, i) => i !== index),
        )
    }

    const addSubField = (dataFieldIndex: number) => {
        if (!newSubFieldCode) {
            toast.error("Selecione um subcampo para adicionar")
            return
        }

        const availableSubFields = getAvailableSubFields(dataFieldIndex)
        if (availableSubFields.length === 0) {
            toast.error("Não há subcampos disponíveis para adicionar")
            return
        }

        const currentDataFields = form.getValues("dataFields")
        const updatedDataFields = [...currentDataFields]

        updatedDataFields[dataFieldIndex] = {
            ...currentDataFields[dataFieldIndex],
            subFields: [
                ...(currentDataFields[dataFieldIndex].subFields || []),
                {
                    code: newSubFieldCode,
                    value: "",
                    id: "", // Adicione um ID vazio para novos subcampos
                },
            ],
        }

        form.setValue("dataFields", updatedDataFields)
        setNewSubFieldCode("") // Resetar a seleção após adicionar
    }

    const removeSubField = (dataFieldIndex: number, subFieldIndex: number) => {
        const currentDataFields = form.getValues("dataFields")
        const currentSubFields = currentDataFields[dataFieldIndex].subFields

        if (currentSubFields.length <= 1) {
            toast.warning("É necessário pelo menos um subcampo")
            return
        }

        const updatedDataFields = [...currentDataFields]
        updatedDataFields[dataFieldIndex] = {
            ...currentDataFields[dataFieldIndex],
            subFields: currentSubFields.filter((_, i) => i !== subFieldIndex),
        }

        form.setValue("dataFields", updatedDataFields)
    }

    // Função simplificada que foca apenas na propriedade subFieldDef
    const getAvailableSubFields = (dataFieldIndex: number) => {
        // Obter o ID da definição do campo de dados atual
        const definitionId = form.getValues(`dataFields.${dataFieldIndex}.definitionId`)

        if (!definitionId) {
            console.log("Nenhum campo selecionado para o índice", dataFieldIndex)
            return []
        }

        // Encontrar a definição do campo
        const fieldDef = dataFieldDefinitions.find((def) => def.id === definitionId)

        if (!fieldDef) {
            console.log("Definição de campo não encontrada para ID:", definitionId)
            return []
        }

        console.log("Campo selecionado:", fieldDef.tag, fieldDef.name)

        // Verificar se subFieldDef existe e é um array
        if (!fieldDef.subFieldDef || !Array.isArray(fieldDef.subFieldDef) || fieldDef.subFieldDef.length === 0) {
            console.error(`Nenhuma definição de subcampo encontrada para o campo: ${fieldDef.name}`)
            console.log("Dados completos do campo:", JSON.stringify(fieldDef, null, 2))

            // Verificar se a consulta está incluindo os subcampos
            console.log(
                "IMPORTANTE: Verifique se a função getFieldDefinitionsAction() está incluindo os subcampos na consulta!",
            )
            console.log("Exemplo de consulta Prisma necessária: { include: { subFieldDef: true } }")

            return []
        }

        // Obter subcampos já adicionados
        const currentSubFields = form.getValues(`dataFields.${dataFieldIndex}.subFields`) || []
        const usedCodes = currentSubFields.map((sf) => sf.code)

        console.log("Subcampos já utilizados:", usedCodes)

        // Filtrar subcampos disponíveis (que ainda não foram adicionados)
        const availableSubFields = fieldDef.subFieldDef.filter((subDef) => !usedCodes.includes(subDef.code))

        console.log("Total de subcampos definidos:", fieldDef.subFieldDef.length)
        console.log("Subcampos disponíveis:", availableSubFields.length)

        return availableSubFields
    }

    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            // Se um campo de definição de dados foi alterado, limpe o código de subcampo selecionado
            if (name && name.includes("definitionId")) {
                setNewSubFieldCode("")
            }
        })

        return () => subscription.unsubscribe()
    }, [form])

    // Modifique também a função onSubmit para evitar submissões automáticas
    const onSubmit = async (values: FormValues) => {
        try {
            setIsSubmitting(true)
            console.log("Formulário submetido manualmente", values)

            if (isEditMode && record) {
                const updateData: UpdateRecordInput = {
                    id: record.id,
                    metadata: record.metadata,
                    controlFields: values.controlFields,
                    dataFields: values.dataFields,
                }

                await updateRecordAction(updateData)
                toast.success("Registro atualizado com sucesso")
            } else {
                const createData: CreateRecordInput = {
                    metadata: {},
                    templateId: values.templateId || null,
                    controlFields: values.controlFields,
                    dataFields: values.dataFields,
                }

                await createRecordAction(createData)
                toast.success("Registro criado com sucesso")
            }

            if (onSuccess) onSuccess()
            onOpenChange(false)
            form.reset()
        } catch (error) {
            console.error("Erro ao processar registro:", error)
            toast.error(error instanceof Error ? error.message : "Erro ao processar registro")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Substitua a função renderTips para usar o componente PaginatedTooltip
    const renderTips = (tips: string[] | undefined) => {
        if (!tips || tips.length === 0) return null

        return (
            <PaginatedTooltip tips={tips}>
                <span className="inline-flex h-5 w-5 ml-1 items-center justify-center cursor-help">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </span>
            </PaginatedTooltip>
        )
    }

    // Substitua a função renderSubfieldTips para usar o componente PaginatedTooltip
    const renderSubfieldTips = (dataFieldIndex: number, code: string) => {
        const definitionId = form.getValues(`dataFields.${dataFieldIndex}.definitionId`)
        const fieldDef = dataFieldDefinitions.find((def) => def.id === definitionId)

        if (!fieldDef || !fieldDef.subFieldDef) return null

        const subFieldDef = fieldDef.subFieldDef.find((sf) => sf.code === code)

        if (!subFieldDef || !subFieldDef.tips || subFieldDef.tips.length === 0) return null

        return (
            <PaginatedTooltip tips={subFieldDef.tips}>
                <span className="inline-flex h-5 w-5 ml-1 items-center justify-center cursor-help">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </span>
            </PaginatedTooltip>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <style jsx global>{`
          .radix-tooltip-content {
            z-index: 1000;
          }
        `}</style>
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Editar Registro" : "Criar Novo Registro"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Atualize os dados do registro bibliográfico"
                            : "Preencha os dados para criar um novo registro bibliográfico"}
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <span className="ml-2">Carregando definições de campos...</span>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="grid grid-cols-4 mb-4">
                                    <TabsTrigger value="general">Geral</TabsTrigger>
                                    <TabsTrigger value="control">Campos de Controle</TabsTrigger>
                                    <TabsTrigger value="data">Campos de Dados</TabsTrigger>
                                    <TabsTrigger value="unimarc">UNIMARC</TabsTrigger>
                                </TabsList>

                                <TabsContent value="general" className="space-y-4">
                                    {!isEditMode && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Template</CardTitle>
                                                <CardDescription>Selecione um template para pré-preencher os campos</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <FormField
                                                    control={form.control}
                                                    name="templateId"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Template</FormLabel>
                                                            <Select
                                                                onValueChange={(value) => {
                                                                    field.onChange(value)
                                                                    handleTemplateChange(value)
                                                                }}
                                                                value={field.value}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Selecione um template" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {templates.map((template) => (
                                                                        <SelectItem key={template.id} value={template.id}>
                                                                            {template.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </CardContent>
                                        </Card>
                                    )}
                                </TabsContent>

                                <TabsContent value="control" className="space-y-4">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <div>
                                                <CardTitle>Campos de Controle</CardTitle>
                                                <CardDescription>Campos de controle do registro bibliográfico</CardDescription>
                                            </div>
                                            <Button type="button" variant="outline" size="sm" onClick={addControlField}>
                                                <Plus className="h-4 w-4 mr-1" /> Adicionar Campo
                                            </Button>
                                        </CardHeader>
                                        <CardContent>
                                            {form.watch("controlFields").length === 0 ? (
                                                <div className="text-center py-4 text-muted-foreground">
                                                    Nenhum campo de controle adicionado
                                                </div>
                                            ) : (
                                                form.watch("controlFields").map((_, index) => {
                                                    // Obter a definição do campo de controle para acessar as dicas
                                                    const controlFieldDef = controlFieldDefinitions.find(
                                                        (def) => def.id === form.getValues(`controlFields.${index}.definitionId`),
                                                    )

                                                    return (
                                                        <div key={index} className="flex items-start space-x-2 mb-4 p-3 border rounded-md">
                                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`controlFields.${index}.definitionId`}
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <div className="flex items-center">
                                                                                <FormLabel>Campo</FormLabel>
                                                                                {controlFieldDef &&
                                                                                    controlFieldDef.tips &&
                                                                                    controlFieldDef.tips.length > 0 &&
                                                                                    renderTips(controlFieldDef.tips)}
                                                                            </div>
                                                                            <Select onValueChange={field.onChange} value={field.value} disabled={isEditMode}>
                                                                                <FormControl>
                                                                                    <SelectTrigger>
                                                                                        <SelectValue placeholder="Selecione um campo" />
                                                                                    </SelectTrigger>
                                                                                </FormControl>
                                                                                <SelectContent>
                                                                                    {controlFieldDefinitions.map((def) => (
                                                                                        <SelectItem key={def.id} value={def.id}>
                                                                                            {def.tag} - {def.name}
                                                                                        </SelectItem>
                                                                                    ))}
                                                                                </SelectContent>
                                                                            </Select>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />

                                                                <FormField
                                                                    control={form.control}
                                                                    name={`controlFields.${index}.value`}
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Valor</FormLabel>
                                                                            <FormControl>
                                                                                <Input {...field} />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>

                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => removeControlField(index)}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="data" className="space-y-4">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <div>
                                                <CardTitle>Campos de Dados</CardTitle>
                                                <CardDescription>Campos de dados do registro bibliográfico</CardDescription>
                                            </div>
                                            <Button type="button" variant="outline" size="sm" onClick={addDataField}>
                                                <Plus className="h-4 w-4 mr-1" /> Adicionar Campo
                                            </Button>
                                        </CardHeader>
                                        <CardContent>
                                            {form.watch("dataFields").length === 0 ? (
                                                <div className="text-center py-4 text-muted-foreground">Nenhum campo de dados adicionado</div>
                                            ) : (
                                                <Accordion type="multiple" className="space-y-4">
                                                    {form.watch("dataFields").map((_, dataFieldIndex) => {
                                                        const fieldDef = dataFieldDefinitions.find(
                                                            (def) => def.id === form.getValues(`dataFields.${dataFieldIndex}.definitionId`),
                                                        )

                                                        return (
                                                            <AccordionItem
                                                                key={dataFieldIndex}
                                                                value={`item-${dataFieldIndex}`}
                                                                className="border rounded-md"
                                                            >
                                                                <div className="flex items-center justify-between px-4">
                                                                    <div className="flex items-center flex-1">
                                                                        <AccordionTrigger className="flex-1">
                                                                            <span>
                                                                                Campo {dataFieldIndex + 1}:&nbsp;
                                                                                {fieldDef?.name || "Campo não selecionado"}
                                                                            </span>
                                                                        </AccordionTrigger>
                                                                        {fieldDef && fieldDef.tips && fieldDef.tips.length > 0 && renderTips(fieldDef.tips)}
                                                                    </div>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation() // Impedir propagação para evitar que o acordeão abra/feche
                                                                            removeDataField(dataFieldIndex)
                                                                        }}
                                                                        className="h-8 w-8"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                                <AccordionContent className="px-4 pb-4">
                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`dataFields.${dataFieldIndex}.definitionId`}
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>Campo</FormLabel>
                                                                                    <Select
                                                                                        onValueChange={field.onChange}
                                                                                        value={field.value}
                                                                                        disabled={isEditMode}
                                                                                    >
                                                                                        <FormControl>
                                                                                            <SelectTrigger>
                                                                                                <SelectValue placeholder="Selecione um campo" />
                                                                                            </SelectTrigger>
                                                                                        </FormControl>
                                                                                        <SelectContent>
                                                                                            {dataFieldDefinitions.map((def) => (
                                                                                                <SelectItem key={def.id} value={def.id}>
                                                                                                    {def.tag} - {def.name}
                                                                                                </SelectItem>
                                                                                            ))}
                                                                                        </SelectContent>
                                                                                    </Select>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />

                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`dataFields.${dataFieldIndex}.ind1`}
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>Indicador 1</FormLabel>
                                                                                    <FormControl>
                                                                                        <Input {...field} maxLength={1} />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />

                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`dataFields.${dataFieldIndex}.ind2`}
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>Indicador 2</FormLabel>
                                                                                    <FormControl>
                                                                                        <Input {...field} maxLength={1} />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <div className="flex items-center justify-between">
                                                                            <h4 className="text-sm font-medium">Subcampos</h4>
                                                                            <div className="flex gap-2">
                                                                                <Select
                                                                                    value={newSubFieldCode}
                                                                                    onValueChange={setNewSubFieldCode}
                                                                                    disabled={!form.getValues(`dataFields.${dataFieldIndex}.definitionId`)}
                                                                                >
                                                                                    <SelectTrigger className="w-[180px]">
                                                                                        <SelectValue
                                                                                            placeholder={
                                                                                                !form.getValues(`dataFields.${dataFieldIndex}.definitionId`)
                                                                                                    ? "Selecione um campo primeiro"
                                                                                                    : getAvailableSubFields(dataFieldIndex).length
                                                                                                        ? "Selecione subcampo"
                                                                                                        : "Nenhum subcampo disponível"
                                                                                            }
                                                                                        />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        {!form.getValues(`dataFields.${dataFieldIndex}.definitionId`) ? (
                                                                                            <div className="px-2 py-1 text-sm text-muted-foreground">
                                                                                                Selecione um campo primeiro
                                                                                            </div>
                                                                                        ) : getAvailableSubFields(dataFieldIndex).length > 0 ? (
                                                                                            getAvailableSubFields(dataFieldIndex).map((subDef) => (
                                                                                                <SelectItem key={subDef.id} value={subDef.code}>
                                                                                                    {subDef.label || `Subcampo ${subDef.code}`} (${subDef.code})
                                                                                                </SelectItem>
                                                                                            ))
                                                                                        ) : (
                                                                                            <div className="px-2 py-1 text-sm text-muted-foreground">
                                                                                                Nenhum subcampo disponível
                                                                                            </div>
                                                                                        )}
                                                                                    </SelectContent>
                                                                                </Select>
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() => addSubField(dataFieldIndex)}
                                                                                    disabled={!newSubFieldCode}
                                                                                >
                                                                                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                                                                                </Button>
                                                                            </div>
                                                                        </div>

                                                                        {form
                                                                            .getValues(`dataFields.${dataFieldIndex}.subFields`)
                                                                            .map((subField, subFieldIndex) => {
                                                                                const subFieldDef = fieldDef?.subFieldDef?.find((d) => d.code === subField.code)

                                                                                return (
                                                                                    <div key={subFieldIndex} className="flex items-center space-x-2">
                                                                                        <div className="w-48 flex items-center">
                                                                                            <span className="text-sm font-medium">
                                                                                                {subFieldDef?.label || `Subcampo ${subField.code}`}
                                                                                            </span>
                                                                                            <span className="text-xs text-muted-foreground ml-1">
                                                                                                (${subField.code})
                                                                                            </span>
                                                                                            {renderSubfieldTips(dataFieldIndex, subField.code)}
                                                                                        </div>

                                                                                        <FormField
                                                                                            control={form.control}
                                                                                            name={`dataFields.${dataFieldIndex}.subFields.${subFieldIndex}.value`}
                                                                                            render={({ field }) => (
                                                                                                <FormItem className="flex-1">
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            {...field}
                                                                                                            placeholder={`Valor para ${subFieldDef?.label || subField.code}`}
                                                                                                        />
                                                                                                    </FormControl>
                                                                                                    <FormMessage />
                                                                                                </FormItem>
                                                                                            )}
                                                                                        />

                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="ghost"
                                                                                            size="icon"
                                                                                            onClick={() => removeSubField(dataFieldIndex, subFieldIndex)}
                                                                                        >
                                                                                            <Minus className="h-4 w-4" />
                                                                                        </Button>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                    </div>
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        )
                                                    })}
                                                </Accordion>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="unimarc" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Visualização UNIMARC</CardTitle>
                                            <CardDescription>Representação do registro no formato UNIMARC (somente leitura)</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {isEditMode && record?.metadata ? (
                                                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-sm">
                                                    {JSON.stringify(record.metadata, null, 2)}
                                                </pre>
                                            ) : (
                                                <div className="text-center py-4 text-muted-foreground">
                                                    O metadata UNIMARC será gerado após salvar o registro
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Salvando..." : "Salvar"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    )
}
