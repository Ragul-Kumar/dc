import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

// Figma FAQ rows (e.g. 06 · Subscribe → FAQ): bold question, +/− toggle, one open at a time
export function FaqList({ items, defaultOpen = 0, className }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={cn('w-full', className)}>
      {items.map((item, i) => {
        const on = open === i
        return (
          <div key={item.q} className="border-b border-line">
            <h3>
              <button
                type="button"
                aria-expanded={on}
                onClick={() => setOpen(on ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-[17px] font-bold"
              >
                {item.q}
                {on ? <Minus className="size-[18px] shrink-0" strokeWidth={1.5} /> : <Plus className="size-[18px] shrink-0" strokeWidth={1.5} />}
              </button>
            </h3>
            {on && <p className="max-w-[640px] pb-5 text-[15px] leading-[1.55]">{item.a}</p>}
          </div>
        )
      })}
    </div>
  )
}
