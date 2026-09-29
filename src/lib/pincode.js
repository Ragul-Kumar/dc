import { UNSERVICEABLE_PREFIXES } from '@/data/products'

// Minimal pincode → place lookup until a real API is wired [confirm provider]
const PREFIXES = [
  ['600', { city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' }],
  ['641', { city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu' }],
  ['625', { city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu' }],
  ['560', { city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka' }],
  ['400', { city: 'Mumbai', district: 'Mumbai', state: 'Maharashtra' }],
  ['110', { city: 'New Delhi', district: 'New Delhi', state: 'Delhi' }],
  ['794', { city: 'Tura', district: 'West Garo Hills', state: 'Meghalaya' }],
]

export function lookupPincode(pin) {
  if (!/^\d{6}$/.test(pin)) return { valid: false }
  const place = PREFIXES.find(([p]) => pin.startsWith(p))?.[1] ?? null
  const serviceable = !UNSERVICEABLE_PREFIXES.some((p) => pin.startsWith(p))
  return { valid: true, serviceable, place }
}
