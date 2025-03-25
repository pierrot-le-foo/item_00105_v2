"use client"

import { useEffect, useState } from "react"
import { Building, Calendar, MapPin, MoreVertical, Trash2 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"
import { getAccommodations } from "@/lib/data"
import type { Accommodation } from "@/lib/data"
import { ConfirmationDialog } from "./confirmation-dialog"
import { deleteAccommodationFromStorage } from "@/lib/local-storage"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AccommodationsListProps {
  tripId: string
}

export function AccommodationsList({ tripId }: AccommodationsListProps) {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Function to fetch accommodations
  const fetchAccommodations = () => {
    setIsLoading(true)
    const accommodationData = getAccommodations(tripId)
    setAccommodations(accommodationData)
    setIsLoading(false)
  }

  useEffect(() => {
    // Get accommodations from local storage
    fetchAccommodations()
  }, [tripId])

  const handleDeleteAccommodation = (id: string) => {
    deleteAccommodationFromStorage(id)
    fetchAccommodations()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32" aria-live="polite" aria-busy="true">
        <p>Loading accommodations...</p>
      </div>
    )
  }

  if (accommodations.length === 0) {
    return (
      <EmptyState
        title="No accommodations added yet"
        description="Add your hotel, Airbnb, or other accommodations"
        link={`/trips/${tripId}/accommodations/new`}
        linkText="Add Accommodation"
      />
    )
  }

  return (
    <div className="space-y-4">
      {accommodations.map((accommodation) => (
        <Card key={accommodation.id}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center mb-2">
                  <Building className="h-5 w-5 mr-2" aria-hidden="true" />
                  <h4 className="font-semibold">{accommodation.name}</h4>
                  <span className="ml-2 text-sm text-muted-foreground">{accommodation.type}</span>
                  <div className="ml-auto md:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={`Options for ${accommodation.name}`}
                        >
                          <MoreVertical className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <ConfirmationDialog
                          title="Delete Accommodation"
                          description="Are you sure you want to delete this accommodation? This action cannot be undone."
                          onConfirm={() => handleDeleteAccommodation(accommodation.id)}
                        >
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="mr-2 h-4 w-4 text-destructive" aria-hidden="true" />
                            <span className="text-destructive">Delete Accommodation</span>
                          </DropdownMenuItem>
                        </ConfirmationDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span>{accommodation.location}</span>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium">Amenities:</div>
                  <div className="flex flex-wrap gap-2 mt-1" role="list" aria-label="Amenities">
                    {accommodation.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted"
                        role="listitem"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:items-end">
                <div className="flex items-center justify-between">
                  <div className="flex items-center mb-1">
                    <Calendar className="h-4 w-4 mr-1" aria-hidden="true" />
                    <span className="text-sm">Check-in: {accommodation.checkIn}</span>
                  </div>
                  <div className="hidden md:block">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={`Options for ${accommodation.name}`}
                        >
                          <MoreVertical className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <ConfirmationDialog
                          title="Delete Accommodation"
                          description="Are you sure you want to delete this accommodation? This action cannot be undone."
                          onConfirm={() => handleDeleteAccommodation(accommodation.id)}
                        >
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="mr-2 h-4 w-4 text-destructive" aria-hidden="true" />
                            <span className="text-destructive">Delete Accommodation</span>
                          </DropdownMenuItem>
                        </ConfirmationDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex items-center mb-3">
                  <Calendar className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span className="text-sm">Check-out: {accommodation.checkOut}</span>
                </div>
                <div className="text-sm text-muted-foreground">{accommodation.price}</div>
                <div className="mt-1 font-medium">Total: {accommodation.totalPrice}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

