import { getTemplatesAction } from "./actions";

export default async function RecordTemplatesPage() {

    const templates = await getTemplatesAction()

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <h1 className="text-2xl font-bold mb-4">Templates</h1>
            <ul className="space-y-6">
                {templates.map(template => (
                    <li key={template.id} className="border p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold">{template.name}</h2>
                        <p className="text-sm text-gray-600 mb-4">{template.description || "Sem descrição"}</p>

                        <div className="mb-4">
                            <h3 className="font-medium">Campos de Controlo:</h3>
                            <ul className="list-disc list-inside text-sm text-gray-800">
                                {template.controlFields.length > 0 ? (
                                    template.controlFields.map(cf => (
                                        <li key={cf.id}>
                                            {cf.definition?.tag || "Sem tag"} - {cf.definition?.name || "Sem nome"}
                                        </li>
                                    ))
                                ) : (
                                    <li className="italic text-gray-500">Nenhum campo de controlo</li>
                                )}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-medium">Campos de Dados:</h3>
                            <ul className="list-disc list-inside text-sm text-gray-800">
                                {template.dataFields.length > 0 ? (
                                    template.dataFields.map(df => (
                                        <li key={df.id}>
                                            {df.definition?.tag || "Sem tag"} - {df.definition?.name || "Sem nome"}
                                        </li>
                                    ))
                                ) : (
                                    <li className="italic text-gray-500">Nenhum campo de dados</li>
                                )}
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}