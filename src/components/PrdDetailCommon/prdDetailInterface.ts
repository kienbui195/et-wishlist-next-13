export interface IShortsState {
  id: number
  attributes: {
    desc: string
    views: number
    likes: number
    productId: number
    productName: string
    clip: {
      data: IImage
    }
  }
}

export interface IFAQ {
  id: number
  question: string
  answer: string
}

export interface IAdminNotes {
  id: number
  note: string
  date: Date
}

export interface IProductTagsState {
  id: number
  attributes: IProductTags
}

export interface IProductState {
  id: number
  attributes: {
    name: string
    slug: string
    productLink: string
    headline: string
    subHeadline: string
    thumbnail?: {
      data?: IImage
    }
    hoverVideo?: {
      data?: IImage
    }
    discountType?: number
    pageSubmitted?: boolean
    lastProdOfDay?: number
    lastProdOfMonth?: number
    lastProdOfWeek?: number
    lastProdOfYear?: number
    launchDate?: Date
    launchType?: number
    launchStatus?: number
    shopVariantId: number
    shopVariantPrice: number
    shopVariantCurrency: TCurrency
    shop: {
      data: {
        id: number
        attributes: {
          domain: string
          storefrontAccessToken: string
        }
      }
    }
    shopInfo?: {
      shopProduct: {
        data?: {}
      }
      productPageLink: string
      productReviewsLink: string
    }
    prodDtl?: {
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
    images: {
      data?: IImage[]
    }
    videos: {
      data?: IImage[]
    }
    shortClips: {
      data?: IShortsState[]
    }
    ourStory?: {
      founderName: string
      founderImage: {
        data?: IImage
      }
      storyHeadline: string
      storyDesc: string
    }
    moreInfo?: {
      features?: string
      shippingInfo?: string
      returnExchangePolicy?: string
      whatIncluded?: string
      whatIncludedTitle: "What's Included" | 'Ingredients'
    }
    faqs: IFAQ[]
    adminNotes: IAdminNotes[]
    votes: number
    views: number
    shares: number
    shopProductId: string
    category: {
      data?: IProductTagsState | null
    }
    tags: {
      data: IProductTagsState[]
    }
    value: {
      data: IProductTagsState[]
    }
    storyClip: {
      data?: {
        id: number
        attributes: {
          clip: {
            data?: {
              id: number
              attributes: {
                name: string
                url: string
              }
            }
          }
        }
      }
    }
    publishedAt: Date
    productType: string
  }
  isBookmarked?: boolean
  companyInfo?: {
    name: string
    logo?: {
      url: string
    }
  }
}
export interface prdDetailState {
  voted: boolean
  showStory: boolean
  showGallery: boolean
  showSharePrd: boolean
  selectedGlrImg: number
  showPrdQT: string
  discount: {
    title: string
    summary: string
    discount_code: string
    discount_value: string
    status?: TDiscountCodeStatus | string
    voteId?: number
    votes: number
  }
}

export interface IImage {
  id: number
  attributes: {
    name: string
    url: string
    width: number
    height: number
  }
}

export interface IVideo {
  id: number
  attributes: {
    name: string
    url: string
    width: number
    height: number
  }
}

export type TAward = 'week' | 'month' | 'year'

export const TDiscountType = {
  0: 'This product only',
  1: 'Site Wide',
}

export const TLauncherType = {
  0: 'This product only',
  1: 'Site Wide',
}

export interface IProductTags {
  name: string
  slug: string
  desc: string
}

export type TDiscountClass = 'ORDER' | 'PRODUCT'

export interface IDiscount {
  title: string
  summary: string
  shortSummary?: string
  discountClass?: TDiscountClass
  status: boolean
  summaries?: {
    asyncUsageCount: number
    totalSales: number
    currencyCode: string
  }
  details?: {
    usageLimit: number
    recurringCycleLimit: number
    codeCount: number
    appliesOncePerCustomer: boolean
    hasTimelineComment: boolean
  }
  combinesWith?: {
    orderDiscounts: boolean
    productDiscounts: boolean
    shippingDiscounts: boolean
  }
  references?: {
    customerGets: JSON
    customerSelection: JSON
    minimumRequirement: JSON
    shareableUrls: JSON
  }
  shopifyCreatedAt?: Date
  startsAt?: Date
  endsAt?: Date
  shopifyUpdatedAt?: Date
  // shop
  // member
}

export interface IDropdownItem {
  id: string | number
  name: string
}

export type TAlertType = 'success' | 'info' | 'warning' | 'error'

export type TRangeDates = 'weeks' | 'months' | 'years'
export type TRangeDate = 'week' | 'month' | 'year'
export interface IValueOfRangeDate {
  numberOfUnitStart: number
  numberOfUnitEnd: number
  nameOfUnit: TRangeDate
}
export interface IOptionalSetting {
  width: number
  height: number
  isShow: boolean
  isAcceptClose: boolean
}

export type TCurrency =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'CAD'
  | 'JPY'
  | 'AUD'
  | 'INR'
  | 'SGD'
  | 'VND'

export type TDiscountCodeStatus = 'ACTIVE' | 'LIMIT' | 'EXPIRE'

export interface CTAButton {
  id: number
  label: string
  icon?: {
    data: IImage
  }
  link: string
  bgColor?: string
  target: string
}
export interface ICuration {
  id: number
  attributes: {
    name: string
    slug: string
    headline: string
    images: {
      data?: IImage[]
    }
    videos: {
      data?: IVideo[]
    }
    thumbnail: {
      data?: IImage
    }
    hoverVideo: {
      data?: IVideo
    }
    shortIntro: string
    longIntro: string
    shortDesc: string
    price: number
    currency: TCurrency
    discountValue: number
    discountType: string
    inStock: number
    merchant: string
    featuresTitle?: string
    features?: string
    pros?: string
    cons?: string
    linkYoutube?: string
    wdwstpTitle?: string
    wdwstp?: string
    faqs: IFAQ[]
    ctaButton: CTAButton[]
    views: number
    shares: number
    votes: number
    category: {
      data?: IProductTagsState
    }
    tags: {
      data?: IProductTagsState[]
    }
    createdAt: Date
    crawTime: Date
    publishedAt: Date
  }
  isBookmarked?: boolean
  isVoted?: boolean
}