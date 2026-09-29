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
