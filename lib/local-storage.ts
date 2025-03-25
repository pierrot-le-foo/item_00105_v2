import type { Trip, Flight, Accommodation, Activity, ItineraryItem } from "@/lib/data"
import { v4 as uuidv4 } from "uuid"

// Local storage keys
const TRIPS_KEY = "travel-planner-trips"
const FLIGHTS_KEY = "travel-planner-flights"
const ACCOMMODATIONS_KEY = "travel-planner-accommodations"
const ACTIVITIES_KEY = "travel-planner-activities"
const ITINERARY_KEY = "travel-planner-itinerary"

// Helper function to safely parse JSON from localStorage
function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback
  }

  const item = localStorage.getItem(key)
  if (!item) return fallback

  try {
    return JSON.parse(item) as T
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error)
    return fallback
  }
}

// Helper function to safely set JSON to localStorage
function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error setting ${key} to localStorage:`, error)
  }
}

// Trip functions
// Keep track of recently deleted trips for undo functionality
let recentlyDeletedTrip: Trip | null = null

export function getTripsFromStorage(): Trip[] {
  return getStorageItem<Trip[]>(TRIPS_KEY, [])
}

export function getTripFromStorage(id: string): Trip | undefined {
  const trips = getTripsFromStorage()
  return trips.find((trip) => trip.id === id)
}

export function saveTripToStorage(trip: Omit<Trip, "id">): Trip {
  const newTrip: Trip = {
    ...trip,
    id: uuidv4(),
  }

  const trips = getTripsFromStorage()
  setStorageItem(TRIPS_KEY, [...trips, newTrip])

  return newTrip
}

// Modified deleteTripFromStorage function
export function deleteTripFromStorage(id: string): Trip | null {
  const trips = getTripsFromStorage()
  const tripToDelete = trips.find((trip) => trip.id === id)

  if (!tripToDelete) return null

  // Store the deleted trip for potential undo
  recentlyDeletedTrip = tripToDelete

  // Remove the trip from storage
  setStorageItem(
    TRIPS_KEY,
    trips.filter((trip) => trip.id !== id),
  )

  return tripToDelete
}

// Add a function to restore the recently deleted trip
export function undoDeleteTrip(): Trip | null {
  if (!recentlyDeletedTrip) return null

  const trips = getTripsFromStorage()

  // Check if the trip already exists (to avoid duplicates)
  if (trips.some((trip) => trip.id === recentlyDeletedTrip?.id)) {
    return null
  }

  // Add the trip back to storage
  setStorageItem(TRIPS_KEY, [...trips, recentlyDeletedTrip])

  const restoredTrip = recentlyDeletedTrip
  recentlyDeletedTrip = null

  return restoredTrip
}

// Flight functions (stub implementations for backward compatibility)
export function getFlightsFromStorage(): Flight[] {
  return getStorageItem<Flight[]>(FLIGHTS_KEY, [])
}

export function getFlightsForTrip(tripId: string): Flight[] {
  const flights = getFlightsFromStorage()
  return flights.filter((flight) => flight.tripId === tripId)
}

export function saveFlightToStorage(flight: Omit<Flight, "id">): Flight {
  const newFlight: Flight = {
    ...flight,
    id: uuidv4(),
  }

  const flights = getFlightsFromStorage()
  setStorageItem(FLIGHTS_KEY, [...flights, newFlight])

  return newFlight
}

export function deleteFlightFromStorage(id: string): void {
  const flights = getFlightsFromStorage()
  setStorageItem(
    FLIGHTS_KEY,
    flights.filter((flight) => flight.id !== id),
  )
}

// Accommodation functions (stub implementations for backward compatibility)
export function getAccommodationsFromStorage(): Accommodation[] {
  return getStorageItem<Accommodation[]>(ACCOMMODATIONS_KEY, [])
}

export function getAccommodationsForTrip(tripId: string): Accommodation[] {
  const accommodations = getAccommodationsFromStorage()
  return accommodations.filter((acc) => acc.tripId === tripId)
}

export function saveAccommodationToStorage(accommodation: Omit<Accommodation, "id">): Accommodation {
  const newAccommodation: Accommodation = {
    ...accommodation,
    id: uuidv4(),
  }

  const accommodations = getAccommodationsFromStorage()
  setStorageItem(ACCOMMODATIONS_KEY, [...accommodations, newAccommodation])

  return newAccommodation
}

export function deleteAccommodationFromStorage(id: string): void {
  const accommodations = getAccommodationsFromStorage()
  setStorageItem(
    ACCOMMODATIONS_KEY,
    accommodations.filter((acc) => acc.id !== id),
  )
}

// Activity functions (stub implementations for backward compatibility)
export function getActivitiesFromStorage(): Activity[] {
  return getStorageItem<Activity[]>(ACTIVITIES_KEY, [])
}

export function getActivitiesForTrip(tripId: string): Activity[] {
  const activities = getActivitiesFromStorage()
  return activities.filter((activity) => activity.tripId === tripId)
}

export function saveActivityToStorage(activity: Omit<Activity, "id">): Activity {
  const newActivity: Activity = {
    ...activity,
    id: uuidv4(),
  }

  const activities = getActivitiesFromStorage()
  setStorageItem(ACTIVITIES_KEY, [...activities, newActivity])

  return newActivity
}

// Itinerary item functions (stub implementations for backward compatibility)
export function getItineraryItemsFromStorage(): ItineraryItem[] {
  return getStorageItem<ItineraryItem[]>(ITINERARY_KEY, [])
}

export function getItineraryItemsForTrip(tripId: string): ItineraryItem[] {
  const items = getItineraryItemsFromStorage()
  return items.filter((item) => item.tripId === tripId)
}

export function saveItineraryItemToStorage(item: Omit<ItineraryItem, "id">): ItineraryItem {
  const newItem: ItineraryItem = {
    ...item,
    id: uuidv4(),
  }

  const items = getItineraryItemsFromStorage()
  setStorageItem(ITINERARY_KEY, [...items, newItem])

  return newItem
}

export function deleteItineraryItemFromStorage(id: string): void {
  const items = getItineraryItemsFromStorage()
  setStorageItem(
    ITINERARY_KEY,
    items.filter((item) => item.id !== id),
  )
}

// Initialize with sample data if empty
export function initializeStorageWithSampleData(): void {
  if (typeof window === "undefined") return

  const trips = getTripsFromStorage()
  if (trips.length === 0) {
    // Sample trips with location-based images
    const sampleTrips: Trip[] = [
      {
        id: uuidv4(),
        name: "Tokyo Adventure",
        destination: "Tokyo, Japan",
        startDate: "2024-05-15",
        endDate: "2024-05-25",
        description: "Exploring the vibrant city of Tokyo, experiencing the culture, food, and attractions.",
        image: "https://source.unsplash.com/featured/1200x800?tokyo,japan,travel",
      },
      {
        id: uuidv4(),
        name: "Paris Getaway",
        destination: "Paris, France",
        startDate: "2024-06-10",
        endDate: "2024-06-18",
        description: "Romantic trip to the City of Light, visiting iconic landmarks and enjoying French cuisine.",
        image: "https://source.unsplash.com/featured/1200x800?paris,france,travel",
      },
    ]

    setStorageItem(TRIPS_KEY, sampleTrips)
  }
}

