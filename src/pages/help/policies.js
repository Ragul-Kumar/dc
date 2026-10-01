// Figma 19 · "Policy page template" — Shipping is written out in the design; the others reuse the template
// with placeholder copy [confirm with legal].
export const POLICIES = [
  {
    slug: 'shipping',
    title: 'Shipping',
    heading: 'Shipping policy',
    updated: 'Last updated 24 Sep 2026 · 3 min read',
    sections: [
      ['Where we ship', 'We deliver across India through our courier partners. Enter your pincode on any product page to see the exact delivery date.'],
      ['Dispatch time', 'Orders placed before 2 pm ship the same working day. Tins are packed after roasting, so each carries its roast date.'],
      ['Delivery charges', 'Free above ₹999. Below that, a flat ₹49. Subscriptions always ship free.'],
      ['Damaged in transit', 'Send a photo on WhatsApp within 48 hours of delivery and we will replace the tin.'],
    ],
  },
  {
    slug: 'returns',
    title: 'Returns & refunds',
    heading: 'Returns & refunds',
    updated: 'Last updated 24 Sep 2026 · 2 min read',
    sections: [
      ['7 days, no questions', 'If you are not happy with a sealed tin, tell us within 7 days of delivery and we will arrange a return or replacement.'],
      ['Whole nuts guarantee', 'If the broken count in a tin is above 5%, we replace it.'],
      ['Refunds', 'Refunds go back to your original payment method in 5–7 working days.'],
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy',
    heading: 'Privacy policy',
    updated: 'Last updated 24 Sep 2026 · 4 min read',
    sections: [
      ['What we collect', 'Your name, delivery address, phone number and email, so we can deliver your order and send updates.'],
      ['How we use it', 'Only to fulfil orders, answer your messages and — if you opt in — send offers on email or WhatsApp. We do not sell your data.'],
      ['Your choices', 'Write to us any time to see, correct or delete your information.'],
    ],
  },
  {
    slug: 'terms',
    title: 'Terms of service',
    heading: 'Terms of service',
    updated: 'Last updated 24 Sep 2026 · 5 min read',
    sections: [
      ['Using this site', 'By placing an order you agree to these terms. Prices are in rupees and include GST.'],
      ['Orders', 'We may cancel an order if an item is out of stock or the delivery address cannot be served; you will be refunded in full.'],
      ['Contact', 'Questions about these terms? Reach us on the Contact page.'],
    ],
  },
]

export const getPolicy = (slug) => POLICIES.find((p) => p.slug === slug)
