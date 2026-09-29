import * as React from 'react'
import { cn } from '@/lib/utils'

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      'flex h-12 w-full rounded-input border border-input bg-white px-3 text-[15px] text-foreground placeholder:text-muted-foreground/80 focus-visible:border-roast focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-ivory disabled:opacity-100',
      className
    )}
    ref={ref}
    {...props}
  />
))
Input.displayName = 'Input'

export { Input }
