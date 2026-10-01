import { SHOP_PRODUCTS } from '@/data/products'
import { GIFT_BOXES } from '@/data/gifts'
import { grams, inr } from '@/lib/format'
import { printDocument } from '@/lib/print'

// "Download catalogue": a printable price list built from the live product data (Save as PDF in the print dialog)
export function downloadCatalogue() {
  return printDocument(
    'Durai Cashew catalogue',
    [
      ...SHOP_PRODUCTS.map((p) => ({
        heading: `${p.name} · ${p.grade}`,
        rows: p.sizes.map((s) => [grams(s.grams), inr(s.price)]),
      })),
      { heading: 'Gift boxes', rows: GIFT_BOXES.map((b) => [b.name, inr(b.price)]) },
    ],
    { note: 'Prices include GST. Free delivery above ₹999.' }
  )
}
