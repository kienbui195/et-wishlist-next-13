import React, { FC, useEffect, useState } from 'react'
import { ICompanyProduct } from './index'
import SingleSelect from '../../SingleSelect'
import { IDropdownItem } from '../../../data/wl-types'
import FormInput from '../../FormInput/Input'
import FormTextarea from '../../FormTextarea/FormTextarea'
import apis from '../../../apis'
import { createQuery, devLog, generateSlug } from '../../../utils/function'
import { useSelector } from 'react-redux'
import { RootState } from 'app/store'
import { useAdminContext } from 'context/adminContext'
import { REGEX } from './helper'

interface Step3Props {
  nextStep: () => void
  backStep: () => void
  shopId: number
}

const Step3: FC<Step3Props> = ({ nextStep, backStep, shopId }) => {
  const userInfo = useSelector((state: RootState) => state.user.user)
  const { showAlert } = useAdminContext()
  const [companyPrd, setCompanyPrd] = useState<ICompanyProduct>({
    category: {
      id: '',
      name: '',
    },
    linkToPrdPage: '',
    linkToReview: '',
    productDesc: '',
    productName: '',
    shippingFrom: {
      id: 'US',
      name: 'United States',
    },
  })

  const [categories, setCategories] = useState<IDropdownItem[]>([])
  const [errors, setErrors] = useState({
    category: '',
    prdName: '',
    prdDesc: '',
    linkToPage: '',
    linkToReview: '',
  })

  const [countries, setCountries] = useState({
    countries: [],
    accessToken: '',
  })
  const handleChange = (
    e: any,
    stateName: string,
    isSelect: boolean = false
  ) => {
    setCompanyPrd({ ...companyPrd, [stateName]: isSelect ? e : e.target.value })
  }

  const validate = (values: any) => {
    const listErrors = {
      category: '',
      prdName: '',
      prdDesc: '',
      linkToPage: '',
      linkToReview: '',
    }
    if (values.category.name === '') {
      listErrors.category = 'Please select at least one category'
    }

    if (values.productName.trim() === '') {
      listErrors.prdName = 'Please input Product Name'
    } else if (values.productName.length > 40) {
      listErrors.prdName =
        'The number of characters has exceeded the allowed number of characters (less than 40).'
    }

    if (values.productDesc.trim() === '') {
      listErrors.prdDesc = 'Please input Product Description'
    } else if (values.productDesc.length > 800) {
      listErrors.prdDesc =
        'The number of characters has exceeded the allowed number of characters (less than 800).'
    }

    if (values.linkToPrdPage.trim() === '') {
      listErrors.linkToPage = 'Please input Link to Page'
    } else if (!REGEX.WEBSITE.test(values.linkToPrdPage)) {
      listErrors.linkToPage = 'Invalid link'
    }

    if (values.linkToReview.trim() !== '') {
      if (!REGEX.WEBSITE.test(values.linkToReview)) {
        listErrors.linkToReview = 'Invalid link'
      }
    }

    return listErrors
  }

  const handleValidate = () => {
    const listError = validate(companyPrd)
    if (
      listError.category === '' &&
      listError.prdName === '' &&
      listError.prdDesc === '' &&
      listError.linkToPage === ''
    ) {
      handleSubmit()
    } else {
      setErrors(listError)
    }
  }

  const handleSubmit = () => {
    if (shopId && +shopId > 0 && userInfo.id) {
      apis
        .post('wl-first-products', {
          data: {
            name: companyPrd.productName,
            slug: generateSlug(companyPrd.productName),
            headline: '',
            sub_headline: '',
            shop_product_id: 0,
            shop: {
              connect: [shopId],
            },
            category: {
              connect: [companyPrd.category.id],
            },
            member: {
              set: [userInfo.id],
            },
            prod_dtl: {
              product_headline: '',
              product_page_headline: '',
              product_page_desc: companyPrd.productDesc,
              product_page_link: companyPrd.linkToPrdPage,
              product_reviews_link: companyPrd.linkToReview,
            },
            more_info: {
              shipping_info: `Shipping from ${companyPrd.shippingFrom?.name}`,
              features: ' ',
              return_exchange_policy: ' ',
              what_included: ' ',
            },
            discount_type: 0,
            launch_type: 0,
            launch_status: 0,
            product_type: "Merchant",
          },
        })
        .then((res) => {
          nextStep && nextStep()
        })
        .catch((err) => {
          showAlert(
            'error',
            'Create your first product failed! Please check and try again'
          )
          devLog(err, 'Step3.handleSubmit')
        })
    } else {
      showAlert(
        'error',
        'No shop information found! Please install the app on shopify'
      )
    }
  }

  const handleGetCategory = () => {
    apis
      .get(
        `wl-prod-cats`,
        createQuery({
          fields: ['name', 'category_order', 'slug'],
          sort: 'name',
        })
      )
      .then((res) => {
        setCategories(
          res.data.data.map((item: any) => {
            return {
              id: `${item.id}`,
              name: item.attributes?.name,
            }
          })
        )
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleGetCountries = () => {
    apis
      .getCountries()
      .then((res) => {
        setCountries({
          ...countries,
          countries: res.data.data.reduce((acc: any[], item: any) => {
            acc.push({
              id: item.iso3,
              name: item.name,
            })
            return acc
          }, []),
        })
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  useEffect(() => {
    handleGetCategory()
    handleGetCountries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="w-full flex-1">
      <div className="mt-8">
        <div className="flex">
          <div className="mr-2.5 h-1.5 w-[50px] rounded-full bg-green-950"></div>
          <div className="mr-2.5 h-1.5 w-[50px] rounded-full bg-green-950"></div>
          <div className="mr-2.5 h-1.5 w-[50px] rounded-full bg-green-950"></div>
          {/*<div className='mr-2.5 h-1.5 w-[50px] rounded-full bg-gray-1350'></div>*/}
        </div>
        <div className="mt-[9px] text-base font-semibold leading-none text-green-1450">
          3 of 3{' '}
        </div>
        {/*<div className='mt-[9px] text-base font-semibold leading-none text-green-1450'>*/}
        {/*  3 of 4{' '}*/}
        {/*</div>*/}
        <h1 className="mt-[35px] text-xl font-semibold leading-none text-black">
          Tell us about your product.
        </h1>
        <h2 className="mt-2.5 text-sm leading-tight text-gray-1150">
          {' '}
          Now the important part: we want to hear about your innovative product.
          Tell us all about it (and be as detailed as possible) so we can ensure
          it's a great fit for our millions of innovation-loving Shoppers.{' '}
        </h2>
        <div
          className="el-divider el-divider--horizontal mb-[40px] mt-[29px] border-gray-1350 px-[50px]"
          role="separator"
        ></div>
      </div>
      <form className="el-form el-form--default el-form--label-top flex">
        <div className="max-w-[555px] grow">
          <div className="text-lg font-semibold leading-tight text-gray-1050">
            {' '}
            Product Information{' '}
          </div>
          <SingleSelect
            className={'mt-[25px]'}
            label={'Product Category'}
            required
            list={categories}
            placeholder={'Select Category'}
            hint="If multiple, select your principle category"
            error={errors.category !== ''}
            labelError={errors.category}
            value={companyPrd.category.name}
            onChange={(e) => handleChange(e, 'category', true)}
          />
          <FormInput
            className={'mt-5'}
            label={'Product Name'}
            placeholder={'Enter Product Name'}
            required
            value={companyPrd.productName}
            onChange={(e) => handleChange(e, 'productName')}
            error={errors.prdName !== ''}
            labelError={errors.prdName}
          />
          <FormTextarea
            className={'mt-5'}
            label={'Product Description'}
            error={errors.prdDesc !== ''}
            labelError={errors.prdDesc}
            value={companyPrd.productDesc}
            placeholder={'Enter a description'}
            required
            limitCharacter={800}
            onChange={(e) => handleChange(e, 'productDesc')}
          />
        </div>
        <div
          className="el-divider el-divider--vertical mx-[60px] h-[291px] border-gray-1350"
          role="separator"
        ></div>
        <div className="max-w-[555px] grow">
          <div className="text-lg font-semibold leading-tight text-gray-1050">
            {' '}
            Product Validation{' '}
          </div>
          <SingleSelect
            label={'Shipping From'}
            placeholder={'Select Country'}
            value={companyPrd.shippingFrom?.name}
            className={'mt-[25px]'}
            list={countries.countries}
            onChange={(val) => {
              handleChange(val, 'shippingFrom', true)
            }}
          />
          <FormInput
            className={'mt-[25px]'}
            label={'Link to Product Page'}
            value={companyPrd.linkToPrdPage}
            onChange={(e) => handleChange(e, 'linkToPrdPage')}
            required
            placeholder={'https://'}
            error={errors.linkToPage !== ''}
            labelError={errors.linkToPage}
            isCheckMaxLength={false}
          />
          <FormInput
            className={'mt-[25px]'}
            label={'Link to Reviews'}
            value={companyPrd.linkToReview}
            onChange={(e) => handleChange(e, 'linkToReview')}
            placeholder={'https://'}
            error={errors.linkToReview !== ''}
            labelError={errors.linkToReview}
            isCheckMaxLength={false}
          />
        </div>
      </form>
      <div className="mt-10 flex">
        <button
          className="flex h-[50px] items-center justify-center rounded-md bg-[--brand-primary] px-6 hover:bg-[--brand-primary-hover] active:bg-[--brand-primary-pressed]"
          onClick={handleValidate}
        >
          <span className="text-lg font-semibold text-white select-none">
            {/*Next Step*/}
            Complete Application
          </span>
        </button>
        <button
          className="w-full rounded-md text-xs font-semibold px-2.5 text-black bg-transparent border border-gray-1350 hover:bg-gray-2150 ml-2.5 h-[50px] max-w-[120px] select-none"
          onClick={() => {
            backStep && backStep()
          }}
        >
          <span className="text-lg font-semibold">Back</span>
        </button>
      </div>
    </main>
  )
}

export default Step3
