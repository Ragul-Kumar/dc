// Tiny global notification: toast('message') from anywhere; <Toaster /> (mounted once in App) shows it.
export const TOAST_EVENT = 'durai:toast'

export const toast = (message) => window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: message }))
