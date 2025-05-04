"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Record } from "@/lib/records"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { deleteRecordAction } from "@/app/records/actions"
import { toast } from "react-toastify"

// Adicionar a importação do extrator de informações UNIMARC no topo do arquivo
import { extractBasicInfoFromUnimarc } from "@/lib/unimarc-converter"

interface RecordsTableProps {
    records: Record[]
    onEdit: (record: Record) => void
}

export default function RecordsTable({ records, onEdit }: RecordsTableProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    // Modificar a função getRecordTitle para usar o metadata UNIMARC
    const getRecordTitle = (record: Record): string => {
        // Se tiver metadata UNIMARC, extrair o título dele
        if (record.metadata && Object.keys(record.metadata).length > 0) {
            const basicInfo = extractBasicInfoFromUnimarc(record.metadata)
            if (basicInfo.title !== "Sem título") {
                return basicInfo.title
            }
        }

        // Fallback para o método anterior
        const titleField = record.dataFields.find(
            (df) => df.definition.tag === "245" || df.definition.name.toLowerCase().includes("título"),
        )

        if (titleField) {
            const titleSubfield = titleField.subFields[0]?.value
            if (titleSubfield) return titleSubfield
        }

        // Fallback para ID se não encontrar título
        return `Registro ${record.id.substring(0, 8)}...`
    }

    // Modificar a função getRecordAuthor para usar o metadata UNIMARC
    const getRecordAuthor = (record: Record): string => {
        // Se tiver metadata UNIMARC, extrair o autor dele
        if (record.metadata && Object.keys(record.metadata).length > 0) {
            const basicInfo = extractBasicInfoFromUnimarc(record.metadata)
            if (basicInfo.author !== "Autor desconhecido") {
                return basicInfo.author
            }
        }

        // Fallback para o método anterior
        const authorField = record.dataFields.find(
            (df) => df.definition.tag === "100" || df.definition.name.toLowerCase().includes("autor"),
        )

        if (authorField) {
            const authorSubfield = authorField.subFields[0]?.value
            if (authorSubfield) return authorSubfield
        }

        return "Autor desconhecido"
    }

    // Função para formatar a data
    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    // Função para deletar um registro
    const handleDelete = async (id: string) => {
        if (confirm("Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.")) {
            try {
                setIsDeleting(id)
                await deleteRecordAction(id)
                toast.success("Registro excluído com sucesso")
                router.refresh()
            } catch (error) {
                console.error("Erro ao excluir registro:", error)
                toast.error("Erro ao excluir registro")
            } finally {
                setIsDeleting(null)
            }
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                {/* Modificar a parte do TableHeader para incluir a nova coluna */}
                <TableHeader>
                    <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Autor</TableHead>
                        <TableHead>Ano</TableHead>
                        <TableHead>Data de Criação</TableHead>
                        <TableHead>Última Atualização</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                {/* E modificar a parte do TableBody para incluir a nova coluna */}
                <TableBody>
                    {records.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                Nenhum registro encontrado
                            </TableCell>
                        </TableRow>
                    ) : (
                        records.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell className="font-medium">{getRecordTitle(record)}</TableCell>
                                <TableCell>{getRecordAuthor(record)}</TableCell>
                                <TableCell>
                                    {record.metadata && Object.keys(record.metadata).length > 0
                                        ? extractBasicInfoFromUnimarc(record.metadata).year
                                        : "N/A"}
                                </TableCell>
                                <TableCell>{formatDate(record.createdAt)}</TableCell>
                                <TableCell>{formatDate(record.updatedAt)}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Abrir menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => router.push(`/records/${record.id}`)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Visualizar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onEdit(record)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(record.id)}
                                                disabled={isDeleting === record.id}
                                                className="text-destructive focus:text-destructive"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                {isDeleting === record.id ? "Excluindo..." : "Excluir"}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
