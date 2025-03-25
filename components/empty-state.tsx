import { PlusCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddTripDialog } from "./add-trip-dialog"

interface EmptyStateProps {
  title: string
  description: string
  link: string
  onTripAdded?: () => void
}

export function EmptyState({ title, description, onTripAdded = () => {} }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center h-full border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <PlusCircle className="h-10 w-10 text-muted-foreground mb-4" aria-hidden="true" />
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">{description}</p>
        <AddTripDialog onTripAdded={onTripAdded}>
          <Button variant="outline">
            Add Trip
            <span className="sr-only">{description}</span>
          </Button>
        </AddTripDialog>
      </CardContent>
    </Card>
  )
}

