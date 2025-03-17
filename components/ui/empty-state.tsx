import type { ReactNode } from "react"

interface EmptyStateProps {
    icon: ReactNode
    title: string
    description: string
    action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/40 rounded-lg">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">{icon}</div>
            <h3 className="mt-6 text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
            {action && <div className="mt-6">{action}</div>}
        </div>
    )
}

