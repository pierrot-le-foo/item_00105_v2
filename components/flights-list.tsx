"use client"

import { useEffect, useState } from "react"
import { Plane, Calendar, Clock, MoreVertical, Trash2 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"
import { getFlights } from "@/lib/data"
import type { Flight } from "@/lib/data"
import { ConfirmationDialog } from "./confirmation-dialog"
import { deleteFlightFromStorage } from "@/lib/local-storage"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FlightsListProps {
  tripId: string
}

export function FlightsList({ tripId }: FlightsListProps) {
  const [flights, setFlights] = useState<Flight[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Function to fetch flights
  const fetchFlights = () => {
    setIsLoading(true)
    const flightData = getFlights(tripId)
    setFlights(flightData)
    setIsLoading(false)
  }

  useEffect(() => {
    // Get flights from local storage
    fetchFlights()
  }, [tripId])

  const handleDeleteFlight = (id: string) => {
    deleteFlightFromStorage(id)
    fetchFlights()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32" aria-live="polite" aria-busy="true">
        <p>Loading flights...</p>
      </div>
    )
  }

  if (flights.length === 0) {
    return (
      <EmptyState
        title="No flights added yet"
        description="Add your flight details to keep track of your journey"
        link={`/trips/${tripId}/flights/new`}
        linkText="Add Flight"
      />
    )
  }

  return (
    <div className="space-y-4">
      {flights.map((flight) => (
        <Card key={flight.id}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center mb-2">
                  <Plane className="h-5 w-5 mr-2" aria-hidden="true" />
                  <h4 className="font-semibold">{flight.airline}</h4>
                  <span className="ml-2 text-sm text-muted-foreground">{flight.flightNumber}</span>
                  <div className="ml-auto md:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={`Options for flight ${flight.flightNumber}`}
                        >
                          <MoreVertical className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <ConfirmationDialog
                          title="Delete Flight"
                          description="Are you sure you want to delete this flight? This action cannot be undone."
                          onConfirm={() => handleDeleteFlight(flight.id)}
                        >
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="mr-2 h-4 w-4 text-destructive" aria-hidden="true" />
                            <span className="text-destructive">Delete Flight</span>
                          </DropdownMenuItem>
                        </ConfirmationDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center mt-4">
                  <div>
                    <div className="text-xl font-bold">{flight.departureAirport}</div>
                    <div className="text-sm text-muted-foreground">{flight.departureCity}</div>
                  </div>

                  <div className="flex flex-col items-center px-4">
                    <div className="text-xs text-muted-foreground mb-1">{flight.duration}</div>
                    <div className="w-20 h-[2px] bg-muted relative" aria-hidden="true">
                      <div className="absolute -top-[5px] -right-[5px] w-3 h-3 rounded-full border-2 border-primary bg-background"></div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xl font-bold">{flight.arrivalAirport}</div>
                    <div className="text-sm text-muted-foreground">{flight.arrivalCity}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:items-end">
                <div className="flex items-center justify-between">
                  <div className="flex items-center mb-1">
                    <Calendar className="h-4 w-4 mr-1" aria-hidden="true" />
                    <span className="text-sm">{flight.departureDate}</span>
                  </div>
                  <div className="hidden md:block">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={`Options for flight ${flight.flightNumber}`}
                        >
                          <MoreVertical className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <ConfirmationDialog
                          title="Delete Flight"
                          description="Are you sure you want to delete this flight? This action cannot be undone."
                          onConfirm={() => handleDeleteFlight(flight.id)}
                        >
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="mr-2 h-4 w-4 text-destructive" aria-hidden="true" />
                            <span className="text-destructive">Delete Flight</span>
                          </DropdownMenuItem>
                        </ConfirmationDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span className="text-sm">{flight.departureTime}</span>
                </div>
                <div className="mt-2 text-sm font-medium">{flight.price}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

