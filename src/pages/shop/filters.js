import { FLAVOURS, SHOP_PRODUCTS } from '@/data/products'

// Figma 03 · Shop all, filter bar (39:5003). Selections live in the URL so a filtered shop can be shared.
// Diet tags and price bands are placeholders [confirm].
const lowest = (p) => Math.min(...p.sizes.map((s) => s.price))
const uniq = (list) => [...new Set(list)]

export const PRICE_BANDS = [
  { value: 'u300', label: 'Under ₹300', test: (n) => n < 300 },
  { value: '300-600', label: '₹300 – ₹600', test: (n) => n >= 300 && n <= 600 },
  { value: '600-1000', label: '₹600 – ₹1,000', test: (n) => n > 600 && n <= 1000 },
  { value: 'o1000', label: 'Over ₹1,000', test: (n) => n > 1000 },
]

const dietOf = (p) => p.diet ?? (p.flavour === 'honey' ? ['Gluten free'] : ['Vegan', 'Gluten free'])

export const FILTER_GROUPS = [
  {
    key: 'grade',
    label: 'Grade',
    options: uniq(SHOP_PRODUCTS.map((p) => p.grade)).sort().map((g) => ({ value: g, label: g })),
    match: (p, v) => p.grade === v,
  },
  {
    key: 'flavour',
    label: 'Flavour',
    options: uniq(SHOP_PRODUCTS.map((p) => p.flavour)).map((f) => ({ value: f, label: FLAVOURS[f].name })),
    match: (p, v) => p.flavour === v,
  },
  {
    key: 'roast',
    label: 'Roast',
    options: uniq(SHOP_PRODUCTS.map((p) => p.style)).map((s) => ({ value: s, label: s })),
    match: (p, v) => p.style === v,
  },
  {
    key: 'size',
    label: 'Pack size',
    options: uniq(SHOP_PRODUCTS.flatMap((p) => p.sizes.map((s) => s.grams)))
      .sort((a, b) => a - b)
      .map((g) => ({ value: String(g), label: g >= 1000 ? `${g / 1000} kg` : `${g} g` })),
    match: (p, v) => p.sizes.some((s) => s.grams === Number(v)),
  },
  {
    key: 'price',
    label: 'Price',
    options: PRICE_BANDS.map(({ value, label }) => ({ value, label })),
    match: (p, v) => PRICE_BANDS.find((b) => b.value === v)?.test(lowest(p)) ?? false,
  },
  {
    key: 'diet',
    label: 'Diet',
    options: uniq(SHOP_PRODUCTS.flatMap(dietOf)).map((d) => ({ value: d, label: d })),
    match: (p, v) => dietOf(p).includes(v),
  },
]

export const SORTS = [
  { value: 'bestselling', label: 'Bestselling', compare: () => 0 },
  { value: 'price-asc', label: 'Price: low to high', compare: (a, b) => lowest(a) - lowest(b) },
  { value: 'price-desc', label: 'Price: high to low', compare: (a, b) => lowest(b) - lowest(a) },
  { value: 'rating', label: 'Top rated', compare: (a, b) => b.rating - a.rating || b.reviews - a.reviews },
]

export const readSelection = (params) =>
  Object.fromEntries(
    FILTER_GROUPS.map((g) => [
      g.key,
      // values that are not real options (old or hand-typed links) are ignored instead of crashing the filter
      (params.get(g.key) ?? "").split(",").filter((v) => g.options.some((o) => o.value === v)),
    ])
  )

// Within a group the options are OR'd; across groups they are AND'd
export function applyFilters(selection, sort) {
  const list = SHOP_PRODUCTS.filter((p) =>
    FILTER_GROUPS.every((g) => !selection[g.key].length || selection[g.key].some((v) => g.match(p, v)))
  )
  return list.sort(SORTS.find((s) => s.value === sort)?.compare ?? SORTS[0].compare)
}
