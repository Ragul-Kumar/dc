import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FLAVOURS, defaultSize, getProduct } from '@/data/products'
import { getDetails } from '@/data/productDetails'
import { grams, inr, perHundred } from '@/lib/format'
import { useCart } from '@/context/CartContext'
import { useCompare } from '@/context/CompareContext'

// Side-by-side comparison of up to three products ticked "Compare" on the shop page
export default function ComparePage() {
  const { ids, toggle, clear } = useCompare()
  const { add } = useCart()
  const products = ids.map(getProduct).filter(Boolean)

  if (products.length < 2) {
    return (
      <section className="page-x mx-auto flex max-w-[1440px] flex-col items-start gap-4 py-24">
        <h1 className="font-display text-[36px] font-semibold md:text-h1">Compare cashews</h1>
        <p className="max-w-[520px] text-body-l">Tick “Compare” on two or three products in the shop, then come back here to see them side by side.</p>
        <Button asChild>
          <Link to="/shop">Go to the shop</Link>
        </Button>
      </section>
    )
  }

  const rows = [
    ['Grade', (p) => `${p.grade} ${getDetails(p).grade.label}`],
    ['Flavour', (p) => FLAVOURS[p.flavour].name],
    ['Roast', (p) => p.style],
    ['Nuts per 100 g', (p) => getDetails(p).grade.per100],
    ['Packs', (p) => p.sizes.map((s) => grams(s.grams)).join(' · ')],
    ['Price', (p) => inr(defaultSize(p).price) + ' · ' + grams(defaultSize(p).grams)],
    ['Per 100 g', (p) => perHundred(defaultSize(p).price, defaultSize(p).grams)],
    ['Rating', (p) => `${p.rating} (${p.reviews})`],
    ['Roasted / packed', (p) => p.roasted],
    ['Crunch · Salt · Sweet · Heat', (p) => getDetails(p).meters.map(([, n]) => n).join(' · ')],
  ]

  return (
    <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-8 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-[36px] font-semibold md:text-h1">Compare cashews</h1>
        <button type="button" onClick={clear} className="text-sm font-bold underline">
          Clear all
        </button>
      </div>
      <div className="overflow-x-auto rounded-card border border-line bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr>
              <th className="w-[200px] p-4" />
              {products.map((p) => (
                <th key={p.id} className="p-4 align-top">
                  <div className="flex flex-col items-start gap-3">
                    <img src={p.image} alt="" className="h-28 w-full rounded-xl bg-sand object-contain p-2" />
                    <Link to={`/shop/${p.id}`} className="font-display text-xl font-semibold hover:underline">
                      {p.name}
                    </Link>
                    <div className="flex gap-2">
                      <Button size="xs" onClick={() => add(p.id, defaultSize(p).grams)}>
                        Add to cart
                      </Button>
                      <Button size="xs" variant="secondary" onClick={() => toggle(p.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, get]) => (
              <tr key={label} className="border-t border-line">
                <td className="p-4 font-medium text-muted-foreground">{label}</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 font-mono">
                    {get(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
