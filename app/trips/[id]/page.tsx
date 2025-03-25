"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CalendarIcon, MapPinIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getTrip } from "@/lib/data"
import type { Trip } from "@/lib/data"

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get trip from local storage
    const tripData = getTrip(params.id)

    if (tripData) {
      setTrip(tripData)
    } else {
      // If trip not found, redirect to home page
      router.push("/")
    }

    setLoading(false)
  }, [params.id, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-center items-center h-64" aria-live="polite" aria-busy="true">
          <p>Loading trip details...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold" id="trip-heading">
          {trip.name}
        </h1>
        <Button variant="outline" asChild>
          <Link href="/">Back to Trips</Link>
        </Button>
      </div>

      <div className="relative h-[200px] sm:h-[300px] rounded-lg overflow-hidden mb-8">
        <Image
          src={trip.image || "/placeholder.svg?height=400&width=800"}
          alt={`Image of ${trip.destination}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="bg-muted p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Trip Details</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Destination</h3>
            <p className="flex items-center mt-1">
              <MapPinIcon className="mr-2 h-4 w-4" aria-hidden="true" />
              {trip.destination}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Dates</h3>
            <p className="flex items-center mt-1">
              <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
              {new Date(trip.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })} -{" "}
              {new Date(trip.endDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          {trip.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="mt-1">{trip.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

