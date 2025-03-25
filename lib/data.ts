// This file contains the data types and interfaces for the application

export interface Trip {
  id: string
  name: string
  destination: string
  startDate: string
  endDate: string
  description?: string
  image?: string
}

// These are stub interfaces for backward compatibility
export interface Flight {
  id: string
  tripId: string
  airline: string
  flightNumber: string
  departureAirport: string
  departureCity: string
  departureDate: string
  departureTime: string
  arrivalAirport: string
  arrivalCity: string
  arrivalDate: string
  arrivalTime: string
  duration: string
  price: string
}

export interface Accommodation {
  id: string
  tripId: string
  name: string
  type: string
  checkIn: string
  checkOut: string
  location: string
  price: string
  totalPrice: string
  amenities: string[]
}

export interface Activity {
  id: string
  tripId: string
  name: string
  type: string
  date: string
  time: string
  location: string
  price: string
  notes?: string
}

export interface ItineraryItem {
  id: string
  tripId: string
  date: string
  time: string
  type: "flight" | "accommodation" | "activity" | "other"
  title: string
  details?: string
}

// These functions are now just wrappers around the local storage functions
import {
  getTripsFromStorage,
  getTripFromStorage,
  initializeStorageWithSampleData,
  getFlightsForTrip,
  getAccommodationsForTrip,
  getActivitiesForTrip,
  getItineraryItemsForTrip,
} from "./local-storage"

export function getTrips(): Trip[] {
  return getTripsFromStorage()
}

export function getTrip(id: string): Trip | undefined {
  return getTripFromStorage(id)
}

// Stub functions for backward compatibility
export function getFlights(tripId: string): Flight[] {
  return getFlightsForTrip(tripId)
}

export function getAccommodations(tripId: string): Accommodation[] {
  return getAccommodationsForTrip(tripId)
}

export function getActivities(tripId: string): Activity[] {
  return getActivitiesForTrip(tripId)
}

export function getItineraryItems(tripId: string): ItineraryItem[] {
  return getItineraryItemsForTrip(tripId)
}

// Initialize sample data
export function initializeSampleData(): void {
  initializeStorageWithSampleData()
}

