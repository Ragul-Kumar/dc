import { useState } from 'react'
import { Icon } from '@/components/shared/Icon'

const KEY = 'durai-offer-closed'
const wasClosed = () => {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function OfferBar() {
  // remembered for the session, so it doesn't come back when you move between the site and checkout
  const [open, setOpen] = useState(() => !wasClosed())
  if (!open) return null

  const close = () => {
    setOpen(false)
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* private mode — it just stays closed for this page view */
    }
  }

  return (
    <div className="flex items-center justify-between bg-night px-4 py-2.5 md:px-6">
      <span className="size-4" />
      <p className="text-center text-xs font-medium text-ivory md:text-[13px]">
        Free shipping above ₹999 <span className="mx-1.5">·</span> Freshly roasted this week
      </p>
      <button onClick={close} aria-label="Dismiss offer" className="opacity-90 hover:opacity-100">
        <Icon name="x" size={16} />
      </button>
    </div>
  )
}
