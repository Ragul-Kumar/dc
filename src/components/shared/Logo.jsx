import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function Logo({ dark = false, className }) {
  return (
    <Link to="/" className={cn('flex items-center gap-2.5', className)} aria-label="Durai Cashew home">
      <img src="/assets/icons/durai-symbol.svg" alt="" className="size-[38px]" />
      <span className="flex flex-col">
        <span
          className={cn(
            'font-display text-2xl font-semibold leading-none tracking-[0.22em]',
            dark ? 'text-ivory' : 'text-roast'
          )}
        >
          DURAI
        </span>
        <span className={cn('text-[9px] font-bold tracking-[0.6em]', dark ? 'text-gold' : 'text-muted-foreground')}>
          CASHEW
        </span>
      </span>
    </Link>
  )
}
