import { toast } from '@/lib/toast'

// "PDF" documents without a server: render a clean printable page and let the browser's Save as PDF handle it.
// Tries a new window first; if popups are blocked it prints from a hidden frame instead, and if even that fails
// the shopper gets a message rather than a silent dead button.
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])

function buildHtml(title, sections, note) {
  const body = sections
    .map(({ heading, rows, text }) =>
      [
        heading ? `<h2>${esc(heading)}</h2>` : '',
        text ? `<p>${esc(text)}</p>` : '',
        rows ? `<table>${rows.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table>` : '',
      ].join('')
    )
    .join('')
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>
    body{font:15px/1.5 Manrope,Arial,sans-serif;color:#3a2317;margin:40px}h1{font:600 28px Georgia,serif;margin:0 0 4px}
    .brand{letter-spacing:.3em;font-size:12px;color:#c99a45;font-weight:700;margin-bottom:18px}h2{font:600 18px Georgia,serif;margin:24px 0 8px}
    table{width:100%;border-collapse:collapse}td{padding:7px 0;border-bottom:1px solid #dcccb2}td:last-child{text-align:right;font-family:monospace}
    .note{margin-top:28px;font-size:12px;color:#7a6556}</style></head><body><div class="brand">DURAI CASHEW</div><h1>${esc(title)}</h1>
    ${body}${note ? `<p class="note">${esc(note)}</p>` : ''}</body></html>`
}

function printInHiddenFrame(html) {
  return new Promise((resolve) => {
    const frame = document.createElement('iframe')
    frame.setAttribute('aria-hidden', 'true')
    Object.assign(frame.style, { position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0' })
    frame.onload = () => {
      try {
        frame.contentWindow.focus()
        frame.contentWindow.print()
        resolve(true)
      } catch {
        resolve(false)
      }
      setTimeout(() => frame.remove(), 60000) // keep it around while the print dialog is open
    }
    frame.srcdoc = html
    document.body.appendChild(frame)
    setTimeout(() => resolve(false), 5000) // never hang the caller
  })
}

// Resolves true when a print dialog was opened.
export async function printDocument(title, sections, { note } = {}) {
  const html = buildHtml(title, sections, note)

  const w = window.open('', '_blank', 'width=820,height=900')
  if (w) {
    w.document.write(html.replace('</body>', '<script>window.onload=()=>setTimeout(()=>window.print(),250)</script></body>'))
    w.document.close()
    return true
  }

  if (await printInHiddenFrame(html)) return true
  toast('We couldn’t open the document. Allow pop-ups for this site and try again.')
  return false
}
