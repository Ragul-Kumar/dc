const img = (f) => `/assets/images/${f}`

// Figma 13 · Cashew Journal + 14 · Journal article. The kaju masala story has a bespoke layout (recipe card);
// every other story renders its `body` paragraphs (and optional pull quote) in the same article template.
export const CATEGORIES = ['Recipes', 'Health', 'Grade guides', 'Festive', 'Behind the scenes']

export const ARTICLES = [
  { slug: 'kaju-masala-20-minutes', category: 'Recipes', mins: 12, date: '18 Sep 2026', title: 'Kaju masala in 20 minutes, with W320', img: img('factory.png') },
  {
    slug: 'w180-vs-w240', category: 'Grade guides', mins: 6, date: '10 Sep 2026', title: 'W180 vs W240: is bigger worth it?', img: img('bowl-wood.png'),
    quote: ['“Bigger is better for a gift. Right is better for your pantry.”', 'Kamala, quality lead'],
    body: [
      'The number after the W is a count: how many whole kernels it takes to make a pound. A W180 needs only about 180, so each nut is big. A W240 needs about 240, so each is a little smaller — and noticeably easier on the price.',
      'For gifting and platters, W180 earns its premium: the nuts look generous and arrive unbroken. For everyday snacking, roasting and flavours, W240 is the sweet spot — same creamy taste, more nuts per tin.',
      'If you are cooking into a gravy or grinding for sweets, skip both and look at W320. Size stops mattering once the nut is blended.',
      'Not sure? Open the grade guide and slide through the sizes — we show the real nuts at their true relative size.',
    ],
  },
  {
    slug: 'how-many-cashews-a-day', category: 'Health', mins: 5, date: '4 Sep 2026', title: 'How many cashews a day is sensible?', img: img('w240-plain.png'),
    body: [
      'A small handful — about 30 g, or 15 to 18 whole cashews — is a common serving. It gives steady energy, healthy fats and a little protein without taking over your day’s calories.',
      'Cashews are energy-dense, so more is not automatically better. If you are watching your weight, treat them as a snack you count, not a bowl you finish.',
      'Choose raw or dry-roasted when you can, and go easy on heavily salted or glazed flavours if you have blood pressure concerns.',
      'This is general information, not medical advice — if you have a condition or an allergy, ask your doctor.',
    ],
  },
  {
    slug: 'deepavali-gifting-guide', category: 'Festive', mins: 7, date: '28 Aug 2026', title: 'The Deepavali gifting guide, by budget', img: img('mood-snacking.png'),
    body: [
      'Under ₹500: a Thank-you Pouch is the easy win — a 250 g kraft sleeve of W240 that suits neighbours, colleagues and the person who always helps with the parcels.',
      'Around ₹1,000: the Classic Tin. Two flavours, a handwritten card, and it looks as good on a table as it tastes.',
      '₹1,500 and above: Signature Box or Grand Drawer — four to seven flavours in brass-finish slots, for family elders and the people you really want to impress.',
      'Ordering more than a few? Pick the date at checkout, and note that 25 or more boxes unlock bulk pricing automatically.',
    ],
  },
  {
    slug: 'kaju-katli-without-the-stress', category: 'Recipes', mins: 25, date: '20 Aug 2026', title: 'Kaju katli without the stress', img: img('honey-glazed.png'),
    body: [
      'Kaju katli has a reputation for being fussy. It is really three jobs: grind the cashews fine, cook the sugar syrup to a one-string consistency, then bring them together quickly.',
      'Use W320 or splits — grinding makes size irrelevant, and you save money. Dry the nuts well before grinding so the powder does not turn oily.',
      'Keep the heat low once the powder goes in, and stop stirring the moment the mixture leaves the sides of the pan. Roll it warm, between two sheets of butter paper.',
      'Cut into diamonds when it is cool to the touch. It keeps for about a week in an airtight tin.',
    ],
  },
  {
    slug: 'why-we-print-the-roast-date', category: 'Behind the scenes', mins: 4, date: '12 Aug 2026', title: 'Why we print the roast date', img: img('step-02.png'),
    quote: ['“If a nut is old, we would rather you knew.”', 'Murugan, roast master'],
    body: [
      'Most packs tell you a best-before date months away. That says when the nut is safe, not when it is good.',
      'We print the day each batch was roasted or packed on every tin and on its product page, so you can judge freshness yourself.',
      'It keeps us honest too: batches move out fast, because nobody wants to be the person shipping a three-week-old tin.',
    ],
  },
  {
    slug: 'how-to-store-cashews', category: 'Health', mins: 4, date: '2 Aug 2026', title: 'How to store cashews so they stay crisp', img: img('roasted-salted.png'),
    body: [
      'Heat, light and air are what turn cashews stale. Keep the tin tightly closed, away from the stove and out of direct sun.',
      'In a cool pantry an opened tin stays good for about four weeks. In the fridge it lasts longer, and in the freezer for months — just bring it to room temperature before opening so no moisture settles on the nuts.',
      'If they ever taste flat or smell like paint, they have gone rancid. That is what our whole-nuts guarantee is for.',
    ],
  },
  {
    slug: 'w320-everyday-cooking', category: 'Grade guides', mins: 5, date: '25 Jul 2026', title: 'Why W320 is our everyday cooking grade', img: img('chettinad.png'),
    body: [
      'W320 is the smallest of our whole grades. You get more nuts per spoonful, which is exactly what a korma, pulao or payasam wants.',
      'It is also kinder on the budget — the best value per 100 g in the range.',
      'Keep W240 for the snack bowl and W320 for the kitchen. Nobody can taste the difference inside a gravy.',
    ],
  },
  {
    slug: 'pongal-sweets-with-cashew', category: 'Festive', mins: 8, date: '15 Jul 2026', title: 'Pongal sweets that lean on cashew', img: img('honey-glazed.png'),
    body: [
      'Sakkarai pongal without fried cashews is just sweet rice. A fistful of golden nuts in ghee is what makes it a festival dish.',
      'Fry them whole in ghee over a low flame until they just turn the colour of honey, then add at the very end so they stay crisp.',
      'For a modern twist, try honey-glazed cashews on top of a warm ven pongal — a little sweet against the pepper.',
    ],
  },
  {
    slug: 'pepper-roasted-cashews', category: 'Recipes', mins: 15, date: '5 Jul 2026', title: 'Pepper-roasted cashews in 15 minutes', img: img('roasted-salted.png'),
    body: [
      'Dry-roast 200 g of W240 in a heavy pan on low heat for six to eight minutes, shaking often, until fragrant and lightly golden.',
      'Off the heat, toss with a teaspoon of coarsely cracked pepper, a pinch of salt and a few curry leaves fried in a little oil.',
      'Cool completely before storing. They are best the same day, and still lovely three days later.',
    ],
  },
  {
    slug: 'from-farm-to-tin', category: 'Behind the scenes', mins: 6, date: '20 Jun 2026', title: 'From farm to tin: the six steps', img: img('step-01.png'),
    body: [
      'Cashew apples ripen on partner farms across Tamil Nadu, and the nut hangs beneath each one. It is picked once the apple falls.',
      'The nuts are sun-dried, steam-cut to free the kernel whole, peeled, and then graded by hand into W180, W240, W320, splits and pieces.',
      'Small batches are roasted, packed the same day and sealed with the date on the tin. Six steps, one roof.',
    ],
  },
  {
    slug: 'raw-vs-roasted-cashews', category: 'Health', mins: 5, date: '8 Jun 2026', title: 'Raw or roasted: which should you buy?', img: img('w240-plain.png'),
    body: [
      'Raw cashews are mild and creamy, and they are the best choice for cooking, grinding and soaking.',
      'Dry-roasted cashews are crunchier and more fragrant, and they are what most people want for snacking.',
      'Oil-roasted and glazed flavours are treats: delicious, but heavier. Pick them for the occasion, and pick raw or dry-roasted for every day.',
    ],
  },
]

export const FEATURED = {
  slug: 'a-day-on-the-grading-floor',
  category: 'Behind the scenes',
  mins: 8,
  date: '1 Sep 2026',
  title: 'A day on the grading floor with Team 3',
  blurb: 'Forty women, six trays each, one rule: if you’re not sure, it goes down a grade.',
  img: img('step-05.png'),
  quote: ['“If you’re not sure, it goes down a grade. Every time.”', 'Selvi, head grader'],
  body: [
    'The shift starts at eight with tea and the day’s trays. Each grader gets six, and each tray holds a few kilos of shelled kernels that have never been sorted.',
    'Hands move faster than eyes. A grader reads size, colour and shape in a glance and drops every kernel into one of a row of bowls: W180, W240, W320, splits, pieces.',
    'The rule is simple: if you are not sure, the nut goes down a grade. That is why a W240 tin from us has so few surprises in it.',
    'By afternoon the trays are weighed, the counts checked against the batch sheet, and the best of the day goes to roasting.',
  ],
}

export const getArticle = (slug) => [FEATURED, ...ARTICLES].find((a) => a.slug === slug)
