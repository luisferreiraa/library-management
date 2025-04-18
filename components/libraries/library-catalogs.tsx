"use client"

import { LibraryWithCatalogs } from "@/lib/libraries";
import { useState } from "react";
import { EmptyState } from "../ui/empty-state";
import { Check, ExternalLink, FolderOpen, Pencil, PlusCircle, Trash2, X } from "lucide-react";
import { Button } from "../ui/button";
import { CreateLibraryCatalogModal } from "./create-library-catalog-modal";
import { useCatalogs } from "@/contexts/catalogs-context";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { IndeterminateCheckbox } from "../ui/indetermined-checkbox";
import { deleteCatalogsAction } from "@/app/catalogs/actions";
import { toast } from "react-toastify";
import { Catalog } from "@prisma/client";

interface LibraryCatalogsProps {
    library: LibraryWithCatalogs
}

export function LibraryCatalogs({ library }: LibraryCatalogsProps) {
    const {
        selectedEntityIds,
        toggleEntitySelection,
        toggleAllEntities,
        hasSelection,
        removeEntities,
    } = useCatalogs();

    const [isAddingCatalog, setIsAddingCatalog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null);
    const catalogs = library.catalog;

    const allSelected = catalogs.length > 0 && catalogs.every((c) => selectedEntityIds.includes(c.id));
    const someSelected = selectedEntityIds.length > 0 && !allSelected;

    const handleEditCatalog = (catalog: Catalog) => {
        setSelectedCatalog(catalog);
        setIsEditModalOpen(true);
    };

    const handleDeleteSelected = async () => {
        if (selectedEntityIds.length === 0) return;

        try {
            setIsDeleting(true);
            await deleteCatalogsAction(selectedEntityIds);
            removeEntities(selectedEntityIds);

            toast.success(
                selectedEntityIds.length === 1
                    ? "Catálogo excluído com sucesso"
                    : `Catálogos excluídos com sucesso (${selectedEntityIds.length})`
            );

            setIsDialogOpen(false);
        } catch {
            toast.error(
                selectedEntityIds.length === 1
                    ? "Erro ao excluir catálogo"
                    : "Erro ao excluir catálogos"
            );
        } finally {
            setIsDeleting(false);
        }
    };

    if (catalogs.length === 0) {
        return (
            <>
                <EmptyState
                    icon={<FolderOpen className="h-10 w-10" />}
                    title="Nenhum catálogo encontrado"
                    description="Esta biblioteca ainda não possui catálogos registados."
                    action={
                        <Button onClick={() => setIsAddingCatalog(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Adicionar Catálogo
                        </Button>
                    }
                />
                <CreateLibraryCatalogModal
                    open={isAddingCatalog}
                    onOpenChange={setIsAddingCatalog}
                    libraryId={library.id}
                    libraryName={library.name}
                />
            </>
        );
    }

    return (
        <div className="space-y-4">
            {hasSelection && (
                <div className="flex justify-end">
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Excluir Selecionados ({selectedEntityIds.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Excluir catálogos</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja excluir {selectedEntityIds.length} catálogo(s)? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteSelected}
                                    disabled={isDeleting}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {isDeleting ? "Excluindo..." : "Excluir"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-medium">Lista de Catálogos</h3>
                    <p className="text-sm text-muted-foreground">
                        {catalogs.length} {catalogs.length === 1 ? "catálogo encontrado" : "catálogos encontrados"}
                    </p>
                </div>
                <Button onClick={() => setIsAddingCatalog(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Catálogo
                </Button>
            </div>

            <div className="w-full mx-auto rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <IndeterminateCheckbox
                                    checked={allSelected}
                                    indeterminate={someSelected}
                                    onCheckedChange={toggleAllEntities}
                                    aria-label="Selecionar todos os catálogos"
                                />
                            </TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Data de Criação</TableHead>
                            <TableHead>Biblioteca</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {catalogs.map((catalog) => (
                            <TableRow key={catalog.id} className={selectedEntityIds.includes(catalog.id) ? "bg-muted/50" : ""}>
                                <TableCell>
                                    <IndeterminateCheckbox
                                        checked={selectedEntityIds.includes(catalog.id)}
                                        onCheckedChange={() => toggleEntitySelection(catalog.id)}
                                        aria-label={`Selecionar ${catalog.name}`}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    <Link
                                        href={`/catalogs/${catalog.slug}`}
                                        className="hover:underline hover:text-primary transition-colors"
                                    >
                                        {catalog.name}
                                    </Link>
                                </TableCell>
                                <TableCell>{format(new Date(catalog.createdAt), "dd/MM/yyyy")}</TableCell>
                                <TableCell>{library.name}</TableCell>
                                <TableCell>
                                    {catalog.isActive ? (
                                        <Badge variant="success" className="flex items-center gap-1 w-fit">
                                            <Check className="h-3 w-3" />
                                            Ativo
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                                            <X className="h-3 w-3" />
                                            Inativo
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEditCatalog(catalog)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">Editar {catalog.name}</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/catalogs/${catalog.slug}`}>
                                                <ExternalLink className="h-4 w-4" />
                                                <span className="sr-only">Ver detalhes de {catalog.name}</span>
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <CreateLibraryCatalogModal
                open={isAddingCatalog}
                onOpenChange={setIsAddingCatalog}
                libraryId={library.id}
                libraryName={library.name}
            />

            <CreateLibraryCatalogModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                libraryId={library.id}
                libraryName={library.name}
                catalog={selectedCatalog} // Passa o catálogo a ser editado
                onSuccess={() => {
                    // Lógica após sucesso na edição
                    setSelectedCatalog(null);
                }}
            />
        </div>
    );
}