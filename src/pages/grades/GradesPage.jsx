import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { gradeFromPer100 } from '@/data/products'
import { GRADES } from '@/pages/home/sections/GradeStory'
import { cn } from '@/lib/utils'

// Grade guide (/grades): what the W-numbers mean, a quick "which grade?" picker and a side-by-side table.
// Prices come from the live catalogue; grades we don't sell online say so.
const QUESTIONS = [
  {
    q: 'What is it for?',
    options: [
      ['Snacking & gifting', { W180: 2, W240: 2, W320: 0 }],
      ['Everyday cooking', { W320: 3, W240: 1 }],
      ['Sweets & grinding', { Splits: 3, Pieces: 2, W320: 1 }],
    ],
  },
  {
    q: 'How much does the look of the nut matter?',
    options: [
      ['A lot — it is a gift', { W180: 3, W210: 2 }],
      ['A little', { W240: 2, W210: 1 }],
      ['Not at all', { W320: 2, Splits: 1, Pieces: 1 }],
    ],
  },
  {
    q: 'Budget per 100 g?',
    options: [
      ['Premium is fine', { W180: 2, W210: 1 }],
      ['Mid-range', { W240: 2 }],
      ['Best value', { W320: 3, Splits: 2, Pieces: 2 }],
    ],
  },
]

const fromText = (id) => {
  const v = gradeFromPer100(id)
  return v ? `₹${+v.toFixed(1)} / 100 g` : 'Wholesale on request'
}

export default function GradesPage() {
  const [answers, setAnswers] = useState([])
  const done = answers.length === QUESTIONS.length
  const scores = {}
  answers.forEach((a, i) => Object.entries(QUESTIONS[i].options[a][1]).forEach(([g, n]) => (scores[g] = (scores[g] ?? 0) + n)))
  const best = done ? Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] : null
  const pick = GRADES.find((g) => g.id === best)

  return (
    <>
      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-6 pb-12 pt-14 lg:pt-[88px]">
        <p className="eyebrow">GRADE GUIDE</p>
        <h1 className="max-w-[760px] font-display text-[40px] font-semibold leading-[1.1] md:text-h1">W180, W240, W320 — what do the numbers mean?</h1>
        <p className="max-w-[640px] text-body-l">
          The number is how many whole kernels it takes to make a pound. Fewer nuts per pound means bigger nuts. Two minutes to find yours.
        </p>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-8 py-12 lg:flex-row">
        <div className="flex flex-1 flex-col gap-6 rounded-card bg-white p-8">
          <SectionHeading eyebrow="WHICH GRADE?" title="Three quick questions" />
          {QUESTIONS.map((item, i) => (
            <fieldset key={item.q} className={cn('flex flex-col gap-3', i > answers.length && 'opacity-40')} disabled={i > answers.length}>
              <legend className="mb-3 text-[15px] font-bold">
                {i + 1}. {item.q}
              </legend>
              <div className="flex flex-wrap gap-2">
                {item.options.map(([label], o) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={answers[i] === o}
                    onClick={() => setAnswers((a) => [...a.slice(0, i), o])}
                    className={cn(
                      'rounded-full border px-5 py-2.5 text-sm font-medium',
                      answers[i] === o ? 'border-roast bg-roast text-ivory' : 'border-line bg-white hover:border-roast'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="flex w-full flex-col justify-center gap-4 rounded-card bg-roast p-8 text-ivory lg:w-[420px] lg:shrink-0">
          {done && pick ? (
            <>
              <p className="eyebrow text-gold">YOUR GRADE</p>
              <h2 className="font-display text-[34px] font-semibold">{pick.name}</h2>
              <p className="leading-[1.6] text-sand">{pick.body}</p>
              <p className="font-mono text-sm text-gold">{fromText(pick.id)}</p>
              <div className="flex flex-wrap gap-3">
                {gradeFromPer100(pick.id) !== null ? (
                  <Button asChild>
                    <Link to={`/shop?grade=${pick.id}`}>Shop {pick.id}</Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to="/wholesale">Ask about wholesale</Link>
                  </Button>
                )}
                <Button variant="onDark" onClick={() => setAnswers([])}>
                  Start again
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="eyebrow text-gold">YOUR GRADE</p>
              <p className="font-display text-[28px] font-semibold leading-[1.2]">Answer the questions and we’ll point you to the right nut.</p>
            </>
          )}
        </div>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-8 py-[72px]">
        <SectionHeading eyebrow="SIDE BY SIDE" title="Every grade, compared" />
        <div className="overflow-x-auto rounded-card border border-line bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="bg-sand/60 text-muted-foreground">
                {['Grade', 'Size', 'Nuts per 100 g', 'Nuts per lb', 'Best for', 'From'].map((h) => (
                  <th key={h} className="p-4 text-xs font-bold uppercase tracking-[0.12em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GRADES.map((g) => (
                <tr key={g.id} className="border-t border-line">
                  <td className="p-4 font-mono font-medium">
                    {g.id} <span className="font-sans text-muted-foreground">{g.tag}</span>
                  </td>
                  <td className="p-4 font-mono">{g.label}</td>
                  <td className="p-4 font-mono">{g.per100}</td>
                  <td className="p-4 font-mono">{g.perLb}</td>
                  <td className="p-4">{g.best}</td>
                  <td className="p-4 font-mono">
                    {gradeFromPer100(g.id) !== null ? (
                      <Link to={`/shop?grade=${g.id}`} className="font-bold text-primary underline">
                        {fromText(g.id)}
                      </Link>
                    ) : (
                      fromText(g.id)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
