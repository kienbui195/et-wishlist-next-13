export interface IImage {
  id: number
  attributes: {
    name: string
    url: string
    caption?: string
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

export type TDeviceType = 'mobile/tablet' | 'laptop/pc'