import React, { FC, useEffect, useState } from 'react'
import { ICompanyDetails } from '.'
import { REGEX } from './helper'
import apis from 'apis'
import FormInput from 'components/FormInput/Input'
import SingleSelect from '../../SingleSelect'
import { useAdminContext } from 'context/adminContext'
import { createQuery } from 'utils/function'
import { useNavigate } from 'react-router-dom'

interface Step2Props {
  nextStep: () => void
  backStep: () => void
}

const Step2: FC<Step2Props> = ({ nextStep, backStep }) => {
  const { showAlert } = useAdminContext()
  const [companyDetails, setCompanyDetails] = useState<ICompanyDetails>({
    id: 0,
    name: '',
    website: '',
    supEmail: '',
    country: {
      id: "US",
      name: "United States"
    },
    address1: '',
    address2: '',
    zip: '',
    unit: '',
    province: '',
  })

  const [countries, setCountries] = useState({
    countries: [],
  })

  const [errors, setErrors] = useState({
    name: '',
    website: '',
    supEmail: '',
    country: '',
    address1: '',
    province: '',
    zip: '',
  })

  const [dropdownLoading, setDropdownLoading] = useState(true)

  const validate = (values: any) => {
    const listErrors = {
      name: '',
      website: '',
      supEmail: '',
      country: '',
      address1: '',
      province: '',
      zip: '',
    }
    if (values.name.trim() === '') {
      listErrors.name = 'Please input Company Name'
    }

    if (values.website.trim() === '') {
      listErrors.website = 'Please input Website'
    } else if (!REGEX.WEBSITE.test(values.website)) {
      listErrors.website = 'Please enter correct Website'
    }

    if (values.supEmail.trim() === '') {
      listErrors.supEmail = 'Please input Support Email'
    } else if (!REGEX.EMAIL.test(values.supEmail)) {
      listErrors.supEmail = 'Please enter correct Support EMail'
    }

    if (values.country.name === '') {
      listErrors.country = 'Please choose your Country'
    }

    if (values.address1.trim() === '') {
      listErrors.address1 = 'Please input Address1'
    }

    if (values.province.trim() === '') {
      listErrors.province = 'Please input Province/City'
    }

    if (values.zip.toString().trim() === '') {
      listErrors.zip = 'Please input Zip Code'
    } else if (values.zip.toString().length > 6) {
      listErrors.zip = 'Exceeded allowed number of characters (less than 6)'
    }

    return listErrors
  }

  const handleChange = (e: any, fieldName: string) => {
    setCompanyDetails({ ...companyDetails, [fieldName]: e.target.value })
  }
  const navigate = useNavigate()

  const handleValidate = () => {
    const listError = validate(companyDetails)
    if (
      listError.name === '' &&
      listError.zip === '' &&
      listError.province === '' &&
      listError.address1 === '' &&
      listError.country === '' &&
      listError.supEmail === '' &&
      listError.website === ''
    ) {
      setErrors({
        name: '',
        website: '',
        supEmail: '',
        country: '',
        address1: '',
        province: '',
        zip: '',
      })
      handleSubmit()
    } else {
      setErrors(listError)
    }
  }

  const handleSubmit = () => {
    const token =
      localStorage.getItem('ETWL') &&
      JSON.parse(localStorage.getItem('ETWL') || '')
    if (companyDetails.id < 1) {
      apis
        .post('wl-companies', {
          data: {
            name: companyDetails.name,
            website: companyDetails.website,
            support_email: companyDetails.supEmail,
            business_in_country: companyDetails.country.name,
            member: {
              connect: [token.id],
            },
            address: {
              address1: companyDetails.address1,
              address2: companyDetails.address2,
              city: companyDetails.province,
              country: companyDetails.country.id,
              country_code: companyDetails.country.id,
              country_name: companyDetails.country.name,
              zip: +companyDetails.zip,
              province: companyDetails.province,
              province_name: companyDetails.province,
            },
          },
        })
        .then((res) => {
          nextStep && nextStep()
        })
        .catch((err) => {
          showAlert('error', 'Update brand info: ' + err.message)
          console.log(err.message)
        })
    } else {
      apis
        .update('wl-companies', companyDetails.id, {
          data: {
            name: companyDetails.name,
            website: companyDetails.website,
            support_email: companyDetails.supEmail,
            business_in_country: companyDetails.country.name,
            address: {
              address1: companyDetails.address1,
              address2: companyDetails.address2,
              city: companyDetails.province,
              country: companyDetails.country.id,
              country_code: companyDetails.country.id,
              country_name: companyDetails.country.name,
              zip: +companyDetails.zip,
              province: companyDetails.province,
              province_name: companyDetails.province,
            },
          },
        })
        .then((res) => {
          nextStep && nextStep()
        })
        .catch((err) => {
          showAlert('error', 'Update brand info: ' + err.message)
          console.log(err.message)
        })
    }
  }

  const handleGetShop = () => {
    const token =
      localStorage.getItem('ETWL') &&
      JSON.parse(localStorage.getItem('ETWL') || '')
    apis
      .get(
        'wl-companies',
        createQuery({
          populate: {
            address: '*',
            logo: {
              fields: ['name', 'url'],
            },
          },
          filters: {
            member_id: token?.id,
          },
        })
      )
      .then((res) => {
        const item = res.data.data
        if (item.length > 0) {
          const { attributes } = item[0]

          const { address } = attributes

          setCompanyDetails({
            ...companyDetails,
            name: attributes.name,
            website: attributes.website,
            supEmail: attributes.support_email,
            address1: address?.address1 ? address?.address1 : '',
            address2: address?.address2 ? address?.address2 : '',
            country: {
              id: address?.country_code ? address?.country_code : '',
              name: address?.country_name ? address?.country_name : '',
            },
            province: address?.city ? address?.city : '',
            zip: address?.zip ? address?.zip : '',
          })
        }
      })
      .catch((err) => {
        showAlert('error', 'Something went wrong: Get brand info failed')
        navigate('/submit-your-product')
      })
  }

  const handleGetCountries = () => {
    setDropdownLoading(true)
    if (countries.countries.length < 1) {
      apis
        .getCountries()
        .then((res) => {
          setCountries((preState) => ({
            ...preState,
            countries: res.data.data.reduce((acc: any[], item: any) => {
              acc.push({
                id: item.iso2,
                name: item.name,
              })
              return acc
            }, []),
          }))
          setDropdownLoading(false)
        })
        .catch((err) => {
          console.log(err.message)
          setDropdownLoading(false)
        })
    }
  }

  useEffect(() => {
    handleGetCountries()
    handleGetShop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="w-full flex-1">
      <div className="mt-8">
        <div className="flex">
          <div className="mr-2.5 h-1.5 w-[50px] rounded-full bg-green-950"></div>
          <div className="mr-2.5 h-1.5 w-[50px] rounded-full bg-green-950"></div>
          <div className="mr-2.5 h-1.5 w-[50px] rounded-full bg-gray-1350"></div>
          {/*<div className='mr-2.5 h-1.5 w-[50px] rounded-full bg-gray-1350'></div>*/}
        </div>
        <div className="mt-[9px] text-base font-semibold leading-none text-green-1450">
          2 of 3{' '}
        </div>
        {/*<div className='mt-[9px] text-base font-semibold leading-none text-green-1450'>*/}
        {/*  2 of 4{' '}*/}
        {/*</div>*/}
        <h1 className="mt-[35px] text-xl font-semibold leading-none text-black">
          Tell us about your company.
        </h1>
        <h2 className="mt-2.5 text-sm leading-tight text-gray-1150">
          {' '}
          Shopper security is a top priority at Wishlist. We want to ensure that
          every product that launches on our platform is by a verified company.
          Please enter your company information below to continue with your
          application.{' '}
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
            Company Details{' '}
          </div>
          <FormInput
            placeholder="Enter Company Name"
            label="Company Name"
            required
            hint={
              'This should be your official company name, inclusive of suffix (LLC,Inc, etc.)'
            }
            error={errors.name !== ''}
            labelError={errors.name}
            className="mt-[30px]"
            value={companyDetails.name}
            onChange={(e) => handleChange(e, 'name')}
          />

          <FormInput
            label={'Website'}
            required
            placeholder={'https://'}
            value={companyDetails.website}
            error={errors.website !== ''}
            labelError={errors.website}
            className={'mt-5'}
            onChange={(e) => handleChange(e, 'website')}
          />

          <FormInput
            label={'Support Email'}
            required
            placeholder={'Enter Support Email'}
            value={companyDetails.supEmail}
            error={errors.supEmail !== ''}
            labelError={errors.supEmail}
            className={'mt-5'}
            onChange={(e) => handleChange(e, 'supEmail')}
          />

          <SingleSelect
            label={'Country of Incorporation'}
            required
            value={companyDetails.country.name}
            className={'mt-5'}
            placeholder={'Choose your country'}
            hint={
              'If multiple, select your principle country of incorporation.'
            }
            onChange={(val) => {
              setCompanyDetails((preState) => ({
                ...preState,
                country: val,
              }))
            }}
            list={countries.countries}
            error={errors.country !== ''}
            labelError={errors.country}
            loading={dropdownLoading}
          />
        </div>
        <div
          className="el-divider el-divider--vertical mx-[60px] h-[291px] border-gray-1350"
          role="separator"
        ></div>
        <div className="max-w-[555px] grow">
          <div className="text-lg font-semibold leading-tight text-gray-1050">
            {' '}
            Company Address{' '}
          </div>
          <div className="mt-[25px] flex">
            <FormInput
              className={' flex-1'}
              label={'Address Line 1'}
              placeholder={'Address Line 1'}
              error={errors.address1 !== ''}
              labelError={errors.address1}
              required
              value={companyDetails.address1}
              onChange={(e) => handleChange(e, 'address1')}
            />
            {/* <FormInput
              className={'w-fit'}
              label={'Suite / Unit'}
              value={companyDetails.unit}
              placeholder={'optional'}
              onChange={(e) => handleChange(e, 'unit')}
            /> */}
          </div>
          <FormInput
            className={'mt-5'}
            label={'Address Line 2'}
            value={companyDetails.address2}
            onChange={(e) => handleChange(e, 'address2')}
            placeholder={'Address Line 2 (optional)  '}
          />
          <div className="mt-5 flex space-x-2">
            <FormInput
              className={'flex-1'}
              label={'Province/City'}
              required
              value={companyDetails.province}
              onChange={(e) => handleChange(e, 'province')}
              error={errors.province !== ''}
              labelError={errors.province}
              placeholder={'Province/City'}
            />
            <FormInput
              label={'Zip'}
              required
              placeholder={'000000'}
              value={companyDetails.zip}
              onChange={(e) => {
                const REGEX_ZIP = /^[0-9]*$/
                if (REGEX_ZIP.test(e.target.value)) {
                  handleChange(e, 'zip')
                }
              }}
              error={errors.zip !== ''}
              labelError={errors.zip}
            />
          </div>
        </div>
      </form>
      <div className="mt-10 flex">
        <button
          className="flex h-[50px] items-center justify-center rounded-md bg-[--brand-primary] px-6 hover:bg-[--brand-primary-hover] active:bg-[--brand-primary-pressed] select-none"
          onClick={handleValidate}
        >
          <span className="text-lg font-semibold text-white">Next Step</span>
        </button>
        <button
          className="w-full rounded-md text-xs font-semibold px-2.5 text-black bg-transparent border border-gray-1350 hover:bg-gray-2150 ml-2.5 h-[50px] max-w-[120px] select-none"
          onClick={() => backStep && backStep()}
        >
          <span className="text-lg font-semibold">Back</span>
        </button>
      </div>
    </main>
  )
}

export default Step2
