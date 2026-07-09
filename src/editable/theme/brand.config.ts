import { siteIdentity } from '@/config/site.identity'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'

const { recipe } = getFactoryState()
const productKind = getProductKind(recipe)

// Monochrome, editorial-studio palette (Vantis-inspired). The "accent" is
// contrast reversal (black on off-white) rather than a saturated hue, so we
// point primary at ink and keep surface bright.
export const slot4BrandConfig = {
  siteName: siteIdentity.name,
  tagline: siteIdentity.tagline,
  domain: siteIdentity.domain,
  baseUrl: siteIdentity.url,
  productKind,
  ogImage: siteIdentity.ogImage,
  accents: {
    primary: '#000000',
    surface: '#ffffff',
  },
} as const
