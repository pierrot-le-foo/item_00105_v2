"use client"

import { useEffect, useState } from "react"
import { MapPin, Calendar, Clock } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/empty-state"
import { getActivities } from "@/lib/data"
import type { Activity } from "@/lib/data"

interface ActivitiesListProps {
  tripId: string
}

export function ActivitiesList({ tripId }: ActivitiesListProps) {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    // Get activities from local storage
    const activityData = getActivities(tripId)
    setActivities(activityData)
  }, [tripId])

  if (activities.length === 0) {
    return (
      <EmptyState
        title="No activities added yet"
        description="Add sightseeing, tours, and other activities to your itinerary"
        link={`/trips/${tripId}/activities/new`}
      />
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center mb-2">
                  <h4 className="font-semibold">{activity.name}</h4>
                  <Badge variant="outline" className="ml-2">
                    {activity.type}
                  </Badge>
                </div>

                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{activity.location}</span>
                </div>

                <div className="mt-4 text-sm">{activity.notes}</div>
              </div>

              <div className="flex flex-col md:items-end">
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">{activity.date}</span>
                </div>
                <div className="flex items-center mb-3">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{activity.time}</span>
                </div>
                <div className="mt-1 font-medium">{activity.price}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

