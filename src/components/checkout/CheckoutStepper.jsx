import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/shared/Icon'

const STEPS = [
  { label: 'Cart', to: '/checkout/cart' },
  { label: 'Delivery details', short: 'Delivery', to: '/checkout/delivery' },
  { label: 'Payment', to: '/checkout/payment' },
]

// current: 0 = Cart, 1 = Delivery, 2 = Payment
export function CheckoutStepper({ current }) {
  return (
    <nav aria-label="Checkout progress" className="page-x flex justify-center pb-2 pt-7">
      <ol className="flex items-center gap-2 sm:gap-3">
        {STEPS.map((s, i) => {
          const done = i < current
          const active = i === current
          const dot = (
            <span
              className={cn(
                'flex size-7 items-center justify-center rounded-full text-[13px] font-bold',
                done && 'bg-leaf',
                active && 'bg-roast text-ivory',
                !done && !active && 'border border-line bg-white text-muted-foreground'
              )}
            >
              {done ? <Icon name="check-white" size={14} /> : i + 1}
            </span>
          )
          const label = (
            <span className={cn('text-[13px] font-bold sm:text-[15px]', !done && !active && 'text-muted-foreground')}>
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{s.short ?? s.label}</span>
            </span>
          )
          return (
            <Fragment key={s.label}>
              {i > 0 && <li aria-hidden className={cn('h-0.5 w-6 sm:w-20', i <= current ? 'bg-leaf' : 'bg-line')} />}
              <li aria-current={active ? 'step' : undefined}>
                {done ? (
                  <Link to={s.to} className="flex items-center gap-2">
                    {dot}
                    {label}
                  </Link>
                ) : (
                  <span className="flex items-center gap-2">
                    {dot}
                    {label}
                  </span>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
