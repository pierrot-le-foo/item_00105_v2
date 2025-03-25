"use client"

import { useEffect, useState } from "react"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TripCard } from "@/components/trip-card"
import { EmptyState } from "@/components/empty-state"
import { AddTripDialog } from "@/components/add-trip-dialog"
import { getTrips, initializeSampleData } from "@/lib/data"
import type { Trip } from "@/lib/data"

export default function HomePage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Function to fetch trips
  const fetchTrips = () => {
    setIsLoading(true)
    const tripsData = getTrips()
    setTrips(tripsData)
    setIsLoading(false)
  }

  // Initialize sample data on first load and fetch trips
  useEffect(() => {
    initializeSampleData()
    fetchTrips()
  }, [])

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold" id="page-heading">
          My Trips
        </h1>
        <AddTripDialog onTripAdded={fetchTrips}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
            New Trip
          </Button>
        </AddTripDialog>
      </div>

      <div aria-labelledby="page-heading" className={isLoading ? "opacity-50" : ""}>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading trips...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                id={trip.id}
                name={trip.name}
                destination={trip.destination}
                dateRange={`${new Date(trip.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })} - ${new Date(trip.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`}
                image={trip.image || "/placeholder.svg?height=300&width=400"}
                onDelete={fetchTrips}
              />
            ))}
            {trips.length === 0 && (
              <div className="col-span-full">
                <EmptyState title="No trips yet" description="Start planning your first adventure" link="#" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

