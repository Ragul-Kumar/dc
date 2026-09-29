import { cn } from '@/lib/utils'

// Figma icons are exported SVGs in /public/assets/icons (1.5px line, Roast Brown).
export function Icon({ name, size = 22, className, alt = '' }) {
  return (
    <img
      src={`/assets/icons/${name}.svg`}
      width={size}
      height={size}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      className={cn('shrink-0', className)}
      style={{ width: size, height: size }}
    />
  )
}
