"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-toastify"
import type { Record, CreateRecordInput, UpdateRecordInput } from "@/lib/records"
import { createRecordAction, updateRecordAction, getTemplatesAction, getFieldDefinitionsAction } from "@/app/records/actions"
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
import { Plus, Minus, X } from "lucide-react"

// Esquema de validação para o formulário
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
    const [dataFieldDefinitions, setDataFieldDefinitions] = useState<any[]>([])
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("general")

    const isEditMode = mode === "edit"

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            templateId: "",
            controlFields: [],
            dataFields: [],
        },
    })

    // Carregar templates e definições de campos
    useEffect(() => {
        if (open) {
            const loadData = async () => {
                try {
                    const [templatesData, fieldDefinitionsData] = await Promise.all([
                        getTemplatesAction(),
                        getFieldDefinitionsAction(),
                    ])

                    setTemplates(templatesData)
                    setControlFieldDefinitions(fieldDefinitionsData.controlFieldDefinitions)
                    setDataFieldDefinitions(fieldDefinitionsData.dataFieldDefinitions)
                } catch (error) {
                    console.error("Erro ao carregar dados:", error)
                    toast.error("Erro ao carregar dados necessários")
                }
            }

            loadData()
        }
    }, [open])

    // Preencher o formulário quando estiver no modo de edição
    useEffect(() => {
        if (isEditMode && record && open) {
            // Mapear campos de controle
            const controlFields = record.controlFields.map((cf) => ({
                id: cf.id,
                definitionId: cf.definition.id,
                value: cf.value,
            }))

            // Mapear campos de dados e subcampos
            const dataFields = record.dataFields.map((df) => ({
                id: df.id,
                definitionId: df.definition.id,
                ind1: df.ind1,
                ind2: df.ind2,
                subFields: df.subFields.map((sf) => ({
                    id: sf.id,
                    value: sf.value,
                })),
            }))

            // Preencher o formulário
            form.reset({
                controlFields,
                dataFields,
            })
        } else if (!isEditMode && open) {
            // Resetar o formulário para criação
            form.reset({
                templateId: "",
                controlFields: [],
                dataFields: [],
            })
            setSelectedTemplateId(null)
        }
    }, [form, record, isEditMode, open])

    // Função para carregar campos do template selecionado
    const handleTemplateChange = async (templateId: string) => {
        setSelectedTemplateId(templateId)

        try {
            // Buscar o template selecionado
            const selectedTemplate = templates.find((t) => t.id === templateId)

            if (selectedTemplate) {
                // Mapear campos de controle do template
                const controlFields = selectedTemplate.controlFields.map((cf: any) => ({
                    definitionId: cf.definition.id,
                    value: "",
                }))

                // Mapear campos de dados do template
                const dataFields = selectedTemplate.dataFields.map((df: any) => ({
                    definitionId: df.definition.id,
                    ind1: df.defaultInd1 || "",
                    ind2: df.defaultInd2 || "",
                    subFields: [{ value: "" }],
                }))

                // Atualizar o formulário com os campos do template
                form.setValue("controlFields", controlFields)
                form.setValue("dataFields", dataFields)
            }
        } catch (error) {
            console.error("Erro ao carregar template:", error)
            toast.error("Erro ao carregar campos do template")
        }
    }

    // Funções para adicionar/remover campos
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
            { definitionId: "", ind1: "", ind2: "", subFields: [{ value: "" }] },
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
        const currentDataFields = form.getValues("dataFields")
        const currentSubFields = currentDataFields[dataFieldIndex].subFields

        const updatedDataFields = [...currentDataFields]
        updatedDataFields[dataFieldIndex] = {
            ...currentDataFields[dataFieldIndex],
            subFields: [...currentSubFields, { value: "" }],
        }

        form.setValue("dataFields", updatedDataFields)
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

    // Função para enviar o formulário
    const onSubmit = async (values: FormValues) => {
        try {
            setIsSubmitting(true)

            if (isEditMode && record) {
                // Atualizar registro existente
                const updateData: UpdateRecordInput = {
                    id: record.id,
                    metadata: record.metadata,
                    controlFields: values.controlFields,
                    dataFields: values.dataFields,
                }

                await updateRecordAction(updateData)
                toast.success("Registro atualizado com sucesso")
            } else {
                // Criar novo registro
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Editar Registro" : "Criar Novo Registro"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Atualize os dados do registro bibliográfico"
                            : "Preencha os dados para criar um novo registro bibliográfico"}
                    </DialogDescription>
                </DialogHeader>

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
                                        {form.getValues("controlFields").length === 0 ? (
                                            <div className="text-center py-4 text-muted-foreground">Nenhum campo de controle adicionado</div>
                                        ) : (
                                            form.getValues("controlFields").map((_, index) => (
                                                <div key={index} className="flex items-start space-x-2 mb-4 p-3 border rounded-md">
                                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name={`controlFields.${index}.definitionId`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Campo</FormLabel>
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

                                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeControlField(index)}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))
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
                                        {form.getValues("dataFields").length === 0 ? (
                                            <div className="text-center py-4 text-muted-foreground">Nenhum campo de dados adicionado</div>
                                        ) : (
                                            <Accordion type="multiple" className="space-y-4">
                                                {form.getValues("dataFields").map((_, dataFieldIndex) => (
                                                    <AccordionItem
                                                        key={dataFieldIndex}
                                                        value={`item-${dataFieldIndex}`}
                                                        className="border rounded-md"
                                                    >
                                                        <div className="flex items-center justify-between px-4">
                                                            <AccordionTrigger className="flex-1">
                                                                <span>
                                                                    Campo {dataFieldIndex + 1}:&nbsp;
                                                                    {dataFieldDefinitions.find(
                                                                        (def) => def.id === form.getValues(`dataFields.${dataFieldIndex}.definitionId`),
                                                                    )?.name || "Campo não selecionado"}
                                                                </span>
                                                            </AccordionTrigger>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => removeDataField(dataFieldIndex)}
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
                                                                            <Select onValueChange={field.onChange} value={field.value} disabled={isEditMode}>
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
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => addSubField(dataFieldIndex)}
                                                                    >
                                                                        <Plus className="h-4 w-4 mr-1" /> Adicionar Subcampo
                                                                    </Button>
                                                                </div>

                                                                {form.getValues(`dataFields.${dataFieldIndex}.subFields`).map((_, subFieldIndex) => (
                                                                    <div key={subFieldIndex} className="flex items-center space-x-2">
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`dataFields.${dataFieldIndex}.subFields.${subFieldIndex}.value`}
                                                                            render={({ field }) => (
                                                                                <FormItem className="flex-1">
                                                                                    <FormControl>
                                                                                        <Input {...field} placeholder={`Valor do subcampo ${subFieldIndex + 1}`} />
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
                                                                ))}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
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
            </DialogContent>
        </Dialog>
    )
}
