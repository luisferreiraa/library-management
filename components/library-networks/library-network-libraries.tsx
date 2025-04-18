"use client"

import { LibraryNetworkWithLibraries } from "@/lib/library-networks";
import { useState } from "react";
import { EmptyState } from "../ui/empty-state";
import { Check, ExternalLink, FolderOpen, Pencil, PlusCircle, Trash2, X } from "lucide-react";
import { Button } from "../ui/button";
import { CreateLibraryNetworkLibraryModal } from "./create-library-network-library-modal";
import { useLibraries } from "@/contexts/libraries-context";
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
import { deleteLibrariesAction } from "@/app/(super-admin)/libraries/actions";
import { toast } from "react-toastify";
import { Library } from "@/lib/libraries";

interface LibraryNetworkLibrariesProps {
    libraryNetwork: LibraryNetworkWithLibraries
}

export function LibraryNetworkLibraries({ libraryNetwork }: LibraryNetworkLibrariesProps) {
    const {
        selectedEntityIds,
        toggleEntitySelection,
        toggleAllEntities,
        hasSelection,
        removeEntities,
    } = useLibraries();

    const [isAddingLibrary, setIsAddingLibrary] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
    const libraries = libraryNetwork.libraries

    const allSelected = libraries.length > 0 && libraries.every((c) => selectedEntityIds.includes(c.id));
    const someSelected = selectedEntityIds.length > 0 && !allSelected;

    const handleEditLibrary = (library: Library) => {
        setSelectedLibrary(library);
        setIsEditModalOpen(true);
    };

    const handleDeleteSelected = async () => {
        if (selectedEntityIds.length === 0) return;

        try {
            setIsDeleting(true);
            await deleteLibrariesAction(selectedEntityIds);
            removeEntities(selectedEntityIds);

            toast.success(
                selectedEntityIds.length === 1
                    ? "Biblioteca excluída com sucesso"
                    : `Bibliotecas excluídas com sucesso (${selectedEntityIds.length})`
            );

            setIsDialogOpen(false);
        } catch {
            toast.error(
                selectedEntityIds.length === 1
                    ? "Erro ao excluir biblioteca"
                    : "Erro ao excluir bibliotecas"
            );
        } finally {
            setIsDeleting(false);
        }
    };

    if (libraries.length === 0) {
        return (
            <>
                <EmptyState
                    icon={<FolderOpen className="h-10 w-10" />}
                    title="Nenhuma biblioteca encontrada"
                    description="Esta rede de bibliotecas ainda não possui bibliotecas registadas."
                    action={
                        <Button onClick={() => setIsAddingLibrary(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Adicionar Biblioteca
                        </Button>
                    }
                />
                <CreateLibraryNetworkLibraryModal
                    open={isAddingLibrary}
                    onOpenChange={setIsAddingLibrary}
                    libraryNetworkId={libraryNetwork.id}
                    libraryNetworkName={libraryNetwork.name}
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
                                <AlertDialogTitle>Excluir bibliotecas</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja excluir {selectedEntityIds.length} biblioteca(s)? Esta ação não pode ser desfeita.
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
                    <h3 className="text-lg font-medium">Lista de Bibliotecas</h3>
                    <p className="text-sm text-muted-foreground">
                        {libraries.length} {libraries.length === 1 ? "biblioteca encontrada" : "bibliotecas encontradas"}
                    </p>
                </div>
                <Button onClick={() => setIsAddingLibrary(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Biblioteca
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
                                    aria-label="Selecionar todas as bibliotecas"
                                />
                            </TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Data de Criação</TableHead>
                            <TableHead>Localização</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {libraries.map((library) => (
                            <TableRow key={library.id} className={selectedEntityIds.includes(library.id) ? "bg-muted/50" : ""}>
                                <TableCell>
                                    <IndeterminateCheckbox
                                        checked={selectedEntityIds.includes(library.id)}
                                        onCheckedChange={() => toggleEntitySelection(library.id)}
                                        aria-label={`Selecionar ${library.name}`}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    <Link
                                        href={`/libraries/${library.slug}`}
                                        className="hover:underline hover:text-primary transition-colors"
                                    >
                                        {library.name}
                                    </Link>
                                </TableCell>
                                <TableCell>{format(new Date(library.createdAt), "dd/MM/yyyy")}</TableCell>
                                <TableCell>{library.location}</TableCell>
                                <TableCell>
                                    {library.isActive ? (
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
                                            onClick={() => handleEditLibrary(library)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">Editar {library.name}</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/libraries/${library.slug}`}>
                                                <ExternalLink className="h-4 w-4" />
                                                <span className="sr-only">Ver detalhes de {library.name}</span>
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <CreateLibraryNetworkLibraryModal
                open={isAddingLibrary}
                onOpenChange={setIsAddingLibrary}
                libraryNetworkId={libraryNetwork.id}
                libraryNetworkName={libraryNetwork.name}
            />

            <CreateLibraryNetworkLibraryModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                libraryNetworkId={libraryNetwork.id}
                libraryNetworkName={libraryNetwork.name}
                library={selectedLibrary} // Passa a biblioteca a ser editada
                onSuccess={() => {
                    // Lógica após sucesso na edição
                    setSelectedLibrary(null);
                }}
            />
        </div>
    );
}