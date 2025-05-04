import { CreateTemplateButton } from "@/components/record-templates/create-template-button"
import { getTemplatesAction } from "./actions"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import CreateTemplateModal from "@/components/record-templates/create-template-modal"
import { Template } from "@/lib/templates"
import { TemplatesList } from "@/components/record-templates/template-list"

export default async function RecordTemplatesPage() {
    const templates = await getTemplatesAction()

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
                <CreateTemplateButton />
            </div>
            <TemplatesList templates={templates} />
        </div>
    )
}
