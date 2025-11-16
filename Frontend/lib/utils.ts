import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes a URL by ensuring it has a proper protocol (https://)
 * @param url - The URL to normalize
 * @returns The normalized URL with protocol, or empty string if invalid
 */
export function normalizeUrl(url?: string): string {
  if (!url || url.trim() === '') return ''
  
  const trimmedUrl = url.trim()
  
  // If URL already has a protocol, return as is
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl
  }
  
  // Otherwise, add https://
  return `https://${trimmedUrl}`
}
