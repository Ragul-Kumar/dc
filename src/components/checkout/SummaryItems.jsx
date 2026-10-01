import { ProductThumb } from '@/components/shared/ProductThumb'
import { grams, inr } from '@/lib/format'

// Compact item list for the right-hand summary card
export function SummaryItems({ lines }) {
  return (
    <ul className="flex flex-col gap-4">
      {lines.map((l) => (
        <li key={`${l.productId}-${l.grams}-${l.sub ?? 0}-${l.bundle ? 'b' : ''}`} className="flex items-center gap-3">
          <ProductThumb src={l.product.image} size={52} className="rounded-[10px]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{l.product.name}</p>
            <p className="font-mono text-[11px] text-muted-foreground">
              {l.product.grade} · {grams(l.grams)} · Qty {l.qty}
              {l.sub ? ` · every ${l.sub} wk` : ''}
            </p>
            {l.custom?.note && <p className="truncate text-[11px] text-muted-foreground">{l.custom.note}</p>}
          </div>
          <p className="font-mono text-sm font-medium">{inr(l.total)}</p>
        </li>
      ))}
    </ul>
  )
}
