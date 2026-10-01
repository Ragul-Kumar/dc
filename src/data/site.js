// Single place for contact details and links. Anything left empty is hidden in the UI instead of showing a placeholder —
// fill these in when the real details are confirmed.
export const SITE = {
  phone: '', // e.g. '+91 98xxx xxxxx'
  whatsapp: '', // digits with country code, e.g. '919800000000'
  email: 'hello@duraicashew.in',
  address: '', // factory & shop street address
  fssai: '',
  social: {
    instagram: 'https://www.instagram.com/duraicashew',
    facebook: 'https://www.facebook.com/duraicashew',
    youtube: 'https://www.youtube.com/@duraicashew',
  },
}

// wa.me deep link (opens WhatsApp; without a configured number it opens the chooser)
export const whatsappUrl = (text = '') =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`

// Certifications shown on the wholesale page — only list ones that are confirmed
export const CERTIFICATIONS = ['GST registered']
