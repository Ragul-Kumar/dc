import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Icon } from '@/components/shared/Icon'
import { CheckoutLayout, SummaryCard } from '@/components/checkout/CheckoutLayout'
import { SummaryItems } from '@/components/checkout/SummaryItems'
import { PriceLines } from '@/components/checkout/PriceLines'
import { PincodeNotServiceable } from '@/components/checkout/states/CheckoutStates'
import { useCart } from '@/context/CartContext'
import { SAVED_ADDRESSES } from '@/data/products'
import { lookupPincode } from '@/lib/pincode'
import { cn } from '@/lib/utils'

const emptyAddress = { name: '', pincode: '', city: '', district: '', state: '', line1: '', line2: '', landmark: '', notes: '' }

// Figma "16c · Checkout — Delivery details" (26:3627)
export default function DeliveryPage() {
  const cart = useCart()
  const navigate = useNavigate()
  const { checkout, updateCheckout, lines, count, totals, coupon } = cart
  const [addr, setAddr] = useState(checkout.newAddress ?? emptyAddress)
  const [errors, setErrors] = useState({})

  if (lines.length === 0) return <Navigate to="/checkout/cart" replace />

  const isNew = checkout.addressId === 'new'
  const pin = lookupPincode(addr.pincode)
  const set = (patch) => updateCheckout(patch)
  const clearErrors = (...keys) => setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => !keys.includes(k))))
  const setGift = (patch) => {
    set({ gift: { ...checkout.gift, ...patch } })
    clearErrors('recipient')
  }
  const setGst = (patch) => {
    set({ gst: { ...checkout.gst, ...patch } })
    clearErrors('gstin')
  }

  // every keystroke is written back to the cart state, so leaving and returning keeps the form
  const change = (patch) => {
    const next = { ...addr, ...patch }
    setAddr(next)
    set({ newAddress: { ...next, id: 'new', label: 'New', area: next.line2 || next.district } })
    clearErrors(...Object.keys(patch))
  }

  const setPincode = (value) => {
    const pincode = value.replace(/\D/g, '').slice(0, 6)
    const info = lookupPincode(pincode)
    if (info.place) change({ pincode, city: info.place.city, district: info.place.district, state: info.place.state })
    // the previous pincode had auto-filled the place and this one doesn't match: clear it so stale values can't be saved
    else if (pin.place) change({ pincode, city: '', district: '', state: '' })
    else change({ pincode })
  }

  const validate = () => {
    const e = {}
    if (isNew) {
      if (!addr.name.trim()) e.name = 'Enter the recipient’s full name'
      if (!pin.valid) e.pincode = 'Enter a 6-digit pincode'
      else if (!pin.serviceable) e.pincode = 'unserviceable'
      if (!addr.city.trim()) e.city = 'Required'
      if (!addr.state.trim()) e.state = 'Required'
      if (!addr.line1.trim()) e.line1 = 'Enter house number and street'
    }
    if (checkout.email.trim() && !/^\S+@\S+\.\S+$/.test(checkout.email.trim())) e.email = 'Enter a valid email address'
    if (checkout.gift.enabled && !checkout.gift.recipient.trim()) e.recipient = 'Who is the gift for?'
    if (checkout.gst.enabled && !/^[0-9A-Z]{15}$/i.test(checkout.gst.gstin)) e.gstin = 'GSTIN is 15 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validate()) return
    navigate('/checkout/payment')
  }

  // earliest delivery date offered (3 days out), as yyyy-mm-dd for the date input
  const minDate = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    return d.toISOString().slice(0, 10)
  })()

  return (
    <CheckoutLayout
      step={1}
      main={
        <>
          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-[18px] pt-[18px]">
              <Field label="Mobile number" htmlFor="mobile" hint="We send one OTP the first time only. Order updates come here.">
                <div className="flex h-12 items-center justify-between rounded-input border border-line bg-white px-3.5">
                  <output id="mobile" className="font-mono text-[15px]">{checkout.mobile}</output>
                  <span className="flex items-center gap-1 text-xs font-bold text-success">
                    <Icon name="check-green" size={14} />
                    Verified
                  </span>
                </div>
              </Field>
              <Field label="Email for invoice" optional htmlFor="email" error={errors.email}>
                <Input
                  id="email"
                  type="email"
                  value={checkout.email}
                  onChange={(e) => {
                    set({ email: e.target.value })
                    clearErrors('email')
                  }}
                  placeholder="you@email.com"
                />
              </Field>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery address</CardTitle>
              {!isNew && (
                <button onClick={() => set({ addressId: 'new' })} className="text-[13px] font-bold text-primary underline">
                  + Add new address
                </button>
              )}
            </CardHeader>
            <CardContent className="flex flex-col gap-[18px] pt-[18px]">
              <RadioGroup
                value={checkout.addressId}
                onValueChange={(v) => set({ addressId: v })}
                className="grid gap-3 sm:grid-cols-2"
              >
                {cart.allAddresses.map((a) => (
                  <AddressOption key={a.id} value={a.id} selected={checkout.addressId === a.id} label={a.label}>
                    {a.name} · {a.line1}, {a.area}, {a.city} {a.pincode}
                  </AddressOption>
                ))}
                <AddressOption value="new" selected={isNew} label="New address" className="sm:col-span-2">
                  Deliver somewhere else
                </AddressOption>
              </RadioGroup>

              {isNew && (
                <div className="flex flex-col gap-[18px]">
                  <p className="text-[11px] font-bold tracking-[0.12em] text-muted-foreground">NEW ADDRESS — PINCODE FIRST</p>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <Field
                      label="Pincode"
                      htmlFor="pincode"
                      className="col-span-2 md:col-span-1"
                      error={errors.pincode !== 'unserviceable' && errors.pincode}
                    >
                      <Input
                        id="pincode"
                        inputMode="numeric"
                        value={addr.pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="600040"
                        aria-invalid={!!errors.pincode || (pin.valid && !pin.serviceable)}
                        className={cn(
                          'font-mono',
                          (errors.pincode || (pin.valid && !pin.serviceable)) && 'border-[1.5px] border-error'
                        )}
                      />
                    </Field>
                    {['city', 'district', 'state'].map((k) => (
                      <Field key={k} label={k[0].toUpperCase() + k.slice(1)} auto={!!pin.place} htmlFor={k} error={errors[k]}>
                        <Input
                          id={k}
                          value={addr[k]}
                          disabled={!!pin.place}
                          onChange={(e) => change({ [k]: e.target.value })}
                        />
                      </Field>
                    ))}
                  </div>
                  {!errors.pincode && !(pin.valid && !pin.serviceable) && (
                    <p className="-mt-3 text-xs text-muted-foreground">City, district and state fill in automatically</p>
                  )}
                  {pin.valid && !pin.serviceable && (
                    <PincodeNotServiceable pincode={addr.pincode} onChange={() => set({ addressId: 'home' })} />
                  )}

                  <Field label="Full name" htmlFor="name" error={errors.name}>
                    <Input id="name" value={addr.name} onChange={(e) => change({ name: e.target.value })} />
                  </Field>
                  <Field label="Address line 1" htmlFor="line1" error={errors.line1}>
                    <Input
                      id="line1"
                      value={addr.line1}
                      onChange={(e) => change({ line1: e.target.value })}
                      placeholder="House no., street"
                    />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Address line 2" optional htmlFor="line2">
                      <Input
                        id="line2"
                        value={addr.line2}
                        onChange={(e) => change({ line2: e.target.value })}
                        placeholder="Flat / floor"
                      />
                    </Field>
                    <Field label="Landmark" optional htmlFor="landmark">
                      <Input
                        id="landmark"
                        value={addr.landmark}
                        onChange={(e) => change({ landmark: e.target.value })}
                      />
                    </Field>
                  </div>
                  <Field label="Delivery instructions" optional htmlFor="notes">
                    <Input
                      id="notes"
                      value={addr.notes}
                      onChange={(e) => change({ notes: e.target.value })}
                      placeholder="e.g. Leave with security"
                    />
                  </Field>
                  <CheckRow
                    id="save-address"
                    checked={checkout.saveAddress}
                    onChange={(v) => set({ saveAddress: v })}
                    label="Save this address for future orders"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery date */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery date</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-[18px]">
              <Field label="Preferred date" optional htmlFor="delivery-date" hint="Leave empty for the earliest delivery. Gifts for a festival? Pick the day it should arrive.">
                <Input
                  id="delivery-date"
                  type="date"
                  min={minDate}
                  value={checkout.deliveryDate}
                  onChange={(e) => set({ deliveryDate: e.target.value })}
                  className="max-w-[240px] font-mono"
                />
              </Field>
            </CardContent>
          </Card>

          {/* Gift */}
          <Card>
            <CardHeader>
              <CardTitle>Send as a gift</CardTitle>
              <Switch
                checked={checkout.gift.enabled}
                onCheckedChange={(v) => setGift({ enabled: v })}
                aria-label="Send as a gift"
              />
            </CardHeader>
            <CardContent className="flex flex-col gap-[18px] pt-[18px]">
              <p className="text-sm text-muted-foreground">We’ll hide prices and add your message on a card.</p>
              <CheckRow
                id="gift-wrap"
                checked={checkout.gift.wrap}
                onChange={(v) => setGift({ wrap: v })}
                label="Add gift wrap and a handwritten note (+₹49)"
              />
              {checkout.gift.enabled && (
                <>
                  <Field label="Gift message" htmlFor="gift-msg">
                    <textarea
                      id="gift-msg"
                      rows={2}
                      value={checkout.gift.message}
                      maxLength={200}
                      onChange={(e) => setGift({ message: e.target.value })}
                      placeholder="Happy Deepavali, Amma!"
                      className="min-h-[72px] w-full rounded-input border border-line bg-white px-3.5 py-3 text-[15px] outline-none focus:border-roast"
                    />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Recipient name" htmlFor="recipient" error={errors.recipient}>
                      <Input
                        id="recipient"
                        value={checkout.gift.recipient}
                        onChange={(e) => setGift({ recipient: e.target.value })}
                      />
                    </Field>
                    <Field label="Recipient phone" htmlFor="recipient-phone">
                      <Input
                        id="recipient-phone"
                        inputMode="tel"
                        className="font-mono"
                        value={checkout.gift.phone}
                        onChange={(e) => setGift({ phone: e.target.value })}
                        placeholder="+91"
                      />
                    </Field>
                  </div>
                  <CheckRow
                    id="hide-prices"
                    checked={checkout.gift.hidePrices}
                    onChange={(v) => setGift({ hidePrices: v })}
                    label="Hide prices on the invoice"
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* GST */}
          <Card>
            <CardHeader>
              <CardTitle>Need a GST invoice?</CardTitle>
              <Switch
                checked={checkout.gst.enabled}
                onCheckedChange={(v) => setGst({ enabled: v })}
                aria-label="Need a GST invoice"
              />
            </CardHeader>
            <CardContent className="flex flex-col gap-[18px] pt-[18px]">
              <p className="text-sm text-muted-foreground">Turn on to add your GSTIN and company name.</p>
              {checkout.gst.enabled && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="GSTIN" htmlFor="gstin" error={errors.gstin}>
                    <Input
                      id="gstin"
                      className="font-mono uppercase"
                      value={checkout.gst.gstin}
                      onChange={(e) => setGst({ gstin: e.target.value.toUpperCase() })}
                      maxLength={15}
                    />
                  </Field>
                  <Field label="Company name" htmlFor="company">
                    <Input id="company" value={checkout.gst.company} onChange={(e) => setGst({ company: e.target.value })} />
                  </Field>
                </div>
              )}
            </CardContent>
          </Card>

          <CheckRow
            id="whatsapp"
            checked={checkout.whatsapp}
            onChange={(v) => set({ whatsapp: v })}
            label="Send order updates on WhatsApp"
          />
        </>
      }
      aside={
        <>
          <SummaryCard>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold">Order summary</h2>
              <Link to="/checkout/cart" className="text-[13px] font-bold text-primary underline">
                Edit cart
              </Link>
            </div>
            <SummaryItems lines={lines} />
            <Separator />
            <PriceLines totals={totals} count={count} coupon={coupon} />
            <Button variant="gold" className="h-14 w-full text-base text-night" onClick={next}>
              Continue to payment
            </Button>
          </SummaryCard>
          <WhyShop />
        </>
      }
    />
  )
}

function Field({ label, optional, auto, hint, error, htmlFor, className, children }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center gap-2">
        <Label htmlFor={htmlFor}>{label}</Label>
        {optional && <span className="text-xs text-muted-foreground">Optional</span>}
        {auto && <span className="rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold text-leaf">AUTO</span>}
      </div>
      {children}
      {error ? (
        <p className="text-xs font-medium text-error" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}

function CheckRow({ id, checked, onChange, label }) {
  return (
    <div className="flex items-center gap-2.5">
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(!!v)} className="size-[18px]" />
      <Label htmlFor={id} className="cursor-pointer text-sm font-medium">
        {label}
      </Label>
    </div>
  )
}

function AddressOption({ value, selected, label, children, className }) {
  return (
    <label
      htmlFor={`addr-${value}`}
      className={cn(
        'flex cursor-pointer flex-col gap-1.5 rounded-2xl p-4',
        selected ? 'border-[1.5px] border-roast bg-ivory' : 'border border-line bg-white',
        className
      )}
    >
      <span className="flex items-center gap-2">
        <RadioGroupItem id={`addr-${value}`} value={value} />
        <Icon name="home" size={16} />
        <span className="text-sm font-bold">{label}</span>
      </span>
      <span className="text-[13px] leading-normal">{children}</span>
    </label>
  )
}

function WhyShop() {
  const rows = [
    ['lab-sm', 'Lab tested, every batch'],
    ['leaf-trust', 'Freshly roasted — date on every tin'],
    ['shield', 'Whole nuts guarantee'],
    ['return', 'Easy 7-day returns'],
  ]
  return (
    <div className="flex flex-col gap-3 rounded-card bg-sand p-6">
      <p className="text-[15px] font-bold">Why shop with us</p>
      {rows.map(([icon, text]) => (
        <p key={text} className="flex items-center gap-2.5 text-sm">
          <Icon name={icon} size={18} />
          {text}
        </p>
      ))}
    </div>
  )
}
