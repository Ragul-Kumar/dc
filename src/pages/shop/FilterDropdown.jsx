import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

// Figma "Filter/<name>" pill (39:5010): white pill + chevron, opens a checklist
export function FilterDropdown({ group, selected, onToggle }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = (e) => {
      if (e.type === 'keydown' ? e.key === 'Escape' : !root.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-1.5 rounded-full border bg-white py-2.5 pl-4 pr-3.5 text-sm font-medium transition-colors hover:border-roast',
          selected.length ? 'border-roast' : 'border-line'
        )}
      >
        {group.label}
        {selected.length > 0 && (
          <span className="rounded-full bg-roast px-1.5 py-px font-mono text-[11px] text-ivory">{selected.length}</span>
        )}
        <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} strokeWidth={1.5} />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-30 min-w-[220px] rounded-card border border-line bg-white p-2 shadow-lg">
          {group.options.map((o) => (
            <label
              key={o.value}
              className="flex cursor-pointer items-center gap-3 rounded-input px-3 py-2.5 text-sm font-medium hover:bg-ivory"
            >
              <Checkbox checked={selected.includes(o.value)} onCheckedChange={() => onToggle(group.key, o.value)} />
              {o.label}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
