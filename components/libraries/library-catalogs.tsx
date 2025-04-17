"use client"

import { LibraryWithCatalogs } from "@/lib/libraries";
import { useState } from "react";
import { EmptyState } from "../ui/empty-state";
import { FolderOpen, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { LibraryProvider } from "@/contexts/libraries-context";
import { CreateLibraryCatalogModal } from "./create-library-catalog-modal";

interface LibraryCatalogsProps {
    library: LibraryWithCatalogs
}

export function LibraryCatalogs({ library }: LibraryCatalogsProps) {
    const [isAddingCatalog, setIsAddingCatalog] = useState(false)
    const catalogs = library.catalog

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

                <LibraryProvider initialEntities={[]} entityType="libraries">
                    <CreateLibraryCatalogModal
                        open={isAddingCatalog}
                        onOpenChange={setIsAddingCatalog}
                        libraryId={library.id}
                        libraryName={library.name}
                    />
                </LibraryProvider>
            </>
        )
    }
}