// Form submissions are stored on this device until a backend exists [confirm provider / endpoint].
// Each submission gets a reference the shopper can quote; the list is readable via getEnquiries().
const KEY = 'durai-enquiries-v1'

export const getEnquiries = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? []
  } catch {
    return []
  }
}

export function saveEnquiry(type, form) {
  const data = Object.fromEntries(new FormData(form).entries())
  Object.keys(data).forEach((k) => data[k] instanceof File && (data[k] = data[k].name))
  const ref = `ENQ-${Date.now().toString(36).toUpperCase().slice(-6)}`
  try {
    localStorage.setItem(KEY, JSON.stringify([...getEnquiries(), { ref, type, data, at: new Date().toISOString() }]))
  } catch {
    /* storage unavailable — the reference is still shown */
  }
  return ref
}
