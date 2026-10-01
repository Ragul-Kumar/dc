import { cn } from '@/lib/utils'

// Labelled field used by the enquiry / contact forms (Figma "Field/…": 13px bold label, 48px input, 8px radius)
export const fieldClass =
  'h-12 w-full rounded-input border border-line bg-white px-3.5 text-sm font-normal text-foreground placeholder:text-muted-foreground focus-visible:border-roast focus-visible:outline-none'

export function Field({ label, children, className }) {
  return (
    <label className={cn('flex min-w-0 flex-1 flex-col gap-1.5 text-[13px] font-bold', className)}>
      {label}
      {children}
    </label>
  )
}
