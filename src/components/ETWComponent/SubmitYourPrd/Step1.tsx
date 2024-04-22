import { RootState } from 'app/store'
import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FormInput from '../../FormInput/Input'
import MailIcon from '../../../assets/svg/MailIcon.svg'
import { PHONE_NUMBER_CODE, REGEX } from './helper'
import SingleSelect from 'components/SingleSelect'
import { IDropdownItem } from 'data/wl-types'
import PersonIcon from '../../../assets/svg/PersonIcon.svg'
import PhoneNumberInput from 'components/PhoneNumberInput'
import { IBasicInfo } from '.'
import apis from '../../../apis'
import { useAdminContext } from 'context/adminContext'
import { setUser } from 'features/authenticate/userSlice'
import { createQuery } from 'utils/function'
import { ENUM_WL_SYS_CONFIG }from 'utils/constants'

interface Step1Props {
  nextStep: () => void
}

interface IPhoneNumberCode {
  code: IDropdownItem
  list: IDropdownItem[]
}

export interface IBasicInfoState {
  firstName: string
  lastName: string
  phone: string
  role: IDropdownItem
  reasonKnowET: string
}

const Step1: FC<Step1Props> = ({ nextStep }) => {
  const userInfo = useSelector((state: RootState) => state.user.user)
  let [, codePart = '', phoneNumberPart = ''] = (userInfo &&
    userInfo.phone &&
    userInfo.phone.match(REGEX.SPLIT_AREA_CODE_VS_PHONE_NUMBER)) || ['', '+1', '']
  let indexCode = PHONE_NUMBER_CODE.findIndex((item) => item.id === codePart)
  let nameCodePart: string = codePart
    ? indexCode !== -1
      ? PHONE_NUMBER_CODE[indexCode].name
      : 'United States'
    : 'United States'

  const [basicInfo, setBasicInfo] = useState<IBasicInfo>({
    firstName: userInfo.first_name || '',
    lastName: userInfo.last_name || '',
    phone: phoneNumberPart,
    role: {
      id: userInfo.business_role?.id || '',
      name: userInfo.business_role?.name || '',
    },
    reasonKnowET: userInfo.how_did_you_hear || '',
    email: userInfo.email || '',
  })

  const [codePhoneNumber, setCodePhoneNumber] = useState<IPhoneNumberCode>({
    code: {
      id: codePart || '+1',
      name: nameCodePart || 'United States',
    },
    list: PHONE_NUMBER_CODE.reduce((acc: IDropdownItem[], item) => {
      const { id, name } = item
      acc.push({
        id,
        name,
      })
      return acc
    }, []),
  })

  const handleOnchange = (value: any, stateName: string) => {
    setBasicInfo({ ...basicInfo, [stateName]: value })
  }
  const [businessRoles, setBusinessRoles] = useState([])

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    role: '',
    reasonKnowET: '',
  })  

  const dispatch = useDispatch()

  const { showAlert } = useAdminContext()

  const validate = (values: any) => {
    const listErrors = {
      firstName: '',
      lastName: '',
      phone: '',
      role: '',
      reasonKnowET: '',
    }
    if (values.firstName.trim() === '') {
      listErrors.firstName = 'Please input First Name'
    }

    if (values.lastName.trim() === '') {
      listErrors.lastName = 'Please input Last Name'
    }    
    
    if (codePhoneNumber.code.id === '') {
      listErrors.phone = 'Please choose one Country Code'
    } else if (values.phone.trim() === '') {
      listErrors.phone = 'Please input Phone Number'
    } else if (!REGEX.ALLOW_CHARACTERS.test(values.phone)) {
      listErrors.phone = 'Invalid Phone Number'
    }

    if (values.reasonKnowET.trim() === '') {
      listErrors.reasonKnowET = 'Please input How did you hear about us'
    }

    if (values.role.name === '') {
      listErrors.role = 'Please choose a Role'
    }

    return listErrors
  }

  const handleData = (e: any) => {
    e.preventDefault()
    const listError = validate(basicInfo)
    if (
      listError.firstName === '' &&
      listError.lastName === '' &&
      listError.role === '' &&
      listError.reasonKnowET === '' &&
      listError.phone === ''
    ) {
      setErrors({
        firstName: '',
        lastName: '',
        phone: '',
        role: '',
        reasonKnowET: '',
      })
      handleSubmit()
    } else {
      setErrors(listError)
    }
  }

  const handleSubmit = () => {
    if (userInfo.id) {
      apis
        .update('users', userInfo.id, {
          first_name: basicInfo.firstName,
          last_name: basicInfo.lastName,
          phone: `(${codePhoneNumber.code.id}) ` + basicInfo.phone.trim(),
          business_role: {
            connect: [basicInfo.role.id],
          },
          wl_member_type: {
            connect: [ENUM_WL_SYS_CONFIG.DEFAULT_MEMBER],
          },
          how_did_you_hear: basicInfo.reasonKnowET,
        })
        .then((res) => {
          dispatch(
            setUser({
              first_name: basicInfo.firstName,
              last_name: basicInfo.lastName,
              phone: `(${codePhoneNumber.code.id}) ` + basicInfo.phone.trim(),
              business_role: {
                id: basicInfo.role.id,
                name: basicInfo.role.name,
              },
              how_did_you_hear: basicInfo.reasonKnowET,
            })
          )
          nextStep && nextStep()
        })
        .catch((err) => {
          showAlert('error', 'Update user information: ' + err.message)
          console.log(err.message)
        })
    }
  }

  const handleGetBusinessRole = () => {
    apis
      .get(
        'wl-bus-roles',
        createQuery({
          fields: ['name'],
        })
      )
      .then((res) => {
        const data = res.data.data
        if (data.length > 0) {
          const list = data.reduce((acc: IDropdownItem[], item: any) => {
            acc.push({
              id: item.id,
              name: item.attributes.name,
            })
            return acc
          }, [])
          setBusinessRoles(list)
        }
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  useEffect(() => {
    handleGetBusinessRole()
  }, [])

  return (
    <main className="w-full flex-1">
      <div className="mt-8">
        <div className="flex">
          <div className="mr-2.5 h-1.5 w-[50px] rounded-full bg-green-950"></div>
          <div className="mr-2.5 h-1.5 w-[50px] rounded-full bg-gray-1350"></div>
          <div className="mr-2.5 h-1.5 w-[50px] rounded-full bg-gray-1350"></div>
          {/*<div className="mr-2.5 h-1.5 w-[50px] rounded-full bg-gray-1350"></div>*/}
        </div>
        <div className="mt-[9px] text-base font-semibold leading-none text-green-1450">
          1 of 3 {/*1 of 4{' '}*/}
        </div>
        <h1 className="mt-[35px] text-xl font-semibold leading-none text-black">
          Tell us about yourself.
        </h1>
        <h2 className="mt-2.5 text-sm leading-tight text-gray-1150">
          Wishlist was created for Makers, innovators and entrepreneurs just
          like you. We're thrilled you're here and we’re excited to get to know
          you better.{' '}
        </h2>
        <div
          className="el-divider el-divider--horizontal mb-[40px] mt-[29px] border-gray-1350 px-[50px]"
          role="separator"
        ></div>
      </div>
      <div className="flex">
        <div className="w-[555px]">
          <div className="text-lg font-semibold leading-tight text-gray-1050">
            {' '}
            Your E-Mail Address{' '}
          </div>
          <form className="el-form el-form--default el-form--label-top mb-0 mt-[25px]">
            <FormInput
              label="E-Mail Address"
              required
              value={userInfo.email}
              disabled
              startIcon={MailIcon}
            />
          </form>
          <div className="mt-3 text-xs font-normal leading-normal text-gray-2050 hidden">
            {' '}
            In order to change e-mail please{' '}
            <span className="cursor-pointer font-semibold text-black underline underline-offset-2">
              {' '}
              reset account{' '}
            </span>
          </div>
        </div>
        <div
          className="el-divider el-divider--vertical mx-[60px] h-[291px] border-gray-1350"
          role="separator"
        ></div>
        <form className="el-form el-form--default el-form--label-top">
          <div className="text-lg font-semibold leading-tight text-gray-1050">
            {' '}
            Your Contact Details{' '}
          </div>
          <div className="mt-[25px] grid max-w-[555px] grid-cols-2 gap-[15px]">
            <FormInput
              label="First Name"
              required
              value={basicInfo.firstName}
              onChange={(e) => handleOnchange(e.target.value, 'firstName')}
              labelError={errors.firstName}
              error={errors.firstName !== ''}
            />
            <FormInput
              label="Last Name"
              required
              value={basicInfo.lastName}
              labelError={errors.lastName}
              onChange={(e) => handleOnchange(e.target.value, 'lastName')}
              error={errors.lastName !== ''}
            />
          </div>
          <div className="max-w-[480px]">
            <PhoneNumberInput
              label="Phone Number"
              required
              list={PHONE_NUMBER_CODE}
              className="mt-4"
              value={basicInfo.phone}
              onChangeDropdown={(e) => {
                setCodePhoneNumber({ ...codePhoneNumber, code: e })
              }}
              onChangeInput={(e) => {
                if (REGEX.ALLOW_CHARACTERS.test(e.target.value)) {
                  handleOnchange(e.target.value, 'phone')
                }
              }}
              prefixValue={codePhoneNumber.code.id}
              error={errors.phone !== ''}
              labelError={errors.phone}
              valueSelected={codePhoneNumber.code}
            />

            <SingleSelect
              label="Role"
              required
              list={businessRoles}
              value={basicInfo.role.name}
              onChange={(val) => handleOnchange(val, 'role')}
              placeholder="Select role at company"
              startIcon={PersonIcon}
              className="mt-4"
              error={errors.role !== ''}
              labelError={errors.role}
            />
            <FormInput
              className="mt-4"
              label="How did you hear about us?"
              value={basicInfo.reasonKnowET}
              onChange={(e) => handleOnchange(e.target.value, 'reasonKnowET')}
              required
              labelError={errors.reasonKnowET}
              error={errors.reasonKnowET !== ''}
            />
          </div>
        </form>
      </div>
      <div className="mt-10 flex">
        <button
          className="flex h-[50px] items-center justify-center rounded-md bg-[--brand-primary] px-6 hover:bg-[--brand-primary-hover] active:bg-[--brand-primary-pressed]"
          onClick={handleData}
          tabIndex={-1}
        >
          <span className="text-lg font-semibold text-white">Next Step</span>
        </button>
      </div>
    </main>
  )
}

export default Step1
