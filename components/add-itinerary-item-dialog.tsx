"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveItineraryItemToStorage } from "@/lib/local-storage"

const itineraryItemSchema = z.object({
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time format (HH:MM).",
  }),
  type: z.enum(["flight", "accommodation", "activity", "other"], {
    required_error: "Please select an item type.",
  }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  details: z.string().optional(),
})

type ItineraryItemFormValues = z.infer<typeof itineraryItemSchema>

interface AddItineraryItemDialogProps {
  tripId: string
  date: Date
  onItemAdded: () => void
  children?: React.ReactNode
}

export function AddItineraryItemDialog({ tripId, date, onItemAdded, children }: AddItineraryItemDialogProps) {
  const [open, setOpen] = useState(false)
  const formattedDate = format(date, "MMMM d, yyyy")
  const dialogTitleId = "add-item-dialog-title"
  const dialogDescriptionId = "add-item-dialog-description"

  const form = useForm<ItineraryItemFormValues>({
    resolver: zodResolver(itineraryItemSchema),
    defaultValues: {
      time: "",
      type: "activity",
      title: "",
      details: "",
    },
  })

  function onSubmit(data: ItineraryItemFormValues) {
    // Save itinerary item to local storage
    saveItineraryItemToStorage({
      tripId: tripId,
      date: format(date, "yyyy-MM-dd"),
      time: data.time,
      type: data.type,
      title: data.title,
      details: data.details || "",
    })

    // Close the dialog
    setOpen(false)

    // Reset the form
    form.reset()

    // Notify parent component that an item was added
    onItemAdded()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-labelledby={dialogTitleId}
        aria-describedby={dialogDescriptionId}
      >
        <DialogHeader>
          <DialogTitle id={dialogTitleId}>Add Itinerary Item</DialogTitle>
          <DialogDescription id={dialogDescriptionId}>
            Add a new item to your itinerary for {formattedDate}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input placeholder="14:00" {...field} aria-describedby={`time-error-${field.name}`} />
                  </FormControl>
                  <FormMessage id={`time-error-${field.name}`} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger aria-label="Select item type">
                        <SelectValue placeholder="Select item type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="flight">Flight</SelectItem>
                      <SelectItem value="accommodation">Accommodation</SelectItem>
                      <SelectItem value="activity">Activity</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage id={`type-error-${field.name}`} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Visit Tokyo Tower" {...field} aria-describedby={`title-error-${field.name}`} />
                  </FormControl>
                  <FormMessage id={`title-error-${field.name}`} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional details about this item..."
                      className="min-h-[80px]"
                      {...field}
                      aria-describedby={`details-error-${field.name}`}
                    />
                  </FormControl>
                  <FormMessage id={`details-error-${field.name}`} />
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button type="submit" className="w-full sm:w-auto">
                Add to Itinerary
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

