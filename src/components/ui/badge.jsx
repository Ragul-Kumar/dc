import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-1 text-[11px] leading-none', {
  variants: {
    variant: {
      default: 'bg-primary font-bold tracking-[0.1em] text-primary-foreground',
      grade: 'bg-mint font-mono text-xs font-medium text-leaf',
      success: 'bg-mint font-bold text-leaf',
      outline: 'border border-line font-mono text-roast',
    },
  },
  defaultVariants: { variant: 'default' },
})

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
