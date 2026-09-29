import { getProduct, UPSELL } from '@/data/products'
import { grams, inr } from '@/lib/format'
import { useCart } from '@/context/CartContext'
import { cn } from '@/lib/utils'

// Hidden once the upsell is already in the cart
export function UpsellCard({ variant = 'drawer' }) {
  const { lines, add } = useCart()
  const product = getProduct(UPSELL.productId)
  const size = product.sizes.find((s) => s.grams === UPSELL.grams)
  if (lines.some((l) => l.productId === product.id)) return null

  const page = variant === 'page'
  return (
    <div className={cn('flex items-center gap-3 rounded-2xl bg-sand', page ? 'gap-3.5 p-4' : 'p-3')}>
      <img src={product.image} alt="" className={cn('rounded-[10px] object-contain', page ? 'size-14' : 'size-12')} />
      <div className="min-w-0 flex-1">
        <p className={cn('font-bold', page ? 'text-[15px]' : 'text-sm')}>
          {page
            ? `Add a ${grams(size.grams)} ${product.name} for ${inr(size.price)}`
            : `Add a ${product.name} ${grams(size.grams)}?`}
        </p>
        <p className={cn('text-muted-foreground', page ? 'text-[13px]' : 'font-mono text-xs')}>
          {page ? 'A tasting pack to try alongside your order' : inr(size.price)}
        </p>
      </div>
      <button
        onClick={() => add(product.id, size.grams, 1, false)}
        className={cn(
          'shrink-0 rounded-full border-[1.5px] border-roast font-bold hover:bg-roast hover:text-ivory',
          page ? 'px-[18px] py-2.5 text-sm' : 'px-3.5 py-2 text-[13px]'
        )}
      >
        {page ? '+ Add' : 'Add'}
      </button>
    </div>
  )
}
