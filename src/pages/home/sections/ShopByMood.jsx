import { Link } from 'react-router-dom'
import { SectionHeading } from '@/components/shared/SectionHeading'

const TILES = [
  { title: 'Everyday snacking', sub: 'W240 & flavoured', img: 'mood-snacking.png', to: '/shop?grade=W240' },
  { title: 'Festive gifting', sub: 'Tins, boxes, sweets', img: 'bowl-wood.png', to: '/gifting' },
  { title: 'Cooking & sweets', sub: 'W320, made for the pan', img: 'factory.png', to: '/shop?grade=W320' },
  { title: 'Fitness fuel', sub: 'Raw, unsalted, portioned', img: 'chettinad.png', to: '/shop?roast=Raw' },
]

export function ShopByMood() {
  return (
    <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 pb-24 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="SHOP BY MOOD" title="What are they for?" />
        <Link to="/shop" className="text-sm font-bold underline">
          See all collections →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TILES.map((t) => (
          <Link key={t.title} to={t.to} className="group relative h-[380px] overflow-hidden rounded-card bg-sand">
            <img
              src={`/assets/images/${t.img}`}
              alt=""
              className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(28,20,18,0)] from-45% to-[rgba(28,20,18,0.85)]" />
            <div className="absolute bottom-6 left-6 flex flex-col gap-1">
              <p className="font-display text-[26px] font-semibold text-ivory">{t.title}</p>
              <p className="text-sm font-medium text-sand">{t.sub} →</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
