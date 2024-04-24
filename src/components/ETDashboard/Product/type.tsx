import { IAdminNotes } from '@/components/PrdDetailCommon/prdDetailInterface'
import { SpProduct } from '@/data/types'
import { IImage } from '@/data/wl-types'

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
  inventoryQuantitynodes: string
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
        url: string
      }[]
    }
    publishedAt: string
    updatedAt: string
    createdAt: string
  }
}

export interface PrdPageInfo {
  prdSelected: SpProduct | null
  listProducts: SpProduct[]
}

export interface CreateProductProps {
  isCreate: boolean
}

export interface FAQ {
  question: string
  answer: string
}

export interface CreateProductFormState {
  name: string
  slug: string
  headline: string
  subHeadline: string
  thumbnail?: IImage
  hoverVideo?: IImage
  discountType?: number
  pageSubmitted?: boolean
  pageApproved?: boolean
  launchDate?: string
  launchType?: number
  launchStatus?: number
  shop?: {
    id: number
  }
  shopProductId: number
  category: any
  tags: any[]
  values?: any
  prodDtl: {
    productHeadline: string
    productPageHeadline: string
    productPageDesc: string
    productPageLink: string
    productReviewsLink: string
  }
  wyli?: {
    reason1?: string
    reason2?: string
    reason3?: string
    reason4?: string
    reason5?: string
  }
  images: any[]
  ourStory: {
    founderName: string
    founderImage?: IImage
    storyHeadline: string
    storyDesc: string
  }
  moreInfo: {
    features: string
    shippingInfo: string
    returnExchangePolicy: string
    whatIncluded: string
    // whatIncludedTitle: "What's Included" | 'Ingredients'
    whatIncludedTitle: string
  }
  faqs: FAQ[]
  adminNotes?: IAdminNotes[]
  votes: number
  member: {
    id: number
  }
  storyClip?: any
  shopVariantId?: number
  shopVariantPrice?: number
  shopVariantCurrency?: string
}

export interface ProductPanelProps {
  data: CreateProductFormState
  onSetState: React.Dispatch<React.SetStateAction<CreateProductFormState>>
  isCreate?: boolean
  errors?: any
}
