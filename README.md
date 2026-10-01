# Durai Cashew — storefront

React 18 + Vite + Tailwind CSS 3 + shadcn/ui (Radix). Built from Figma `draft-1`, Section 1.
Build plan and progress: [docs/FLOWCHART.md](docs/FLOWCHART.md).

## Run

Requires Node 18+.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Routes

| Route | Figma |
|---|---|
| `/` | 02 · Home (cart drawer 16a opens from the bag icon or any Quick add; `/#cart` opens it directly) |
| `/checkout/cart` | 16b · Checkout — Cart |
| `/checkout/delivery` | 16c · Delivery details |
| `/checkout/payment` | 16d · Payment |
| `/order/confirmed` | 16e · Order confirmed |
| `/dev/states` | 16f · Checkout states, side by side for design QA |

## Structure

```
src/
  components/
    ui/          shadcn/ui primitives (button, card, sheet, dialog, select, radio-group, switch, …)
    shared/      brand pieces: Logo, Icon, ProductCard, QtyStepper, SectionHeading, ProductThumb
    layout/      OfferBar, Header, Footer, CheckoutHeader, SiteLayout
    cart/        CartDrawer, FreeDeliveryBar, UpsellCard
    checkout/    CheckoutLayout, CheckoutStepper, PriceLines, SummaryItems, states/
  context/       CartContext (cart, coupon, checkout form, order — persisted to localStorage)
  data/          products, coupons, thresholds, saved addresses
  lib/           cn(), formatting, pincode lookup
  pages/         home/ (+ sections/), checkout/, dev/
public/assets/   icons + images exported from Figma
```

Design tokens live in `tailwind.config.js` (brand colours, fonts, radii) and `src/index.css`
(shadcn CSS variables mapped to the brand palette).

## Demo behaviour (until real APIs exist)

- Coupons: `DIWALI100` (₹100 off + free delivery), `PONGAL50` (expired).
- Free delivery above ₹999, otherwise ₹49 — `src/data/products.js`.
- Pincodes starting `79` are not serviceable; `600…`, `641…`, `560…` etc. auto-fill city/state.
- W180 King Whole 1 kg is marked sold out to show the out-of-stock swap.
- UPI: any UPI ID containing `fail` simulates a declined payment. COD asks for a 4-digit OTP.
- Card / netbanking / wallet simulate the gateway — wire Razorpay or Cashfree in `PaymentPage.jsx`.

Anything marked `[confirm]` is placeholder copy carried over from the Figma.

## Phase 2 routes

| Route | Figma |
|---|---|
| `/shop`, `/shop/:id` | 03 · Shop all, 04 · Product page |
| `/subscribe` | 06 · Subscribe and save |
| `/gifting`, `/gifting/build`, `/gifting/corporate` | 07 · Gifting hub, 08 · Gift box builder, 09 · Corporate gifting |
| `/wholesale` | 10 · Wholesale (B2B) |
| `/our-story` | 11 · Our story |
| `/journal`, `/journal/:slug` | 13 · Cashew Journal, 14 · Journal article |
| `/contact` | 15 · Contact |
| `/account`, `/track-order` | 17 · Account, 18 · Track order |
| `/faq`, `/policies/:slug` | 19 · FAQ and policies |

Forms (quote, wholesale enquiry, contact, subscription start) acknowledge on screen only — no backend yet.
Gift boxes and builder boxes are added to the cart as custom lines (`addCustom` in `CartContext`).

## Configuration & demo behaviour (after QA)

- `src/data/site.js` — phone, WhatsApp number, address, FSSAI no., social links, certifications. Anything left empty is
  hidden (no placeholder text on screen). Fill these in before launch.
- Coupons: `DIWALI100` (₹100 off + free delivery, min ₹499), `FIRST10` (10% off up to ₹150, min ₹299), `PONGAL50` (expired).
- Subscribe on a product page adds the pack at 10% off ("every 4 wk" on the line); gift wrap adds ₹49 once per order;
  the product page's Tasting Trio adds 3 × 100 g packs and gets 15% off when all three are in the cart; 25+ gift boxes
  get 5% off and 50+ get 10% (corporate per-box prices are quoted, not applied in the cart).
- Forms (corporate quote, wholesale, contact, careers, newsletter) are saved on this device (`durai-enquiries-v1`) and
  acknowledged with a reference — wire them to an endpoint in `src/lib/enquiries.js`.
- Reviews written on a product page are kept on this device. COD demo OTP is `1234`.
- "PDF" downloads (invoice, catalogue, spec sheets, lab report) open a printable page — use Save as PDF.
- Track order: your own orders (placed on this device) track from their real timestamps; `DC-10482` is a sample shipment.
- Deploying: `public/_redirects` (Netlify) and `vercel.json` rewrite deep links to `index.html`.
