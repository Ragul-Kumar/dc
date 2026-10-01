import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { GIFT_BOXES } from '@/data/gifts'
import { inr } from '@/lib/format'
import { useCart } from '@/context/CartContext'

export function GiftingSpotlight() {
  const { addCustom } = useCart()
  const boxes = GIFT_BOXES.slice(0, 3)

  return (
    <section className="bg-night">
      <div className="page-x mx-auto flex max-w-[1440px] flex-col items-start gap-12 py-24">
        <div className="w-full overflow-hidden">
          <img src="/assets/icons/kolam-gifting.svg" alt="" className="h-6 w-[1280px] max-w-none" />
        </div>

        <div className="flex flex-col items-start gap-3">
          <p className="eyebrow text-gold">FESTIVE &amp; PERSONAL GIFTING</p>
          <h2 className="font-display text-[40px] font-semibold leading-[1.15] text-ivory md:text-h1">Gift the good kind</h2>
          <p className="max-w-[560px] text-base leading-relaxed text-sand md:text-body-l">
            Gold-foiled tins and boxes, filled with graded whole cashews and a handwritten card.
          </p>
        </div>

        <div className="grid w-full gap-6 md:grid-cols-3">
          {boxes.map((b) => (
            <article key={b.name} className="flex flex-col gap-4 rounded-card border border-gold/50 p-4">
              <Link to="/gifting" className="flex h-[300px] items-center justify-center rounded-2xl bg-[#2A1F1A]" aria-label={b.name}>
                <img src={`/assets/images/${b.img}`} alt="" className="h-[260px] w-[300px] max-w-full object-contain" />
              </Link>
              <div className="flex flex-col items-start gap-1.5 px-2 pb-2 pt-1">
                <h3 className="font-display text-2xl font-semibold text-ivory">{b.name}</h3>
                <p className="text-sm leading-normal text-sand">{b.desc.replace('Inside: ', '')}</p>
                <p className="font-mono text-sm text-gold">from {inr(b.price)}</p>
                <Button size="xs" className="mt-2" onClick={() => addCustom({ ...b, image: `/assets/images/${b.img}` })}>
                  Add to cart
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/gifting/build">Build a gift box</Link>
          </Button>
          <Button asChild variant="onDark">
            <Link to="/gifting/corporate">Corporate gifting</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
