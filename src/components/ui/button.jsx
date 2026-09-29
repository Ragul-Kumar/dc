import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Variants mirror Figma "01 · Components" buttons: pill, Manrope Bold 15, h-52
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'border-[1.5px] border-roast text-roast hover:bg-roast hover:text-ivory',
        onDark: 'border-[1.5px] border-ivory text-ivory hover:bg-ivory hover:text-roast',
        gold: 'bg-gold text-roast hover:bg-gold/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost: 'hover:bg-accent',
        link: 'text-roast underline underline-offset-4',
      },
      size: {
        default: 'h-[52px] px-7 text-[15px]',
        sm: 'h-11 px-5 text-sm',
        xs: 'h-9 px-4 text-[13px]',
        icon: 'size-11',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = 'Button'

export { Button, buttonVariants }
