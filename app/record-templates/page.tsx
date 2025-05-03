import { CreateTemplateButton } from "@/components/record-templates/create-template-button"
import { getTemplatesAction } from "./actions"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export default async function RecordTemplatesPage() {
    const templates = await getTemplatesAction()

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
                <CreateTemplateButton />
            </div>
            <ul className="space-y-6">
                {templates.map(template => (
                    <li key={template.id} className="border p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold">{template.name}</h2>
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
        </div>
    )
}
