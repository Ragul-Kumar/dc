import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/Icon'
import { FLAVOURS, defaultSize } from '@/data/products'
import { grams, inr, perHundred } from '@/lib/format'
import { useCart } from '@/context/CartContext'
import { cn } from '@/lib/utils'

// Figma "Product card" (12:118). `listing` is the Shop all variant (39:5057): fluid width,
// flavour-tinted photo well, Fraunces name and an outlined Quick add.
export function ProductCard({ product, listing = false, className }) {
  const { add } = useCart()
  const [wished, setWished] = useState(false)
  const size = defaultSize(product)
  const flavour = FLAVOURS[product.flavour]

  return (
    <article
      className={cn('flex flex-col gap-3.5 rounded-card bg-sand p-3', listing ? 'w-full' : 'w-[302px] shrink-0', className)}
    >
      <div
        className={cn(
          'relative flex h-[220px] items-center justify-center p-5',
          listing ? 'rounded-2xl' : 'rounded-2xl bg-white'
        )}
        style={listing ? { background: flavour.tint } : undefined}
      >
        <Link to={`/shop/${product.id}`} className="size-full" aria-label={product.name}>
          <img src={product.image} alt="" className="size-full object-contain" />
        </Link>
        <Badge variant="grade" className="absolute left-3 top-3">
          {product.grade}
        </Badge>
        <button
          onClick={() => setWished((w) => !w)}
          aria-pressed={wished}
          aria-label="Add to wishlist"
          className={cn('absolute right-1.5 top-3 rounded-full p-[7px]', wished ? 'bg-primary/15' : 'bg-ivory')}
        >
          <Icon name="heart" size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-2 px-1.5 pb-1">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full border border-line" style={{ background: flavour.color }} />
          <p className="text-xs font-medium text-muted-foreground">
            {flavour.name} · {product.style}
          </p>
        </div>
        <h3 className={cn(listing ? 'font-display text-[22px] font-semibold leading-tight' : 'text-xl font-bold leading-tight')}>
          <Link to={`/shop/${product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] text-gold" role="img" aria-label={`${product.rating} out of 5 stars`}>
            {"★".repeat(Math.round(product.rating))}
            <span className="text-line">{"★".repeat(5 - Math.round(product.rating))}</span>
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {product.rating} ({product.reviews})
          </span>
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-[22px] font-bold">{inr(size.price)}</span>
          <span className="font-mono text-xs text-muted-foreground">{perHundred(size.price, size.grams)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Icon name="leaf-sm" size={14} />
          <p className="text-xs font-medium text-leaf">
            {product.dateLabel ?? 'Roasted'} {product.roasted} · {grams(size.grams)}
          </p>
        </div>
      </div>

      <Button
        size="sm"
        variant={listing ? 'secondary' : 'default'}
        className="w-full"
        onClick={() => add(product.id, size.grams)}
      >
        {listing ? <Plus strokeWidth={1.5} /> : <Icon name="plus" size={16} />}
        Quick add
      </Button>
    </article>
  )
}
