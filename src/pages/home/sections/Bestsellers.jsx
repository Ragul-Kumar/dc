import { useRef } from 'react'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { ProductCard } from '@/components/shared/ProductCard'
import { PRODUCTS } from '@/data/products'

export function Bestsellers() {
  const shelf = useRef(null)
  const scroll = (dir) => shelf.current?.scrollBy({ left: dir * 326, behavior: 'smooth' })
  const arrow = 'rounded-full border-[1.5px] border-roast px-[18px] py-3 font-bold hover:bg-roast hover:text-ivory'

  return (
    <section id="bestsellers" className="bg-white py-24">
      <div className="page-x mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="BESTSELLERS"
          title="Most loved this month"
          lede="Six shelves, no repeats. Every card shows the grade, the roast date and the price per 100 g."
          className="max-w-[560px]"
        />
        <div className="hidden gap-2.5 md:flex">
          <button className={arrow} onClick={() => scroll(-1)} aria-label="Previous">
            ←
          </button>
          <button className={arrow} onClick={() => scroll(1)} aria-label="Next">
            →
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px]">
        <div ref={shelf} className="page-x no-scrollbar mt-10 flex snap-x gap-6 overflow-x-auto pr-0">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} className="snap-start" />
          ))}
        </div>
      </div>
    </section>
  )
}
