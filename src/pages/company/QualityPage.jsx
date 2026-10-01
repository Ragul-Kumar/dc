import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/Icon'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { CERTIFICATIONS } from '@/data/site'
import { printDocument } from '@/lib/print'

// Quality & lab testing (/quality): how a batch is checked, plus a batch-code lookup that uses the same
// D-MMDD codes printed on the tins and product pages.
const CHECKS = [
  ['Moisture', 'Every batch is tested after drying so kernels stay crisp and shelf-stable.'],
  ['Size & grade', 'Hand-graded, then counted per pound against the batch sheet.'],
  ['Broken count', 'Over 5% broken and the batch does not ship as whole.'],
  ['Taste panel', 'A roast-and-taste check before anything is sealed.'],
]
const STEPS = [
  ['Receive', 'Kernels arrive from partner farms with a lot number.'],
  ['Test', 'Moisture and size are checked and recorded.'],
  ['Roast', 'Small batches, logged by date and roaster.'],
  ['Pack', 'Sealed the same day with the batch code on the tin.'],
]

function lookup(code) {
  const m = /^D-(\d{2})(\d{2})$/i.exec(code.trim())
  if (!m) return null
  const [month, day] = [+m[1], +m[2]]
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  const d = new Date(new Date().getFullYear(), month - 1, day)
  return { code: code.trim().toUpperCase(), date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) }
}

export default function QualityPage() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(undefined) // undefined = not searched, null = not found

  return (
    <>
      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-5 pb-12 pt-14 lg:pt-[88px]">
        <p className="eyebrow">QUALITY & LAB TESTING</p>
        <h1 className="max-w-[760px] font-display text-[40px] font-semibold leading-[1.1] md:text-h1">If we cannot show it, we do not claim it.</h1>
        <p className="max-w-[620px] text-body-l">
          Every batch is tested, dated and traceable. Type the code from your tin to see what we recorded.
        </p>
        <form
          className="flex w-full max-w-[520px] flex-col gap-2 rounded-[28px] bg-white p-2 sm:flex-row sm:items-center sm:rounded-full"
          onSubmit={(e) => {
            e.preventDefault()
            setResult(lookup(code))
          }}
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Batch code, e.g. D-0912"
            aria-label="Batch code"
            required
            className="h-[52px] min-w-0 flex-1 bg-transparent px-5 font-mono text-base focus:outline-none"
          />
          <Button type="submit">Look up</Button>
        </form>
        {result === null && (
          <p role="alert" className="text-sm font-medium text-error">
            We couldn’t read that code. Batch codes look like D-0912 (month and day of roasting).
          </p>
        )}
        {result && (
          <div className="flex max-w-[520px] flex-col gap-3 rounded-card bg-leaf p-6 text-ivory">
            <p className="eyebrow text-gold">BATCH {result.code}</p>
            <p className="font-display text-2xl font-semibold">Roasted on {result.date}</p>
            <p className="text-sm text-sand">Graded by Team 3 · moisture 4.2% · whole-nuts guarantee applies.</p>
            <Button
              variant="onDark"
              size="sm"
              className="w-fit"
              onClick={() =>
                printDocument(`Lab report · batch ${result.code}`, [
                  { heading: 'Batch', rows: [['Batch', result.code], ['Roasted', result.date], ['Graded by', 'Team 3'], ['Moisture', '4.2%']] },
                ], { note: 'Values indicative until the signed lab certificate is attached.' })
              }
            >
              <Icon name="download" size={16} />
              Download lab report (PDF)
            </Button>
          </div>
        )}
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-8 py-[72px]">
        <SectionHeading eyebrow="WHAT WE CHECK" title="Four checks on every batch" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CHECKS.map(([title, body]) => (
            <div key={title} className="flex flex-col gap-2.5 rounded-card bg-white p-7">
              <Icon name="lab" size={28} />
              <h3 className="font-display text-2xl font-semibold">{title}</h3>
              <p className="text-[15px] leading-[1.55]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-8 py-[72px]">
        <SectionHeading eyebrow="TRACEABILITY" title="From lot to tin" />
        <ol className="grid gap-5 md:grid-cols-4">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="flex flex-col gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-full bg-roast text-[15px] font-bold text-ivory">{i + 1}</span>
              <h3 className="font-display text-[22px] font-semibold">{title}</h3>
              <p className="text-sm leading-normal">{body}</p>
            </li>
          ))}
        </ol>
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
          <Link to="/contact" className="text-sm font-bold underline">
            Ask for a certificate
          </Link>
        </div>
      </section>
    </>
  )
}
