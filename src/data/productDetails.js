import { FLAVOURS } from '@/data/products'

// Copy and figures for Figma 04 · Product page. Everything below is the W240 Classic Plain
// content from the design; other products get values derived from their grade/flavour.
// Origin, nutrition, taste scores, batch data and Q&A are placeholders [confirm with lab / team].

const GRADE_FACTS = {
  W180: { label: '“King”', per100: '37 – 40', perLb: 180 },
  W210: { label: '“Jumbo”', per100: '44 – 46', perLb: 210 },
  W240: { label: '“Classic”', per100: '48 – 53', perLb: 240 },
  W320: { label: '“Everyday”', per100: '66 – 71', perLb: 320 },
}

const ROAST_LABEL = {
  Raw: 'Raw (unroasted)',
  'Dry roasted': 'Dry roasted',
  'Oil roasted': 'Oil roasted',
  Glazed: 'Honey glazed',
}

// Crunch / Salt / Sweet / Heat out of 5
const TASTE = {
  plain: { title: 'Creamy and mild', scores: [3, 0, 2, 0] },
  roasted: { title: 'Toasty and salty', scores: [3, 3, 1, 0] },
  pepper: { title: 'Peppery and bold', scores: [3, 2, 0, 2] },
  chilli: { title: 'Hot and garlicky', scores: [3, 2, 0, 4] },
  honey: { title: 'Sweet and glossy', scores: [2, 0, 4, 0] },
  chettinad: { title: 'Spiced and aromatic', scores: [3, 3, 0, 3] },
  mint: { title: 'Fresh and zesty', scores: [3, 2, 1, 0] },
}

export const GALLERY = ['bowl-wood.png', 'mood-snacking.png', 'step-05.png', 'factory.png', 'step-01.png']

export const RECIPES = [
  { time: '25 min · Sweets', title: 'Kaju katli, the easy way', img: 'factory.png' },
  { time: '15 min · Snack', title: 'Pepper-roasted cashews', img: 'roasted-salted.png'},
  { time: '35 min · Mains', title: 'Cashew pulao for four', img: 'step-01.png' },
]

export function getDetails(product) {
  const grade = GRADE_FACTS[product.grade] ?? GRADE_FACTS.W240
  const flavour = FLAVOURS[product.flavour]
  const taste = TASTE[product.flavour] ?? TASTE.plain
  const isRaw = product.style === 'Raw'
  const [crunch, salt, sweet, heat] = taste.scores
  const day = product.roasted.split(' ')[0].padStart(2, '0')

  return {
    grade,
    blurb: isRaw
      ? `Around ${grade.perLb} nuts in every 450 g. Creamy, whole and raw — our ${product.grade === 'W240' ? 'hero everyday' : 'graded whole'} grade.`
      : `${flavour.name} whole ${product.grade} cashews — ${product.style.toLowerCase()}, graded by hand and packed the day they are roasted.`,
    spec: [
      ['Grade', `${product.grade} ${grade.label}`],
      ['Origin', 'Panruti belt, Tamil Nadu'],
      ['Nuts per 100 g', grade.per100],
      ['Roast', ROAST_LABEL[product.style] ?? product.style],
      ['Ingredients', isRaw ? '100% cashew kernels' : `Cashew kernels, ${flavour.name.toLowerCase()} seasoning`],
      ['Shelf life', '6 months sealed · 4 weeks open'],
      ['Storage tip', 'Airtight, cool, away from sunlight'],
    ],
    tasteTitle: taste.title,
    meters: [
      ['Crunch', crunch],
      ['Salt', salt],
      ['Sweet', sweet],
      ['Heat', heat],
    ],
    nutrition: [
      ['Energy', '166 kcal'],
      ['Protein', '5.5 g'],
      ['Total fat', '13.2 g'],
      ['— of which saturated', '2.3 g'],
      ['Carbohydrates', '9.1 g'],
      ['Fibre', '1.0 g'],
      ['Magnesium', '83 mg'],
    ],
    batch: { date: `${product.roasted} ${new Date().getFullYear()}`, id: `D-${String(new Date().getMonth() + 1).padStart(2, '0')}${day}`, gradedBy: 'Team 3', moisture: '4.2%' },
    // sample reviews, deliberately mixed so every filter chip has something behind it
    reviews: [
      { stars: 5, photo: true, text: '“Every nut was whole — not a single broken piece in the tin.”', name: 'Priya R., Coimbatore' },
      { stars: 5, photo: false, text: '“Crunchy, not oily, and the roast date was two days before delivery.”', name: 'Arun K., Madurai' },
      { stars: 5, photo: false, text: `“We use ${product.grade} for guests and W320 for cooking. Both perfect.”`, name: 'Lakshmi N., Trichy' },
      { stars: 4, photo: true, text: '“Lovely taste. The tin could be a little bigger for the price, but the freshness is obvious.”', name: 'Karthik S., Chennai' },
      { stars: 4, photo: false, text: '“Arrived in three days with a clear roast date. Will order the 500 g next time.”', name: 'Meena V., Bengaluru' },
      { stars: 3, photo: false, text: '“Good quality, but two nuts in my pack were split. Support replaced it quickly.”', name: 'Ravi T., Hyderabad' },
    ],
    qa: [
      [
        'Is this roasted or raw?',
        isRaw ? 'Raw. For roasted, pick Roasted & Salted — same W240 grade.' : `${ROAST_LABEL[product.style] ?? product.style}, packed the day it is roasted.`,
      ],
      ['How many nuts in 250 g?', `About ${Math.round(grade.perLb * 0.52)} to ${Math.round(grade.perLb * 0.52) + 5} whole nuts.`],
      ['Is it suitable for kaju katli?', 'Yes, though W320 or splits are more economical for grinding.'],
    ],
  }
}
