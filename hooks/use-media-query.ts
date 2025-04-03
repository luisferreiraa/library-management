"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
    // Estado para armzenar se o media corresponde ou não à query
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        // Cria um objeto MediaQueryList baseado na query CSS fornecida
        const media = window.matchMedia(query)

        // Definir o valor inicial, verificando se o media já corresponde à query
        if (media.matches !== matches) {
            setMatches(media.matches)
        }

        // Função de callback para atualizar o estado quando o media muda
        const listener = () => {
            setMatches(media.matches)
        }

        // Adiciona um event listener para monitorar mudanças no media
        media.addEventListener("change", listener)

        // Remove o event listener quando o componente é desmontado ou a query muda
        return () => {
            media.removeEventListener("change", listener)
        }
    }, [matches, query])    // Executa o efeito sempre que matches ou query mudar

    return matches      // Retorna o estado atual, indicando se o media corresponde à query
}

