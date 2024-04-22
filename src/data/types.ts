import { Route } from '../routers/types'

//  ######  CustomLink  ######## //
export interface CustomLink {
  label: string
  href: Route
  targetBlank?: boolean
}

export interface ITags {
  title: string
  slug: string
  desc?: string
  count?: number
}

export type TwMainColor =
  | 'pink'
  | 'green'
  | 'yellow'
  | 'red'
  | 'indigo'
  | 'blue'
  | 'purple'
  | 'gray'

export type AlertType = 'default' | 'warning' | 'info' | 'success' | 'error'

export interface IDynamicComponent {
  id: number
  __component: string
  content: any
}

export interface IPagination {
  page: number
  pageCount: number
  pageSize: number
  total: number
  hasNextPage?: boolean
}

export interface WLShopsBasicProps {
  type: string
  shop_id: string
  name: string
  email: string
  domain: string
  date: Date | null
  access_token: string | null
  charge_id: number | null
  connected: boolean
  active: boolean
  sync: string
  member_id: number
  member_name: string | null
  member_email: string | null
  createdAt: Date
  updatedAt: Date
  publishedAt: Date
  shop_info: {
    id: number
    shop_owner: string
    phone: number | null
    currency: string | null
    shop_created_at: Date
    shop_updated_at: Date
  }
  address: {
    id: number
    address1: string | null
    address2: string | null
    city: string | null
    province: string | null
    province_name: string | null
    country: string | null
    country_code: string | null
    country_name: string | null
    zip: string | null
    address_id: number | null
  }
  local_info: {
    id: number
    latitude: string | null
    longitude: string | null
    primary_locale: string | null
    timezone: string | null
    iana_timezone: string | null
  }
  shop_settings: {
    id: number
    has_discounts: boolean
    has_gift_cards: boolean
    finances: boolean
    eligible_for_payments: boolean
    requires_extra_payments_agreement: boolean
    has_storefront: boolean
    county_taxes: boolean
    checkout_api_supported: boolean
    multi_location_enabled: boolean
    transactional_sms_disabled: boolean
    marketing_sms_consent_enabled_at_checkout: boolean
  }
}

export interface SpProduct {
  id: string
  title: string
  productType: string
  descriptionHtml: string
  status: string
  vendor: string
  onlineStorePreviewUrl: string
  tags: string[]
  options: {
    id: string
    name: string
    value: string[]
  }[]
  variants: {
    nodes: {
      id: string
      sku: string
      title: string
      price: string
      compareAtPrice: string | null
      inventoryPolicy: string
      selectedOptions: { value: string }[]
      barcode: string | null
      weight: number
      weightUnit: string
      image: string | null
      inventoryQuantity: number
      taxable: boolean
      requiresShipping: boolean
    }[]
  }
  images: {
    nodes: {
      id: string
      altText: string
      width: string
      height: string
      url: string
    }[]
  }
  publishedAt: string
  createdAt: string
  updatedAt: string
  priceRangeV2: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
}

export interface PrdVariants {
  id: string
  sku: string
  title: string
  price: string
  compareAtPrice: string
  inventoryPolicy: string
  selectedOptions: {
    value: string
  }
  inventoryQuantity: string
  taxable: string
  product: {
    id: string
    title: string
    productType: string
    descriptionHtml: string
    status: string
    vendor: string
    tags: string
    options: {
      id: string
      name: string
      values: string
    }
    images: {
      nodes: {
        id: string
        altText: string
        width: string
        height: string
        src: string
      }[]
    }
    publishedAt: string
    updatedAt: string
    createdAt: string
  }
}
