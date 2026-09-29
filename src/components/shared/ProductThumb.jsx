import { cn } from '@/lib/utils'

// Ivory square holding a product photo — used in drawer, cart and summaries
export function ProductThumb({ src, size = 72, className }) {
  return (
    <div
      className={cn('flex shrink-0 items-center justify-center rounded-xl bg-ivory', className)}
      style={{ width: size, height: size }}
    >
      <img src={src} alt="" className="size-[84%] object-contain" />
    </div>
  )
}
