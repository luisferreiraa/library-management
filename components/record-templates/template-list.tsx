// components/record-templates/templates-list.tsx
"use client"

import { Template } from "@/lib/templates"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import CreateTemplateModal from "./create-template-modal"
import { useState } from "react"

export function TemplatesList({ templates }: { templates: Template[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

    const handleEditTemplate = (template: Template) => {
        setSelectedTemplate(template)
        setIsModalOpen(true)
    }

    return (
        <>
            <ul className="space-y-6">
                {templates.map(template => (
                    <li key={template.id} className="border p-6 rounded-lg shadow relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTemplate(template)}
                            className="absolute top-4 right-4"
                        >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar {template.name}</span>
                        </Button>

                        <h2 className="text-xl font-semibold pr-10">{template.name}</h2>
                        <p className="text-sm text-gray-600 mb-4">{template.description || "Sem descrição"}</p>

                        <Accordion type="single" collapsible>
                            <AccordionItem value="controlFields">
                                <AccordionTrigger>Campos de Controlo</AccordionTrigger>
                                <AccordionContent>
                                    {template.controlFields.length > 0 ? (
                                        <ul className="list-disc list-inside text-sm text-gray-800">
                                            {template.controlFields.map(cf => (
                                                <li key={cf.id}>
                                                    {cf.definition?.tag || "Sem tag"} - {cf.definition?.name || "Sem nome"}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="italic text-gray-500">Nenhum campo de controlo</p>
                                    )}
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="dataFields">
                                <AccordionTrigger>Campos de Dados</AccordionTrigger>
                                <AccordionContent>
                                    {template.dataFields.length > 0 ? (
                                        <ul className="list-disc list-inside text-sm text-gray-800">
                                            {template.dataFields.map(df => (
                                                <li key={df.id}>
                                                    {df.definition?.tag || "Sem tag"} - {df.definition?.name || "Sem nome"}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="italic text-gray-500">Nenhum campo de dados</p>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </li>
                ))}
            </ul>

            {selectedTemplate && (
                <CreateTemplateModal
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    template={selectedTemplate}
                    mode="edit"
                    onSuccess={() => {
                        // Atualize o estado se necessário
                        setIsModalOpen(false)
                    }}
                />
            )}
        </>
    )
}