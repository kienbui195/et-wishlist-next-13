import React, { Fragment, useEffect, useState } from 'react'
import apis from 'apis'
import PanelConnection from './PanelConnection'
import PanelFeed from './PanelFeed'
import PanelPrdPage from './PanelPrdPage'
import PanelImages from './PanelImages'
import PanelOurStory from './PanelOurStory'
import PanelMoreInfo from './PanelMoreInfo'
import PanelFAQs from './PanelFAQs'
import { SpProduct } from 'data/types'
import { convertKeys, createQuery } from 'utils/function'
import { useAdminContext } from 'context/adminContext'
import { useSelector } from 'react-redux'
import { RootState } from 'app/store'
import moment from 'moment'
import DashboardButton from '../Components/Button'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  validateFeed,
  validateMedia,
  validateMoreInfo,
  validateOurStory,
  validatePrd,
  validateSProduct,
} from './helper'
import { CreateProductFormState, CreateProductProps, PrdPageInfo } from './type'

const CreateProduct: React.FC<CreateProductProps> = ({ isCreate }) => {
  const shopInfo = useSelector((state: RootState) => state.shop.shop)
  const { showAlert } = useAdminContext()
  const [loadingSaveBtn, setLoadingSaveBtn] = useState<boolean>(false)
  const [loadingSubmitPageBtn, setLoadingSubmitPageBtn] =
    useState<boolean>(false)

  const navigate = useNavigate()

  const userId =
    localStorage.getItem('ETWL') &&
    JSON.parse(localStorage.getItem('ETWL') || '')?.id

  const { id: productId } = useParams()

  const initErrorsFeed = {
    name: '',
    headline: '',
    subHeadline: '',
    thumbnail: '',
    hoverVideo: '',
  }
  const [errorsFeed, setErrorsFeed] = useState(initErrorsFeed)

  const initErrorsPrd = {
    category: '',
    // tags: '',
    prdHeadline: '',
    prdPageHeadline: '',
    prdPageDesc: '',
  }
  const [errorsPrd, setErrorsPrd] = useState(initErrorsPrd)

  const initErrorsOurStory = {
    founderName: '',
    avatar: '',
    headline: '',
    desc: '',
  }
  const [errorsOurStory, setErrorsOurStory] = useState(initErrorsOurStory)

  const initErrorsMedia = {
    mediaImages: '',
  }
  const [errorsMedia, setErrorsMedia] = useState(initErrorsMedia)

  const initErrorsMoreInfo = {
    features: '',
    shippingInfo: '',
    returnPolicy: '',
    includes: '',
  }
  const [errorsMoreInfo, setErrorsMoreInfo] = useState(initErrorsMoreInfo)

  const initErrorSProduct = {
    sProduct: '',
  }
  const [errorSProduct, setErrorSProduct] = useState(initErrorSProduct)

  const [prdPannel, setPrdPannel] = useState('connection')
  const [prdPageInfo, setPrdPageInfo] = useState<PrdPageInfo>({
    listProducts: [],
    prdSelected: null,
  })

  const [form, setForm] = useState<CreateProductFormState>({
    name: '',
    slug: '',
    headline: '',
    subHeadline: '',
    thumbnail: undefined,
    hoverVideo: undefined,
    discountType: 0,
    pageSubmitted: undefined,
    pageApproved: undefined,
    launchDate: undefined,
    launchType: 0,
    launchStatus: 0,
    shop: {
      id: shopInfo.id,
    },
    shopProductId: 0,
    category: {},
    tags: [],
    values: [],
    prodDtl: {
      productHeadline: '',
      productPageHeadline: '',
      productPageDesc: '',
      productPageLink: '',
      productReviewsLink: '',
    },
    wyli: {
      reason1: '',
      reason2: '',
      reason3: '',
      reason4: '',
      reason5: '',
    },
    images: [],
    ourStory: {
      founderName: '',
      founderImage: undefined,
      storyHeadline: '',
      storyDesc: '',
    },
    moreInfo: {
      features: '',
      shippingInfo: '',
      returnExchangePolicy: '',
      whatIncluded: '',
      whatIncludedTitle: "What's Included",
    },
    faqs: [],
    adminNotes: undefined,
    votes: 0,
    member: {
      id: userId,
    },
    storyClip: undefined,
    shopVariantId: 0,
    shopVariantPrice: 0,
  })

  const handleGetPageData = () => {
    if (productId && +productId > 0) {
      apis
        .getOne(
          `wl-products`,
          +productId,
          createQuery({
            populate: {
              hover_video: {
                fields: ['name', 'url'],
              },
              thumbnail: {
                fields: ['name', 'url'],
              },
              shop_info: {
                populate: {
                  shop: {
                    fields: ['id'],
                  },
                },
              },
              member: {
                fields: ['username']
              }, 
              wyli: '*',
              prod_dtl: '*',
              images: {
                fields: ['name', 'url'],
              },
              videos: {
                fields: ['name', 'url'],
              },
              our_story: {
                populate: {
                  founder_image: {
                    fields: ['name', 'url'],
                  },
                },
              },
              more_info: '*',
              faqs: {
                fields: ['question', 'answer'],
              },
              category: {
                fields: ['name', 'slug'],
              },
              tags: {
                fields: ['name', 'slug'],
              },
              values: {
                fields: ['name', 'slug'],
              },
              story_clip: {
                fields: ['desc'],
                populate: {
                  clip: {
                    fields: ['name', 'url'],
                  },
                },
              },
            },
          })
        )
        .then((res) => {
          const attributes = convertKeys(res.data.data?.attributes)
          const { spProduct = {} } = attributes
          const prdSelected: SpProduct = {
            ...spProduct,
            images: {
              nodes: spProduct?.images?.map((item: any) => ({
                ...item,
                url: item.src,
              })),
            },
            variants: {
              nodes: spProduct?.variants,
            },
            options: {
              nodes: spProduct?.options,
            },
          }
          setPrdPageInfo({ ...prdPageInfo, prdSelected })
          const tags =
            attributes.tags?.data?.map(({ id, attributes: att }: any) => ({
              id,
              ...att,
            })) || []
          const images =
            attributes?.images?.data?.map(({ id, attributes: att }: any) => ({
              id,
              ...att,
            })) || []
          const data: CreateProductFormState = {
            ...attributes,
            prodDtl: {
              productHeadline: attributes.prodDtl?.productHeadline || '',
              productPageHeadline:
                attributes.prodDtl?.productPageHeadline || '',
              productPageDesc: attributes.prodDtl?.productPageDesc || '',
              productPageLink: attributes.prodDtl?.productPageLink || '',
              productReviewsLink: attributes.prodDtl?.productReviewsLink || '',
            },
            wyli: {
              reason1: attributes.wyli?.reason1 || '',
              reason2: attributes.wyli?.reason2 || '',
              reason3: attributes.wyli?.reason3 || '',
              reason4: attributes.wyli?.reason4 || '',
              reason5: attributes.wyli?.reason5 || '',
            },
            moreInfo: {
              features: attributes.moreInfo?.features || '',
              shippingInfo: attributes.moreInfo?.shippingInfo || '',
              returnExchangePolicy:
                attributes.moreInfo?.returnExchangePolicy || '',
              whatIncluded: attributes.moreInfo?.whatIncluded || '',
              whatIncludedTitle: "What's Included",
            },
            launchDate: attributes.launchDate
              ? moment(attributes.launchDate).format('YYYY-MM-DD')
              : undefined,
            tags,
            category: {
              id: attributes.category.data?.id,
              ...attributes.category.data?.attributes,
            },
            thumbnail: {
              id: attributes.thumbnail.data?.id,
              ...attributes.thumbnail.data?.attributes,
            },
            hoverVideo: {
              id: attributes.hoverVideo.data?.id,
              ...attributes.hoverVideo.data?.attributes,
            },
            images,
            ourStory: {
              ...attributes.ourStory,
              founderName: attributes.ourStory?.founderName || '',
              storyHeadline: attributes.ourStory?.storyHeadline || '',
              storyDesc: attributes.ourStory?.storyDesc || '',
              founderImage: {
                id: attributes.ourStory?.founderImage?.data?.id,
                ...attributes.ourStory?.founderImage?.data?.attributes,
              },
            },
            storyClip: {
              id: attributes.storyClip?.data?.attributes.clip?.data?.id,
              ...attributes.storyClip?.data?.attributes.clip?.data?.attributes,
              url: attributes.storyClip?.data?.attributes.clip?.data?.attributes
                .url,
            },
          }
          setForm({ ...form, ...data })
        })
        .catch((err) => { 
          err.response?.data?.error ? showAlert('error', err.response.data.error) : showAlert('error', err.message)  
        })
    }
  }

  const handleResetErrorMessage = () => {
    setErrorsFeed(initErrorsFeed)
    setErrorsPrd(initErrorsPrd)
    setErrorsMedia(initErrorsMedia)
    setErrorsOurStory(initErrorsOurStory)
    setErrorsMoreInfo(initErrorsMoreInfo)
  }

  const handleCreateProduct = () => {
    delete form.values
    const errorFeed = validateFeed(form)
    const errorPrd = validatePrd(form)
    const errorMedia = validateMedia(form)
    const errorOurStory = validateOurStory(form)
    const errorMoreInfo = validateMoreInfo(form)
    const errorSProduct = validateSProduct(prdPageInfo?.prdSelected)

    if (
      errorFeed.name === '' &&
      errorFeed.headline === '' &&
      errorFeed.hoverVideo === '' &&
      errorFeed.subHeadline === '' &&
      errorFeed.thumbnail === '' &&
      errorPrd.category === '' &&
      // errorPrd.tags === '' &&
      errorPrd.prdHeadline === '' &&
      errorPrd.prdPageDesc === '' &&
      errorPrd.prdPageHeadline === '' &&
      errorMedia.mediaImages === '' &&
      errorOurStory.avatar === '' &&
      errorOurStory.desc === '' &&
      errorOurStory.founderName === '' &&
      errorOurStory.headline === '' &&
      errorMoreInfo.features === '' &&
      errorMoreInfo.includes === '' &&
      errorMoreInfo.returnPolicy === '' &&
      errorMoreInfo.shippingInfo === '' &&
      errorSProduct.sProduct === ''
    ) {
      setLoadingSaveBtn(true)
      handleResetErrorMessage()
      apis
        .post('wl-products', {
          data: {
            ...convertKeys(form, false),
            sp_product: prdPageInfo?.prdSelected,
            product_type: "Merchant",
          },
        })
        .then((res) => {
          const { data } = res.data
          showAlert('success', 'Successful')
          navigate('/brand-products/edit/' + data.id)
          setLoadingSaveBtn(false)
        })
        .catch((err) => {
          console.log(err)
          showAlert('error', err.message)
          setLoadingSaveBtn(false)
        })
    } else {
      showAlert(
        'warning',
        'Please fill all required fields or limit characters'
      )
      setErrorsFeed(errorFeed)
      setErrorsPrd(errorPrd)
      setErrorsMedia(errorMedia)
      setErrorsOurStory(errorOurStory)
      setErrorsMoreInfo(errorMoreInfo)
      setErrorSProduct(errorSProduct)
    }
  }

  const handleEditProduct = () => {
    delete form.values
    const errorFeed = validateFeed(form)
    const errorPrd = validatePrd(form)
    const errorMedia = validateMedia(form)
    const errorOurStory = validateOurStory(form)
    const errorMoreInfo = validateMoreInfo(form)
    const errorSProduct = validateSProduct(prdPageInfo?.prdSelected)

    if (
      errorFeed.name === '' &&
      errorFeed.headline === '' &&
      errorFeed.hoverVideo === '' &&
      errorFeed.subHeadline === '' &&
      errorFeed.thumbnail === '' &&
      errorPrd.category === '' &&
      // errorPrd.tags === '' &&
      errorPrd.prdHeadline === '' &&
      errorPrd.prdPageDesc === '' &&
      errorPrd.prdPageHeadline === '' &&
      errorMedia.mediaImages === '' &&
      errorOurStory.avatar === '' &&
      errorOurStory.desc === '' &&
      errorOurStory.founderName === '' &&
      errorOurStory.headline === '' &&
      errorMoreInfo.features === '' &&
      errorMoreInfo.includes === '' &&
      errorMoreInfo.returnPolicy === '' &&
      errorMoreInfo.shippingInfo === '' &&
      errorSProduct.sProduct === ''
    ) {
      if (productId) {
        handleResetErrorMessage()
        setLoadingSaveBtn(true)
        apis
          .update('wl-products', +productId, {
            data: {
              ...convertKeys(form, false),
              sp_product: prdPageInfo?.prdSelected,
            },
          })
          .then(() => {
            showAlert('success', 'Successful')
            setLoadingSaveBtn(false)
          })
          .catch((err) => {
            console.log(err)
            showAlert('error', err.message)
            setLoadingSaveBtn(false)
          })
      }
    } else {
      showAlert('warning', 'Please fill all required fields')
      setErrorsFeed(errorFeed)
      setErrorsPrd(errorPrd)
      setErrorsMedia(errorMedia)
      setErrorsOurStory(errorOurStory)
      setErrorsMoreInfo(errorMoreInfo)
    }
  }

  const handleSubmitPage = () => {
    if (!productId) return
    setLoadingSubmitPageBtn(true)
    apis
      .update('wl-products', +productId, {
        data: {
          page_submitted: true,
        },
      })
      .then((res) => {
        setLoadingSubmitPageBtn(false)
        const { data } = res.data
        setForm({ ...form, pageSubmitted: data.attributes.page_submitted })
        showAlert('success', 'Successful')
      })
      .catch((err) => {
        console.log(err.message)
        setLoadingSubmitPageBtn(false)
      })
  }

  useEffect(() => {
    if (!isCreate) {
      handleGetPageData()
    }

    document.title = `ET Wishlist | Brand Products - ${
      isCreate ? 'Create' : 'Edit'
    }`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, isCreate])

  const renderDashBoardPanel = () => {
    switch (prdPannel) {
      case 'connection':
        return (
          <PanelConnection
            productSelected={prdPageInfo?.prdSelected}
            callback={(value: SpProduct) => {
              const matchSpId = value.id.match(/\d+/)
              const shopProductId = matchSpId ? matchSpId[0] : 0
              const sv = value.variants.nodes[0] || {}
              const { id: svId, price: shopVariantPrice = 0 } = sv
              const matchSvId = svId.match(/\d+/)
              const shopVariantId = matchSvId ? matchSvId[0] : 0
              const shopVariantCurrency =
                value?.priceRangeV2?.minVariantPrice?.currencyCode
              setForm((preState) => ({
                ...preState,
                shopProductId: +shopProductId,
                shopVariantId: +shopVariantId,
                shopVariantPrice: +shopVariantPrice,
                shopVariantCurrency,
                prodDtl: {
                  ...preState.prodDtl,
                  productPageLink: value.onlineStorePreviewUrl,
                  productReviewsLink: value.onlineStorePreviewUrl,
                },
              }))
              setPrdPageInfo((preState: any) => ({
                ...preState,
                prdSelected: value,
              }))
            }}
            data={form}
            onSetState={setForm}
            errors={errorSProduct}
          />
        )
      case 'feed':
        return (
          <PanelFeed
            data={form}
            onSetState={setForm}
            isCreate={isCreate}
            errors={errorsFeed}
          />
        )
      case 'prdPage':
        return (
          <PanelPrdPage data={form} onSetState={setForm} errors={errorsPrd} />
        )
      case 'images':
        return (
          <PanelImages data={form} onSetState={setForm} errors={errorsMedia} />
        )
      case 'ourStory':
        return (
          <PanelOurStory
            data={form}
            onSetState={setForm}
            errors={errorsOurStory}
          />
        )
      case 'moreInfo':
        return (
          <PanelMoreInfo
            data={form}
            onSetState={setForm}
            errors={errorsMoreInfo}
          />
        )
      case 'faq':
        return <PanelFAQs data={form} onSetState={setForm} />

      default:
        break
    }
  }

  return (
    <div className="flex brand-products">
      <main className="w-full px-10 py-7">
        <div>
          <div className="flex w-full items-start justify-between">
            <div>
              <span
                className="cursor-pointer text-10 font-bold leading-none tracking-wide text-gray-1150"
                onClick={() => navigate('/brand-products')}
              >
                BACK TO MY PRODUCTS
              </span>
              <h2 className="mt-5 text-base font-semibold leading-none tracking-tight text-black">
                {isCreate ? 'Create' : 'Edit'} Product Page
              </h2>
              <h3 className="font-sm mt-[9px] leading-none text-gray-1150">
                Complete the sections below to publish your product page.
              </h3>
            </div>
            <div className="text-grey-2650 flex h-7 items-center whitespace-nowrap rounded bg-white px-2 text-13 font-medium shadow-brandButton">
              {form.pageApproved
                ? 'Page Approved'
                : form.pageSubmitted
                ? 'Page Submitted'
                : 'Page Not Submitted'}
              <div
                className="ml-2 block h-[7px] w-[7px] rounded-full"
                style={{
                  backgroundColor: form.pageApproved
                    ? '#00C71E'
                    : form.pageSubmitted
                    ? '#0078FF'
                    : '#8E9DAE',
                }}
              ></div>
            </div>
          </div>
          <div className="ml-[571px] mt-[30px] flex justify-end">
            {!isCreate && (
              <Fragment>
                {/* TODO: use Link react-router-dom to navigate to product detail */}
                <Link to={`/products/${form.slug}`} target="_blank">
                  <DashboardButton label="Preview Page" type="white" />
                </Link>
                <DashboardButton
                  label="Submit Page"
                  onClick={loadingSubmitPageBtn ? () => {} : handleSubmitPage}
                  type="white"
                />
              </Fragment>
            )}
            <DashboardButton
              label="Save Changes"
              onClick={
                loadingSaveBtn
                  ? () => {}
                  : isCreate
                  ? handleCreateProduct
                  : handleEditProduct
              }
            />
          </div>
          <form className="el-form el-form--default el-form--label-top mt-[-28px]">
            <div className="el-tabs el-tabs--top brand-product-tabs">
              <div className="el-tabs__header is-top">
                <div className="el-tabs__nav-wrap is-top">
                  <div className="el-tabs__nav-scroll">
                    <div
                      className="el-tabs__nav is-top"
                      role="tablist"
                      style={{ transform: 'translateX(0px);' }}
                    >
                      <div
                        className={`el-tabs__item is-top ${
                          prdPannel === 'connection' ? 'is-active' : ''
                        }`}
                        id="tab-Connections"
                        aria-controls="pane-Connections"
                        role="tab"
                        aria-selected="true"
                        tabIndex={prdPannel === 'connection' ? 0 : -1}
                        onClick={() => setPrdPannel('connection')}
                      >
                        Connections
                      </div>
                      <div
                        className={`el-tabs__item is-top ${
                          prdPannel === 'feed' ? 'is-active' : ''
                        }`}
                        id="tab-Feed"
                        aria-controls="pane-Feed"
                        role="tab"
                        aria-selected="false"
                        tabIndex={prdPannel === 'feed' ? 0 : -1}
                        onClick={() => setPrdPannel('feed')}
                      >
                        Feed
                      </div>
                      <div
                        className={`el-tabs__item is-top ${
                          prdPannel === 'prdPage' ? 'is-active' : ''
                        }`}
                        id="tab-Product Page"
                        aria-controls="pane-Product Page"
                        role="tab"
                        aria-selected="false"
                        tabIndex={prdPannel === 'prdPage' ? 0 : -1}
                        onClick={() => setPrdPannel('prdPage')}
                      >
                        Product Page
                      </div>
                      <div
                        className={`el-tabs__item is-top ${
                          prdPannel === 'images' ? 'is-active' : ''
                        }`}
                        id="tab-Images"
                        aria-controls="pane-Images"
                        role="tab"
                        aria-selected="false"
                        tabIndex={prdPannel === 'images' ? 0 : -1}
                        onClick={() => setPrdPannel('images')}
                      >
                        Images
                      </div>
                      <div
                        className={`el-tabs__item is-top ${
                          prdPannel === 'ourStory' ? 'is-active' : ''
                        }`}
                        id="tab-Our Story"
                        aria-controls="pane-Our Story"
                        role="tab"
                        aria-selected="false"
                        tabIndex={prdPannel === 'ourStory' ? 0 : -1}
                        onClick={() => setPrdPannel('ourStory')}
                      >
                        Our Story
                      </div>
                      <div
                        className={`el-tabs__item is-top ${
                          prdPannel === 'moreInfo' ? 'is-active' : ''
                        }`}
                        id="tab-More Info"
                        aria-controls="pane-More Info"
                        role="tab"
                        aria-selected="false"
                        tabIndex={prdPannel === 'moreInfo' ? 0 : -1}
                        onClick={() => setPrdPannel('moreInfo')}
                      >
                        More Info
                      </div>
                      <div
                        className={`el-tabs__item is-top ${
                          prdPannel === 'faq' ? 'is-active' : ''
                        }`}
                        id="tab-FAQs"
                        aria-controls="pane-FAQs"
                        role="tab"
                        aria-selected="false"
                        tabIndex={prdPannel === 'faq' ? 0 : -1}
                        onClick={() => setPrdPannel('faq')}
                      >
                        FAQs
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="el-tabs__content">{renderDashBoardPanel()}</div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default CreateProduct
