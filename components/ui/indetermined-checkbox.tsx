"use client"

import * as React from "react"
import { Checkbox, type CheckboxProps } from "@/components/ui/checkbox"

interface IndeterminateCheckboxProps extends Omit<CheckboxProps, "ref"> {
    indeterminate?: boolean
}

export const IndeterminateCheckbox = React.forwardRef<HTMLButtonElement, IndeterminateCheckboxProps>(
    ({ indeterminate, ...props }, ref) => {
        const internalRef = React.useRef<HTMLButtonElement>(null)
        const combinedRef = React.useMemo(() => {
            return (node: HTMLButtonElement) => {
                // Update both refs
                if (typeof ref === "function") ref(node)
                else if (ref) ref.current = node
                internalRef.current = node
            }
        }, [ref])

        React.useEffect(() => {
            if (internalRef.current) {
                internalRef.current.indeterminate = !!indeterminate
            }
        }, [indeterminate])

        return <Checkbox ref={combinedRef} {...props} />
    },
)

IndeterminateCheckbox.displayName = "IndeterminateCheckbox"

