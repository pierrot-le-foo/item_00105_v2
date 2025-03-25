/**
 * Generates an image URL based on a location name
 * Uses Unsplash Source API to get relevant images
 */
export function generateLocationImage(location: string): string {
  // Clean the location string for use in a URL
  const cleanLocation = encodeURIComponent(location.trim())

  // Use Unsplash Source API to get a relevant image
  return `https://source.unsplash.com/featured/1200x800?${cleanLocation},travel`
}

