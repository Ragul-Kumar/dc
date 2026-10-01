import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Icon } from '@/components/shared/Icon'
import { FLAVOURS } from '@/data/products'
import { GALLERY } from '@/data/productDetails'
import { deliveryDate, grams, inr, perHundred } from '@/lib/format'
import { lookupPincode } from '@/lib/pincode'
import { useCart } from '@/context/CartContext'
import { cn } from '@/lib/utils'

// ←/→/↑/↓ move the selection inside a custom radiogroup
const arrowNav = (values, current, set) => (e) => {
  const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
  if (!dir) return
  e.preventDefault()
  set(values[(values.indexOf(current) + dir + values.length) % values.length])
}

const GRADE_CM = { W180: '3.0', W210: '2.8', W240: '2.6', W320: '2.3' }

// Figma 04 · Product page → "Product main" (39:5146): gallery on the left, buy box on the right
export function ProductMain({ product, details, qty, setQty, gramsSel, setGramsSel, buyBoxRef }) {
  const { add, checkout, updateCheckout } = useCart()
  const navigate = useNavigate()
  const flavour = FLAVOURS[product.flavour]
  const size = product.sizes.find((s) => s.grams === gramsSel) ?? product.sizes[0]
  const base = product.sizes[0]

  const [purchase, setPurchase] = useState('once') // 'once' | 'sub' — subscription lines are added at 10% off, every 4 weeks
  const [wished, setWished] = useState(false)
  const [giftWrap, setGiftWrap] = useState(!!checkout.gift.wrap) // starts from what the cart already has
  const [pin, setPin] = useState('600040')
  const [delivery, setDelivery] = useState(() => lookupPincode('600040'))

  const subPrice = Math.round(size.price * 0.9)
  const saving = (s) => Math.round((base.price / base.grams) * s.grams - s.price)

  const checkPin = () => setDelivery(lookupPincode(pin.trim()))
  const addToCart = (openDrawer) => {
    add(product.id, size.grams, qty, openDrawer, purchase === 'sub' ? { sub: 4 } : {})
    // the paid gift-wrap add-on rides on the order (₹49 once): ticking adds it, unticking removes it
    if (giftWrap !== !!checkout.gift.wrap) updateCheckout({ gift: { ...checkout.gift, wrap: giftWrap } })
  }

  return (
    <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 pb-16 pt-6 lg:flex-row lg:gap-14">
      <Gallery product={product} cm={GRADE_CM[product.grade]} />

      <div ref={buyBoxRef} className="flex min-w-0 flex-1 flex-col items-start gap-[18px]">
        <div className="flex items-center gap-2.5">
          <Badge variant="grade">{product.grade}</Badge>
          <span className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
            <span className="size-3 rounded-full border border-line" style={{ background: flavour.color }} />
            {flavour.name} · {product.style}
          </span>
        </div>

        <h1 className="font-display text-[36px] font-semibold leading-[1.1] md:text-[48px]">{product.name}</h1>

        <a href="#reviews" className="flex items-center gap-2 text-sm font-medium">
          <span className="text-base text-gold" role="img" aria-label={`${product.rating} out of 5 stars`}>
            ★★★★★
          </span>
          <span className="underline">
            {product.rating} · {product.reviews} reviews · 18 questions
          </span>
        </a>

        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-[32px] font-bold leading-[44px]">{inr(size.price)}</span>
          <span className="font-mono text-sm font-medium text-muted-foreground">{perHundred(size.price, size.grams)}</span>
          <span className="text-[13px] text-muted-foreground">incl. all taxes</span>
        </div>

        <p className="max-w-[560px] leading-[1.6]">{details.blurb}</p>

        <p className="text-label font-bold tracking-[0.12em]">PACK SIZE</p>
        <div role="radiogroup" aria-label="Pack size" onKeyDown={arrowNav(product.sizes.filter((s) => !s.soldOut).map((s) => s.grams), size.grams, setGramsSel)} className="grid w-full grid-cols-2 gap-2.5 sm:grid-cols-4">
          {product.sizes.map((s) => {
            const on = s.grams === size.grams
            const save = saving(s)
            return (
              <button
                key={s.grams}
                type="button"
                role="radio"
                aria-checked={on}
                disabled={s.soldOut}
                onClick={() => setGramsSel(s.grams)}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-2xl border p-3 transition-colors disabled:opacity-50',
                  on ? 'border-roast bg-roast text-ivory' : 'border-line bg-white hover:border-roast'
                )}
              >
                <span className="font-mono text-sm font-medium">{grams(s.grams)}</span>
                <span className="text-[15px] font-bold">{inr(s.price)}</span>
                <span className={cn('text-[11px] font-bold', on ? 'text-gold' : 'text-muted-foreground', !on && save > 0 && 'text-success')}>
                  {s.soldOut ? 'Sold out' : save > 0 ? `Save ${inr(save)}` : '—'}
                </span>
              </button>
            )
          })}
        </div>

        <div role="radiogroup" aria-label="Purchase type" onKeyDown={arrowNav(["once", "sub"], purchase, setPurchase)} className="w-full overflow-hidden rounded-2xl border border-line bg-white">
          {[
            ['once', 'One-time purchase', inr(size.price)],
            ['sub', 'Subscribe and save 10%', `${inr(subPrice)} · every 4 weeks · skip anytime`],
          ].map(([value, title, sub], i) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={purchase === value}
              onClick={() => setPurchase(value)}
              className={cn('flex w-full items-center gap-3 p-4 text-left', i === 0 && 'border-b border-line')}
            >
              <Icon name={purchase === value ? 'radio-on' : 'radio-off'} size={18} />
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-bold">{title}</span>
                <span className="font-mono text-xs font-medium text-muted-foreground">{sub}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="flex w-full flex-wrap items-center gap-3">
          <div className="flex h-[52px] w-[120px] items-center justify-between rounded-full border-[1.5px] border-roast px-5 font-bold">
            <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              −
            </button>
            <span aria-live="polite">{qty}</span>
            <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(20, q + 1))}>
              +
            </button>
          </div>
          <Button onClick={() => addToCart()}>Add to cart</Button>
          <Button
            variant="secondary"
            onClick={() => {
              addToCart(false)
              navigate('/checkout/cart')
            }}
          >
            Buy now
          </Button>
          <button
            type="button"
            aria-pressed={wished}
            aria-label="Add to wishlist"
            onClick={() => setWished((w) => !w)}
            className={cn('flex size-[52px] items-center justify-center rounded-full border border-line', wished && 'bg-primary/15')}
          >
            <Icon name="heart" size={20} />
          </button>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium">
          <Checkbox
            checked={giftWrap}
            onCheckedChange={setGiftWrap}
            className="size-[18px] border-[1.5px] border-roast data-[state=checked]:bg-roast"
          />
          <Icon name="gift" size={18} />
          Add gift wrap and a handwritten note (+₹49)
        </label>

        <div className="flex w-full flex-col gap-2.5 rounded-2xl bg-sand p-4">
          <form
            className="flex items-center gap-2.5"
            onSubmit={(e) => {
              e.preventDefault()
              checkPin()
            }}
          >
            <Icon name="truck" size={20} />
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              aria-label="Delivery pincode"
              className="h-11 min-w-0 flex-1 rounded-input border border-line bg-white px-3.5 font-mono text-sm focus-visible:border-roast focus-visible:outline-none"
            />
            <button type="submit" className="text-sm font-bold text-primary underline">
              Check
            </button>
          </form>
          <p className={cn('text-[13px] font-medium', delivery.valid && delivery.serviceable ? 'text-success' : 'text-error')}>
            {!delivery.valid
              ? 'Enter a 6-digit pincode.'
              : !delivery.serviceable
                ? `We can’t deliver to ${pin} yet.`
                : `✓  Delivers by ${deliveryDate(3)} to ${delivery.place?.city ?? 'your area'} ${pin} · Free delivery above ₹999`}
          </p>
        </div>
      </div>
    </section>
  )
}

function Gallery({ product, cm }) {
  // a product photo that's also in the shared gallery list shows once
  const photos = [...new Set([product.image, ...GALLERY.map((f) => `/assets/images/${f}`)])]
  const [active, setActive] = useState(0)
  const [ruler, setRuler] = useState(true)
  const [zoom, setZoom] = useState(null) // transform-origin while hovering
  const [spin, setSpin] = useState(false) // "360°": cycles the photos

  useEffect(() => {
    if (!spin) return
    const t = setInterval(() => setActive((a) => (a + 1) % photos.length), 700)
    return () => clearInterval(t)
  }, [spin, photos.length])

  return (
    <div className="flex w-full flex-col gap-3.5 lg:w-[640px] lg:shrink-0">
      <nav aria-label="Breadcrumb" className="whitespace-pre text-[13px] font-medium text-muted-foreground">
        <Link to="/" className="hover:text-roast">
          Home
        </Link>
        {'  /  '}
        <Link to="/shop" className="hover:text-roast">
          Shop
        </Link>
        {`  /  ${product.grade}  /  ${product.name.replace(`${product.grade} `, '')}`}
      </nav>

      <div
        className="relative flex aspect-[640/600] w-full items-center justify-center overflow-hidden rounded-media bg-white"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          setZoom(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
        }}
        onMouseLeave={() => setZoom(null)}
      >
        <img
          src={photos[active]}
          alt={product.name}
          className={cn(
            'h-[80%] w-[81%] object-contain transition-transform duration-200',
            active >= 3 && 'rounded-2xl object-cover',
            zoom && 'scale-150'
          )}
          style={zoom ? { transformOrigin: zoom } : undefined}
        />
        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-line bg-ivory py-2 pl-3 pr-3.5">
          <Icon name="ruler" size={16} />
          <span className="text-xs font-bold">Grade ruler</span>
          <button
            type="button"
            role="switch"
            aria-checked={ruler}
            aria-label="Grade ruler"
            onClick={() => setRuler((r) => !r)}
            className={cn('relative h-[18px] w-[30px] rounded-full transition-colors', ruler ? 'bg-leaf' : 'bg-line')}
          >
            <span className={cn('absolute top-0.5 size-3.5 rounded-full bg-white transition-all', ruler ? 'left-[14px]' : 'left-0.5')} />
          </button>
        </div>
        {ruler && zoom && (
          <p className="absolute bottom-5 left-5 rounded-full bg-night/85 px-3 py-1.5 font-mono text-xs text-ivory">
            {product.grade} · ≈ {cm} cm
          </p>
        )}
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {photos.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Photo ${i + 1}`}
            aria-pressed={i === active}
            onClick={() => {
              setSpin(false)
              setActive(i)
            }}
            className={cn(
              'size-[70px] shrink-0 overflow-hidden rounded-xl bg-white',
              i === active ? 'border-2 border-roast' : 'border border-line'
            )}
          >
            <img src={src} alt="" className={cn('size-full', i < 3 ? 'object-contain' : 'object-cover')} />
          </button>
        ))}
        <button
          type="button"
          aria-pressed={spin}
          onClick={() => setSpin((s) => !s)}
          className={cn('flex size-[70px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl', spin ? 'bg-roast text-ivory' : 'bg-sand')}
        >
          <Icon name="r360" size={22} className={spin ? 'invert' : ''} />
          <span className="text-[10px] font-bold">{spin ? 'Stop' : '360°'}</span>
        </button>
      </div>
    </div>
  )
}
