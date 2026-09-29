import { Hero } from './sections/Hero'
import { ShopByMood } from './sections/ShopByMood'
import { Bestsellers } from './sections/Bestsellers'
import { GradeStory } from './sections/GradeStory'
import { TreeToTin } from './sections/TreeToTin'
import { FreshnessPromise } from './sections/FreshnessPromise'
import { GiftingSpotlight } from './sections/GiftingSpotlight'
import { People } from './sections/People'
import { Reviews } from './sections/Reviews'
import { JournalTeaser } from './sections/JournalTeaser'
import { SubscribeBanner } from './sections/SubscribeBanner'
import { Newsletter } from './sections/Newsletter'

// Figma "02 · Home" (14:2), sections in order
export default function HomePage() {
  return (
    <>
      <Hero />
      <ShopByMood />
      <Bestsellers />
      <GradeStory />
      <TreeToTin />
      <FreshnessPromise />
      <GiftingSpotlight />
      <People />
      <Reviews />
      <JournalTeaser />
      <SubscribeBanner />
      <Newsletter />
    </>
  )
}
