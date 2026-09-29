export const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

export const perHundred = (price, grams) => '₹' + +((price / grams) * 100).toFixed(1) + ' / 100 g'

export const grams = (g) => (g >= 1000 ? `${g / 1000} kg` : `${g} g`)

// "Fri, 2 Oct" — delivery estimate a few days out
export const deliveryDate = (daysAhead = 3) => {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

export const shortAddress = (a) => `${a.name} · ${a.line1}, ${a.area}, ${a.city} ${a.pincode}`
