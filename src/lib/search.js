import { ALL_PRODUCTS_LIST, FLAVOURS } from '@/data/products'
import { ARTICLES, FEATURED } from '@/data/journal'
import { GROUPS as FAQ_GROUPS } from '@/pages/help/FaqPage'

const PAGES = [
  ['Shop all cashews', '/shop', 'cashew products grades flavours buy'],
  ['Grade guide', '/grades', 'w180 w210 w240 w320 splits pieces size which grade'],
  ['Gifting', '/gifting', 'gift boxes tins diwali pongal wedding'],
  ['Gift box builder', '/gifting/build', 'build custom box slots personalise'],
  ['Corporate gifting', '/gifting/corporate', 'bulk branded logo company quote'],
  ['Subscribe and save', '/subscribe', 'monthly plan subscription'],
  ['Wholesale', '/wholesale', 'b2b bulk retailer hotel caterer export spec sheet'],
  ['Our story', '/our-story', 'about family founder farms people'],
  ['Quality & lab testing', '/quality', 'lab batch tested certificate fssai'],
  ['Cashew Journal', '/journal', 'recipes blog health stories'],
  ['Contact us', '/contact', 'whatsapp phone email help support'],
  ['Track order', '/track-order', 'delivery status where is my order'],
  ['FAQ', '/faq', 'questions help delivery cod returns payment'],
  ['Shipping policy', '/policies/shipping', 'delivery charges dispatch'],
  ['Returns & refunds', '/policies/returns', 'refund return replace damaged'],
  ['Careers', '/careers', 'jobs work with us hiring'],
  ['Sustainability', '/sustainability', 'farmers sourcing environment women-led'],
  ['Press', '/press', 'media news'],
  ['Find a store', '/stores', 'dealer store locator shop near me'],
]

const hit = (hay, terms) => terms.every((t) => hay.toLowerCase().includes(t))

// One search across products, journal stories, FAQ answers and pages
export function searchSite(query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return { products: [], stories: [], faqs: [], pages: [] }
  return {
    products: ALL_PRODUCTS_LIST.filter((p) => hit(`${p.name} ${p.grade} ${FLAVOURS[p.flavour]?.name} ${p.style}`, terms)),
    stories: [FEATURED, ...ARTICLES].filter((a) => hit(`${a.title} ${a.category}`, terms)),
    faqs: FAQ_GROUPS.flatMap((g) => g.items.filter((i) => hit(`${i.q} ${i.a}`, terms)).map((i) => ({ ...i, topic: g.topic }))),
    pages: PAGES.filter(([title, , kw]) => hit(`${title} ${kw}`, terms)).map(([title, to]) => ({ title, to })),
  }
}
