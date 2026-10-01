import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { SHOP_PRODUCTS, defaultSize, getProduct } from '@/data/products'
import { getDetails } from '@/data/productDetails'
import { grams as fmtGrams, inr } from '@/lib/format'
import { useCart } from '@/context/CartContext'
import { ProductMain } from './ProductMain'
import { HowPeopleUse, KnowYourNut, NutritionBatch, PairsWith, TrustStrip } from './ProductSections'
import { ReviewsQA } from './ReviewsQA'

const PAIR_ORDER = ['chettinad-masala', 'roasted-salted', 'honey-glazed', 'w180-king-whole']

// Figma 04 · Product page (39:5143)
export default function ProductPage() {
  const { id } = useParams()
  const product = getProduct(id)
  if (!product) return <Navigate to="/shop" replace />
  return <Product key={product.id} product={product} />
}

function Product({ product }) {
  const { add } = useCart()
  const details = getDetails(product)
  const [qty, setQty] = useState(1)
  const [gramsSel, setGramsSel] = useState(defaultSize(product).grams)
  const buyBoxRef = useRef(null)
  const [stickyOn, setStickyOn] = useState(false)

  const size = product.sizes.find((s) => s.grams === gramsSel) ?? product.sizes[0]
  // "Pairs well with": four other products, in the order the design shows them
  const pairs = PAIR_ORDER.map(getProduct).concat(SHOP_PRODUCTS).filter((p, i, all) => p.id !== product.id && all.indexOf(p) === i).slice(0, 4)

  // Mobile sticky add-to-cart bar appears once the buy box has scrolled away (Figma spec frame)
  useEffect(() => {
    const el = buyBoxRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setStickyOn(!e.isIntersecting && e.boundingClientRect.top < 0))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <ProductMain
        product={product}
        details={details}
        qty={qty}
        setQty={setQty}
        gramsSel={gramsSel}
        setGramsSel={setGramsSel}
        buyBoxRef={buyBoxRef}
      />
      <TrustStrip />
      <KnowYourNut product={product} details={details} />
      <NutritionBatch product={product} details={details} />
      <HowPeopleUse product={product} />
      <ReviewsQA product={product} details={details} />
      <PairsWith products={pairs} />

      {stickyOn && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-line bg-white px-4 py-2.5 shadow-[0_-4px_16px_rgba(58,35,23,0.08)] lg:hidden">
          <div className="flex flex-col">
            <span className="font-mono text-xs text-muted-foreground">
              {product.grade} · {fmtGrams(size.grams)}
            </span>
            <span className="text-[22px] font-bold leading-tight">{inr(size.price * qty)}</span>
          </div>
          <Button onClick={() => add(product.id, size.grams, qty)}>Add to cart</Button>
        </div>
      )}
    </>
  )
}
