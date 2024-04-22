import moment from 'moment'
import qs from 'qs'
import { IValueOfRangeDate, TCurrency, TDeviceType } from 'data/wl-types'
import { CURRENCY_MAPPING } from './constants'

export const defaultAvatar = 'assets/images/default-avatar.svg.svg'
export const underConstructionImg = '/under-construction.png'
export const defaultThumbnail = '/default-thumbnail-xl.png'

export const handleHrefAuthor = (href: string) => {
  const { pathname, origin } = window.location

  const basePath = pathname !== '/' ? `${origin}/` : ''
  return `${basePath}author/${href}`
}

export const convertSecondsToTime = (seconds: number) => {
  var hours = Math.floor(seconds / 3600)
  var minutes = Math.floor((seconds % 3600) / 60)
  var remainingSeconds = Math.floor(seconds % 60)

  var timeString = ''

  if (hours > 0) {
    if (hours < 10) {
      timeString += '0'
    }
    timeString += hours + 'h '
  }

  if (minutes < 10) {
    timeString += '0'
  }
  timeString += minutes + 'm '

  if (remainingSeconds < 10) {
    timeString += '0'
  }
  timeString += remainingSeconds + 's'

  return timeString
}

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

export const generateUID = () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const length = 16
  let uid = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    uid += characters[randomIndex]
  }

  return uid
}

export const createQuery = (query: object) => {
  return qs.stringify(query, { encodeValuesOnly: true })
}

export const formatDataNumber = (number: number, digit = 2) => {
  if (number === null) return '-'
  if (isNaN(number)) return ''
  if (number === 0) return 0
  if (number && !Number.isNaN(number)) {
    number = +number
    return number.toLocaleString('en-US', {
      minimumFractionDigits: digit,
      maximumFractionDigits: digit,
    })
  }
}

export const generateFromDateToDate = (key: string) => {
  const now = moment()
  let result = {
    fromDate: '',
    endDate: '',
  }
  switch (key) {
    case 'day':
      result = {
        fromDate: now.startOf('day').toISOString(),
        endDate: now.endOf('day').toISOString(),
      }
      break
    case 'week':
      result = {
        fromDate: now.startOf('week').toISOString(),
        endDate: now.endOf('week').toISOString(),
      }
      break
    case 'month':
      result = {
        fromDate: now.startOf('month').toISOString(),
        endDate: now.endOf('month').toISOString(),
      }
      break
    case 'year':
      result = {
        fromDate: now.startOf('year').toISOString(),
        endDate: now.endOf('year').toISOString(),
      }
      break
    default:
      break
  }

  return result
}

export const convertKeys = (
  obj: any,
  isConvertToCamelCase: boolean = true
): any => {
  const camelToSnake = (str: string): string =>
    str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
  const snakeToCamel = (str: string): string =>
    str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())

  const convertObjectKeys = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
      return obj // Nếu không phải là đối tượng, giữ nguyên giá trị
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => convertObjectKeys(item)) // Nếu là mảng, duyệt và chuyển đổi các phần tử
    }

    const newObj: any = {}
    for (let key in obj) {
      const newKey = !isConvertToCamelCase
        ? camelToSnake(key)
        : snakeToCamel(key)
      newObj[newKey] = convertObjectKeys(obj[key]) // Đệ quy chuyển đổi các giá trị bên trong đối tượng
    }
    return newObj
  }

  return convertObjectKeys(obj)
}

export const formatVideoDuration = (seconds: number): string => {
  if (isNaN(seconds) || typeof seconds !== 'number') {
    return '00:00'
  }

  const hours: number = Math.floor(seconds / 3600)
  const minutes: number = Math.floor((seconds % 3600) / 60)
  const secs: number = Math.floor(seconds % 60)

  const formattedHours: string =
    hours > 0 ? hours.toString().padStart(2, '0') : ''
  const formattedMinutes: string = minutes.toString().padStart(2, '0')
  const formattedSeconds: string = secs.toString().padStart(2, '0')

  if (hours > 0) {
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
  } else {
    return `${formattedMinutes}:${formattedSeconds}`
  }
}

export const generateSlug = (name: string) => {
  return name
    .toLowerCase() // Chuyển đổi tất cả thành chữ thường
    .normalize('NFD') // Chuẩn hóa chuỗi Unicode
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các ký tự có dấu
    .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang
    .replace(/đ/g, 'd') // Thay thế ký tự đặc biệt dạng "đ" thành "d"
    .replace(/[^\w\\-]+/, '') // Loại bỏ các ký tự không phải chữ cái, số hoặc gạch ngang
    .replace(/\\-\\-+/, '-') // Loại bỏ nhiều hơn một dấu gạch ngang liên tiếp
    .replace(/^-+/, '') // Loại bỏ các dấu gạch ngang ở đầu chuỗi
    .replace(/-+$/, '') // Loại bỏ các dấu gạch ngang ở cuối chuỗi
}

export const getRangeDate = (
  type:
    | 'last_week'
    | 'last_month'
    | 'last_3_months'
    | 'last_year' = 'last_week',
  formatDate = 'YYYY/MM/DD'
) => {
  let value: IValueOfRangeDate = {
    numberOfUnitStart: 0,
    numberOfUnitEnd: 0,
    nameOfUnit: 'week',
  }

  switch (type) {
    case 'last_week':
      value = {
        numberOfUnitStart: 1,
        numberOfUnitEnd: 1,
        nameOfUnit: 'week',
      }
      break
    case 'last_month':
      value = {
        numberOfUnitStart: 1,
        numberOfUnitEnd: 1,
        nameOfUnit: 'month',
      }
      break
    case 'last_3_months':
      value = {
        numberOfUnitStart: 3,
        numberOfUnitEnd: 1,
        nameOfUnit: 'month',
      }
      break
    case 'last_year':
      value = {
        numberOfUnitStart: 1,
        numberOfUnitEnd: 1,
        nameOfUnit: 'year',
      }
      break
    default:
      value = {
        numberOfUnitStart: 1,
        numberOfUnitEnd: 1,
        nameOfUnit: 'week',
      }
      break
  }

  let currentDate = moment()
  let startDate = currentDate
    .clone()
    .subtract(value.numberOfUnitStart, `${value.nameOfUnit}s`)
    .startOf(value.nameOfUnit)

  type === 'last_week' && startDate.add(1, 'days')
  let endDate = currentDate
    .clone()
    .subtract(value.numberOfUnitEnd, `${value.nameOfUnit}s`)
    .endOf(value.nameOfUnit)
  type === 'last_week' && endDate.add(1, 'days')

  return {
    startDate: startDate.format(formatDate),
    endDate: endDate.format(formatDate),
  }
}

export const getTimeFrame = () => {
  let currentDate = new Date()
  let today = currentDate.getDay()
  let startDate, endDate

  // Tuần trước
  let startWeekDiff = today + 7
  let endWeekDiff = today + 6
  startDate = new Date(currentDate)
  startDate.setDate(currentDate.getDate() - startWeekDiff)
  endDate = new Date(currentDate)
  endDate.setDate(currentDate.getDate() - endWeekDiff)
  const lastWeek = {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  }

  // Tháng trước
  let startMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  )
  let endMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
  const lastMonth = {
    startDate: startMonth.toISOString().split('T')[0],
    endDate: endMonth.toISOString().split('T')[0],
  }

  // 3 tháng trước
  let startThreeMonths = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 3,
    1
  )
  let endThreeMonths = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  )
  const lastThreeMonths = {
    startDate: startThreeMonths.toISOString().split('T')[0],
    endDate: endThreeMonths.toISOString().split('T')[0],
  }

  // Năm trước
  let startYear = new Date(currentDate.getFullYear() - 1, 0, 1)
  let endYear = new Date(currentDate.getFullYear() - 1, 11, 31)
  const lastYear = {
    startDate: startYear.toISOString().split('T')[0],
    endDate: endYear.toISOString().split('T')[0],
  }

  return { lastWeek, lastMonth, lastThreeMonths, lastYear }
}

export const initChartData = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  let currentDate = start
  let dateArray = []

  while (currentDate <= end) {
    const formatterDate = currentDate.toISOString().split('T')[0]
    dateArray.push(formatterDate)
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dateArray.map((date) => {
    return {
      date,
      value: 0,
    }
  })
}

export const devLog = (data: any, label = '') => {
  if (process.env.REACT_APP_ENVIRONMENT_MODE) {
    if (+process.env.REACT_APP_ENVIRONMENT_MODE === 0) {
      console.log(label !== '' ? `>>> ${[label]}: ` : `>>> data: `, data)
    }
  } else {
    console.log('Need to declare .env file!')
  }
}

export const slugToTitle = (slug: string = '') => {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const getCurrencyCode = (currency: TCurrency) => {
  return CURRENCY_MAPPING[currency]
}

export function convertNumbThousand(number: number | null): string {
  let str = ''
  if (!number) return '0'
  if (number > 1000000) {
    str = (Math.floor(number / 10000) / 1000).toFixed(1) + 'M'
  } else if (number > 1000) {
    str = (Math.floor(number / 100) / 10).toFixed(1) + 'K'
  } else {
    str = String(number)
  }
  return str
}

export function formatInstagramDate(inputDate: Date) {
  if (!(inputDate instanceof Date) || isNaN(inputDate.getTime())) {
    console.error('Invalid date provided')
    return '' // or some default value, depending on your use case
  }

  const currentDate = new Date()
  const timeDifference = currentDate.getTime() - inputDate.getTime()

  // Define the time units in milliseconds
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const year = 365 * day

  // Calculate the duration and unit
  if (timeDifference < minute) {
    return `${Math.floor(timeDifference / 1000)}s`
  } else if (timeDifference < hour) {
    return `${Math.floor(timeDifference / minute)}m`
  } else if (timeDifference < day) {
    return `${Math.floor(timeDifference / hour)}h`
  } else if (timeDifference < week) {
    return `${Math.floor(timeDifference / day)}d`
  } else if (timeDifference < year) {
    return `${Math.floor(timeDifference / week)}w`
  } else {
    return `${Math.floor(timeDifference / year)}y`
  }
}

export const checkDeviceCanTouch = () => {
  return (
    navigator.maxTouchPoints > 0 && 'ontouchstart' in document.documentElement
  )
}

export const checkBrowserAndSystemInfo = () => {
  return navigator.userAgent
}

export const isMobileOrTabletDevice = () => {
  let device: TDeviceType = 'laptop/pc'
  const canTouch = checkDeviceCanTouch()
  const deviceInfo = checkBrowserAndSystemInfo()

  const isTablet =
    /iPad|Android|tablet|KFOT|PlayBook|SC-01C|Touch|Kindle|Silk/i.test(
      deviceInfo
    )
  const isMobile =
    /iPhone|iPod|Android|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(
      deviceInfo
    )

  if (isMobile || isTablet) {
    device = 'mobile/tablet'
  }

  if (device === 'laptop/pc') {
    if (canTouch) {
      device = 'mobile/tablet'
    }
  }
  return device === 'mobile/tablet'
}

export const getYoutubeId = (url: any) => {
  if (!url) return
  url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
  return url[2] !== undefined ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0]
}

export const calculatePriceApplyDiscount = (
  price: number,
  discountValue: number,
  type: string
) => {
  return String(type).toLowerCase() === 'fixed amount'
    ? price - discountValue
    : price - (price * discountValue) / 100
}
