import { cn } from '@/lib/utils'

// Eyebrow + H2 + optional lede, used by every home section
export function SectionHeading({ eyebrow, title, lede, center, dark, eyebrowClass, className }) {
  return (
    <div className={cn('flex flex-col gap-3', center && 'items-center text-center', className)}>
      {eyebrow && <p className={cn('eyebrow', dark && 'text-gold', eyebrowClass)}>{eyebrow}</p>}
      <h2
        className={cn(
          'font-display text-[32px] font-semibold leading-[1.15] md:text-h2',
          dark ? 'text-ivory' : 'text-roast'
        )}
      >
        {title}
      </h2>
      {lede && (
        <p className={cn('max-w-[640px] text-base leading-relaxed md:text-body-l', dark ? 'text-sand' : 'text-roast')}>
          {lede}
        </p>
      )}
    </div>
  )
}
