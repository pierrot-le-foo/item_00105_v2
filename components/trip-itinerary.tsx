"use client"

import { useState, useEffect } from "react"
import { format, addDays, differenceInDays } from "date-fns"
import { MoreVertical, Trash2, PlusCircle } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getItineraryItems } from "@/lib/data"
import type { ItineraryItem } from "@/lib/data"
import { AddItineraryItemDialog } from "./add-itinerary-item-dialog"
import { ConfirmationDialog } from "./confirmation-dialog"
import { deleteItineraryItemFromStorage } from "@/lib/local-storage"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TripItineraryProps {
  tripId: string
  startDate: string
  endDate: string
}

export function TripItinerary({ tripId, startDate, endDate }: TripItineraryProps) {
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Function to fetch itinerary items
  const fetchItineraryItems = () => {
    setIsLoading(true)
    const items = getItineraryItems(tripId)
    setItineraryItems(items)
    setIsLoading(false)
  }

  useEffect(() => {
    // Get itinerary items from local storage on initial load
    fetchItineraryItems()
  }, [tripId])

  // Parse dates
  const parsedStartDate = new Date(startDate)
  const parsedEndDate = new Date(endDate)

  const totalDays = differenceInDays(parsedEndDate, parsedStartDate) + 1
  const days = Array.from({ length: totalDays }, (_, i) => addDays(parsedStartDate, i))

  const handleDeleteItem = (id: string) => {
    deleteItineraryItemFromStorage(id)
    fetchItineraryItems()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32" aria-live="polite" aria-busy="true">
        <p>Loading itinerary...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {days.map((day, index) => {
        const dateStr = format(day, "yyyy-MM-dd")
        const dayItems = itineraryItems.filter((item) => item.date === dateStr)
        const dayId = `day-${index + 1}`

        return (
          <div key={index}>
            <h3 className="text-lg font-semibold mb-4" id={dayId}>
              Day {index + 1}: {format(day, "EEEE, MMMM d, yyyy")}
            </h3>

            <div aria-labelledby={dayId}>
              {dayItems.length > 0 ? (
                <div className="space-y-3">
                  {dayItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <div className="min-w-[80px] text-sm font-medium">{item.time}</div>
                            <div>
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{item.details}</p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                aria-label={`Options for ${item.title}`}
                              >
                                <MoreVertical className="h-4 w-4" aria-hidden="true" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <ConfirmationDialog
                                title="Delete Item"
                                description="Are you sure you want to delete this itinerary item? This action cannot be undone."
                                onConfirm={() => handleDeleteItem(item.id)}
                              >
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="mr-2 h-4 w-4 text-destructive" aria-hidden="true" />
                                  <span className="text-destructive">Delete Item</span>
                                </DropdownMenuItem>
                              </ConfirmationDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <AddItineraryItemDialog tripId={tripId} date={day} onItemAdded={fetchItineraryItems}>
                    <Button variant="outline" size="sm" className="mt-2">
                      <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                      Add Item
                      <span className="sr-only">Add new item to day {index + 1}</span>
                    </Button>
                  </AddItineraryItemDialog>
                </div>
              ) : (
                <div className="border rounded-lg p-6 text-center">
                  <p className="text-muted-foreground mb-4">No activities planned for this day</p>
                  <AddItineraryItemDialog tripId={tripId} date={day} onItemAdded={fetchItineraryItems}>
                    <Button variant="outline" size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                      Add Item
                      <span className="sr-only">Add first item to day {index + 1}</span>
                    </Button>
                  </AddItineraryItemDialog>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

