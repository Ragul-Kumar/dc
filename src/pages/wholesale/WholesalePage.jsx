import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/Icon'
import { Field, fieldClass } from '@/components/shared/FormField'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { saveEnquiry } from '@/lib/enquiries'
import { CERTIFICATIONS } from '@/data/site'
import { printDocument } from '@/lib/print'
import { cn } from '@/lib/utils'

// Figma 10 · Wholesale (B2B) (39:6605). Specs, MOQs, certifications and capacity are placeholders [confirm].
const AUDIENCES = ['Retailers', 'Sweet shops', 'Hotels', 'Caterers', 'Exporters']
const GRADES = [
  ['W180', '170–180 / lb', 'Moisture ≤ 5% · broken ≤ 5%'],
  ['W210', '200–210 / lb', 'Moisture ≤ 5% · broken ≤ 5%'],
  ['W240', '220–240 / lb', 'Moisture ≤ 5% · broken ≤ 5%'],
  ['W320', '300–320 / lb', 'Moisture ≤ 5% · broken ≤ 5%'],
  ['Splits (JH / S)', 'Halves', 'Moisture ≤ 5%'],
  ['Pieces (LWP / SWP)', 'Broken', 'Moisture ≤ 5%'],
]
const FORMATS = [
  ['brand-tin', '10 kg tins', 'Nitrogen-flushed, standard export format.'],
  ['whl-vac', 'Vacuum packs', '5 kg and 10 kg, for hotels and caterers.'],
  ['brand-tag', 'Private label', 'Your brand on our retail pouches. MOQ applies.'],
]
const MOQ = [
  ['W180', '50 kg', '10 kg tin'],
  ['W240', '50 kg', '10 kg tin'],
  ['W320', '100 kg', '10 kg tin'],
  ['Splits', '100 kg', '10 kg vacuum'],
  ['Pieces', '100 kg', '10 kg vacuum'],
]
const STATS = [
  ['6', 'grades, every lot spec-sheeted'],
  ['Hand', 'graded, tray by tray'],
  ['Batch', 'coded and lab tested'],
  ['GST', 'invoicing on every order'],
]
const BUSINESS = ['Retailer', 'Sweet shop', 'Hotel / restaurant', 'Caterer', 'Exporter', 'Other']
const GRADE_OPTIONS = ['W180', 'W210', 'W240', 'W320', 'Splits', 'Pieces']
const VOLUMES = ['Under 100 kg', '100–250 kg', '250–500 kg', '500 kg+']

export default function WholesalePage() {
  const [sample, setSample] = useState(true)
  const [ref, setRef] = useState("")

  return (
    <>
      <section className="bg-leaf">
        <div className="page-x mx-auto flex max-w-[1440px] flex-col items-center gap-10 py-14 lg:flex-row lg:gap-16 lg:py-20">
          <div className="flex flex-1 flex-col items-start gap-6">
            <p className="eyebrow text-gold">WHOLESALE · B2B</p>
            <h1 className="max-w-[560px] font-display text-[44px] font-semibold leading-[1.1] text-ivory md:text-h1">
              Graded cashews, by the tin.
            </h1>
            <p className="max-w-[520px] text-body-l text-sand">
              For retailers, sweet shops, hotels, caterers and exporters. Consistent grades, spec sheets for every lot, GST
              invoicing.
            </p>
            <div className="flex flex-wrap gap-2">
              {AUDIENCES.map((a) => (
                <span key={a} className="rounded-full border border-ivory/40 px-3.5 py-2 text-[13px] font-medium text-ivory">
                  {a}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <a href="#enquiry">Send an enquiry</a>
              </Button>
              <Button asChild variant="onDark">
                <a href="#enquiry">Request a sample</a>
              </Button>
            </div>
          </div>
          <div className="h-[320px] w-full overflow-hidden rounded-media bg-white md:h-[460px] lg:w-[560px] lg:shrink-0">
            <img src="/assets/images/step-05.png" alt="Graders sorting cashews by hand" className="size-full object-cover" />
          </div>
        </div>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-[88px]">
        <SectionHeading eyebrow="GRADES AVAILABLE" title="Spec sheet for every grade" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {GRADES.map(([name, size, spec]) => (
            <div key={name} className="flex flex-col items-start gap-2.5 rounded-card border border-line bg-white p-6">
              <p className="font-mono text-[22px] font-medium">{name}</p>
              <p className="text-sm font-medium text-muted-foreground">{size}</p>
              <p className="text-[13px] text-muted-foreground">{spec}</p>
              <button
                type="button"
                onClick={() => printDocument(`Spec sheet · ${name}`, [{ rows: [["Grade", name], ["Count", size], ["Specification", spec]] }], { note: "Typical specification; the signed spec sheet for your lot is sent with the sample." })}
                className="mt-1 flex items-center gap-2 text-sm font-bold text-primary underline"
              >
                <Icon name="whl-download" size={16} />
                Spec sheet (PDF)
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-[88px]">
        <SectionHeading eyebrow="PACKAGING" title="Packed for your kitchen or your shelf" />
        <div className="grid gap-6 md:grid-cols-3">
          {FORMATS.map(([icon, title, body]) => (
            <div key={title} className="flex flex-col gap-3 rounded-card bg-white p-7">
              <Icon name={icon} size={32} />
              <h3 className="font-display text-2xl font-semibold">{title}</h3>
              <p className="max-w-[340px] text-[15px] leading-[1.55]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand">
        <div className="page-x mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 py-8">
          <p className="font-display text-2xl font-semibold">Certified &amp; compliant</p>
          {CERTIFICATIONS.map((c) => (
            <span key={c} className="flex items-center gap-2 rounded-full bg-white py-2.5 pl-3 pr-4 text-[13px] font-bold">
              <Icon name="whl-shield" size={18} />
              {c}
            </span>
          ))}
        </div>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-[88px]">
        <SectionHeading eyebrow="MOQ & PRICING" title="Minimums and indicative prices" />
        <div className="overflow-x-auto rounded-card border border-line bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-sand/60 text-muted-foreground">
                {['Grade', 'MOQ', 'Pack', 'Indicative price / kg', 'Enquire'].map((h) => (
                  <th key={h} className="p-4 text-xs font-bold uppercase tracking-[0.12em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOQ.map(([grade, qty, pack]) => (
                <tr key={grade} className="border-t border-line">
                  <td className="p-4 font-bold">{grade}</td>
                  <td className="p-4 font-mono font-medium">{qty}</td>
                  <td className="p-4 font-mono font-medium">{pack}</td>
                  <td className="p-4 font-mono font-medium text-primary">Request price</td>
                  <td className="p-4 font-mono font-medium text-primary">
                    <a href="#enquiry">Request →</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-roast">
        <div className="page-x mx-auto grid max-w-[1440px] grid-cols-2 gap-6 py-[72px] lg:grid-cols-4">
          {STATS.map(([n, l]) => (
            <div key={l} className="flex flex-col gap-1.5">
              <p className="font-display text-[40px] font-semibold leading-none text-ivory md:text-[56px]">{n}</p>
              <p className="text-[15px] text-sand">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="enquiry" className="page-x mx-auto flex max-w-[1440px] scroll-mt-20 flex-col gap-12 py-[88px] lg:flex-row lg:gap-16">
        <div className="flex flex-1 flex-col gap-4">
          <p className="eyebrow">ENQUIRY</p>
          <h2 className="max-w-[420px] font-display text-[36px] font-semibold leading-[1.12] md:text-[48px]">Tell us what you need.</h2>
          <p className="max-w-[400px] text-[17px] leading-[1.6]">
            We reply with a price list and sample option within one working day.
          </p>
        </div>

        <form
          className="flex w-full flex-col gap-4 rounded-media bg-white p-6 md:p-10 lg:w-[700px] lg:shrink-0"
          onSubmit={(e) => {
            e.preventDefault()
            setRef(saveEnquiry("wholesale-enquiry", e.currentTarget))
          }}
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            <Field label="Business name">
              <input name="business" required className={fieldClass} placeholder="Sri Murugan Sweets" />
            </Field>
            <Field label="Business type">
              <select name="type" className={fieldClass} defaultValue={BUSINESS[1]}>
                {BUSINESS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Field label="GST number">
              <input name="gst" className={cn(fieldClass, "font-mono")} placeholder="33ABCDE1234F1Z5" />
            </Field>
            <Field label="City / pincode">
              <input name="city" required className={fieldClass} placeholder="Madurai · 625001" />
            </Field>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Field label="Grades needed">
              <select name="grades" className={fieldClass} defaultValue="W240">
                {GRADE_OPTIONS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </Field>
            <Field label="Monthly volume">
              <select name="volume" className={fieldClass} defaultValue={VOLUMES[1]}>
                {VOLUMES.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Phone (WhatsApp)">
            <input name="phone" required type="tel" className={cn(fieldClass, "font-mono")} placeholder="+91 98xxx xxxxx" />
          </Field>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium">
            <input name="sample" type="checkbox" checked={sample} onChange={(e) => setSample(e.target.checked)} className="sr-only" />
            <span className={cn('flex size-[18px] shrink-0 items-center justify-center rounded-[4px] border', sample ? 'border-leaf bg-leaf text-ivory' : 'border-roast bg-white')}>
              {sample && <Check className="size-3" strokeWidth={3} />}
            </span>
            Send me a 250 g sample of each grade (₹299, adjusted on first order)
          </label>
          {ref ? (
            <p role="status" className="rounded-input bg-mint p-3 text-sm font-medium text-leaf">
              Nandri! Your enquiry is in (reference {ref}) — expect a price list within one working day.
            </p>
          ) : (
            <Button type="submit" className="self-start">
              Send enquiry
            </Button>
          )}
        </form>
      </section>
    </>
  )
}
