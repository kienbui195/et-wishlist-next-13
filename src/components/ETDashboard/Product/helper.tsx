import { CreateProductFormState } from "./type"

export const generateSlug = (target: string) => {
  // Chuyển đổi chuỗi thành chữ thường
  target = target.toLowerCase()
  target = target.trim()
  target = target.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  target = target.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  target = target.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  target = target.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  target = target.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  target = target.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  target = target.replace(/đ/g, 'd')
  // Some system encode vietnamese combining accent as individual utf-8 characters
  target = target.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // Huyền sắc hỏi ngã nặng
  target = target.replace(/\u02C6|\u0306|\u031B/g, '') // Â, Ê, Ă, Ơ, Ư

  // Xóa các ký tự đặc biệt và dấu câu
  target = target.replace(/[^a-z0-9\s-]/g, '')

  // Thay thế khoảng trắng và dấu cách bằng dấu gạch ngang
  target = target.trim().replace(/\s+/g, '-')
  return typeof target !== 'string' ||
    target === null ||
    target === undefined ||
    !target
    ? ''
    : target
}

export const validateFeed = (prod: CreateProductFormState) => {
  const listErrors = {
    name: '',
    headline: '',
    subHeadline: '',
    thumbnail: '',
    hoverVideo: '',
  }

  if (prod.name.trim() === '') {
    listErrors.name = 'Please input Product Name'
  }

  if (prod.name.length > 40) {
    listErrors.name = 'The string exceeds the allowed number of characters'
  }

  if (prod.headline.trim() === '') {
    listErrors.headline = 'Please input Feed Headline'
  }

  if (prod.headline.length > 40) {
    listErrors.headline = 'The string exceeds the allowed number of characters'
  }

  if (prod.subHeadline.trim() === '') {
    listErrors.subHeadline = 'Please input Feed Sub-Headline'
  }

  if (prod.subHeadline.length > 100) {
    listErrors.subHeadline = 'The string exceeds the allowed number of characters'
  }

  if (!prod.thumbnail) {
    listErrors.thumbnail = 'Please input Feed Thumbnail'
  }

  if (!prod.hoverVideo) {
    listErrors.hoverVideo = 'Please input Feed Hover Video'
  }

  return listErrors
}

export const validatePrd = (prod: CreateProductFormState) => {
  const listErrors = {
    category: '',
    // tags: '',
    prdHeadline: '',
    prdPageHeadline: '',
    prdPageDesc: '',
    reason1: '',
    reason2: '',
    reason3: '',
    reason4: '',
    reason5: '',
  }

  if (!prod.category.id) {
    listErrors.category = 'Please choose a category'
  }

  if (prod?.prodDtl.productHeadline.trim() === '') {
    listErrors.prdHeadline = 'Please input Product Headline'
  }

  if (prod?.prodDtl.productHeadline.length > 40) {
    listErrors.prdHeadline = 'The string exceeds the allowed number of characters'
  }

  if (prod?.prodDtl.productPageHeadline.trim() === '') {
    listErrors.prdPageHeadline = 'Please input Product Page Headline'
  }

  if (prod?.prodDtl.productHeadline.length > 100) {
    listErrors.prdPageHeadline = 'The string exceeds the allowed number of characters'
  }

  if (prod?.prodDtl.productPageDesc.trim() === '') {
    listErrors.prdPageDesc = 'Please input Product Page Description'
  }

  if (prod?.prodDtl.productHeadline.length > 800) {
    listErrors.prdPageDesc = 'The string exceeds the allowed number of characters'
  }

  if (prod.wyli?.reason1 && prod.wyli?.reason1.length > 80) {
    listErrors.reason1 = 'The string exceeds the allowed number of characters'
  }

  if (prod.wyli?.reason2 && prod.wyli?.reason2.length > 80) {
    listErrors.reason2 = 'The string exceeds the allowed number of characters'
  }

  if (prod.wyli?.reason3 && prod.wyli?.reason3.length > 80) {
    listErrors.reason3 = 'The string exceeds the allowed number of characters'
  }

  if (prod.wyli?.reason4 && prod.wyli?.reason4.length > 80) {
    listErrors.reason4 = 'The string exceeds the allowed number of characters'
  }

  if (prod.wyli?.reason5 && prod.wyli?.reason5.length > 80) {
    listErrors.reason5 = 'The string exceeds the allowed number of characters'
  }

  return listErrors
}

export const validateMedia = (prod: CreateProductFormState) => {
  let listErrors = {
    mediaImages: '',
  }

  if (prod.images.length < 1) {
    listErrors.mediaImages = 'Please upload at least one image'
  }

  return listErrors
}

export const validateOurStory = (prod: CreateProductFormState) => {
  let listErrors = {
    founderName: '',
    avatar: '',
    headline: '',
    desc: '',
  }

  if (!prod.ourStory.founderImage) {
    listErrors.avatar = 'Please upload a Founder Image'
  }

  if (prod.ourStory.founderName.trim() === '') {
    listErrors.founderName = 'Please input Founder Name'
  }

  if (prod.ourStory.storyHeadline.trim() === '') {
    listErrors.headline = 'Please input Our Story Headline'
  }

  if (prod.ourStory.storyHeadline.length > 100) {
    listErrors.headline = 'The string exceeds the allowed number of characters'
  }

  if (prod.ourStory.storyDesc.trim() === '') {
    listErrors.desc = 'Please input Our Story Description'
  }

  if (prod.ourStory.storyDesc.length > 800) {
    listErrors.desc = 'The string exceeds the allowed number of characters'
  }

  return listErrors
}

export const validateMoreInfo = (prod: CreateProductFormState) => {
  let listErrors = {
    features: '',
    shippingInfo: '',
    returnPolicy: '',
    includes: '',
  }

  if (prod.moreInfo.features.trim() === '') {
    listErrors.features = 'Please input Features'
  }

  if (prod.moreInfo.features.length > 400) {
    listErrors.features = 'The string exceeds the allowed number of characters'
  }

  if (prod.moreInfo.returnExchangePolicy.trim() === '') {
    listErrors.returnPolicy = 'Please input Return Policy'
  }

  if (prod.moreInfo.returnExchangePolicy.length > 250) {
    listErrors.returnPolicy = 'The string exceeds the allowed number of characters'
  }

  if (prod.moreInfo.shippingInfo.trim() === '') {
    listErrors.shippingInfo = 'Please input Shipping Information'
  }

  if (prod.moreInfo.shippingInfo.length > 250) {
    listErrors.shippingInfo = 'The string exceeds the allowed number of characters'
  }

  if (prod.moreInfo.whatIncluded.trim() === '') {
    listErrors.includes = 'Please input What Included'
  }

  if (prod.moreInfo.whatIncluded.length > 250) {
    listErrors.includes = 'The string exceeds the allowed number of characters'
  }

  return listErrors
}

export const validateSProduct = (sProd: any) => {
  let listErrors = {
    sProduct: '',
  }

  if (!sProd) {
    listErrors.sProduct = 'Please select Product Connection'
  }

  return listErrors
}
