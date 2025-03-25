"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { CalendarIcon, MapPinIcon, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { deleteTripFromStorage, undoDeleteTrip } from "@/lib/local-storage"
import { ConfirmDialog } from "./confirm-dialog"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface TripCardProps {
  id: string
  name: string
  destination: string
  dateRange: string
  image: string
  onDelete?: () => void
}

export function TripCard({ id, name, destination, dateRange, image, onDelete }: TripCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = () => {
    const deletedTrip = deleteTripFromStorage(id)

    if (deletedTrip) {
      toast({
        title: "Trip deleted",
        description: `"${deletedTrip.name}" has been removed.`,
        action: (
          <ToastAction altText="Undo" onClick={handleUndoDelete}>
            Undo
          </ToastAction>
        ),
      })
    }

    if (onDelete) {
      onDelete()
    } else {
      router.refresh()
    }
  }

  const handleUndoDelete = () => {
    const restoredTrip = undoDeleteTrip()

    if (restoredTrip) {
      toast({
        title: "Trip restored",
        description: `"${restoredTrip.name}" has been restored.`,
      })

      if (onDelete) {
        onDelete()
      } else {
        router.refresh()
      }
    }
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        <Image
          src={image || "/placeholder.svg?height=300&width=400"}
          alt={`Image of ${destination}`}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4 flex-grow">
        <h2 className="text-xl font-semibold">{name}</h2>
        <div className="flex items-center mt-2 text-muted-foreground">
          <MapPinIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>{destination}</span>
        </div>
        <div className="flex items-center mt-1 text-muted-foreground">
          <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>{dateRange}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/trips/${id}`}>
            View Trip
            <span className="sr-only">View details for trip to {destination}</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground"
          aria-label={`Delete trip to ${destination}`}
          onClick={() => setShowDeleteConfirm(true)}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </Button>

        <ConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Delete Trip"
          description="Are you sure you want to delete this trip? You can undo this action."
          onConfirm={handleDelete}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </CardFooter>
    </Card>
  )
}

