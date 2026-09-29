import { cn } from '@/lib/utils'

export function QtyStepper({ value, onChange, size = 'sm', className }) {
  const btn =
    'flex items-center justify-center rounded font-bold leading-none outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40'
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-line font-bold text-roast',
        size === 'sm' ? 'gap-3.5 px-3 py-1 text-[13px]' : 'gap-4 px-3.5 py-1.5 text-sm',
        className
      )}
    >
      <button type="button" className={btn} onClick={() => onChange(value - 1)} aria-label="Decrease quantity">
        −
      </button>
      <span className="min-w-[1ch] text-center tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= 20}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}
