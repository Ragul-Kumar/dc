import { useState } from 'react'
import { Icon } from '@/components/shared/Icon'

export function OfferBar() {
  const [open, setOpen] = useState(true)
  if (!open) return null

  return (
    <div className="flex items-center justify-between bg-night px-4 py-2.5 md:px-6">
      <span className="size-4" />
      <p className="text-center text-xs font-medium text-ivory md:text-[13px]">
        Free shipping above ₹999 <span className="mx-1.5">·</span> Freshly roasted this week
      </p>
      <button onClick={() => setOpen(false)} aria-label="Dismiss offer" className="opacity-90 hover:opacity-100">
        <Icon name="x" size={16} />
      </button>
    </div>
  )
}
