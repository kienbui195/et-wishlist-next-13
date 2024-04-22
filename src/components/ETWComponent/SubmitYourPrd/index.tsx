import React, { useEffect, useState } from 'react'
import './index.css'
import Step4 from './Step4'
import Step3 from './Step3'
import Step2 from './Step2'
import Step1 from './Step1'
import Step0 from './Step0'
import NotInstallApp from './NotInstallApp'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'app/store'
import apis from 'apis'
import { createQuery } from 'utils/function'
import LoadingScreen from 'components/LoadingScreen'
import { IDropdownItem } from 'data/wl-types'
import { File } from 'buffer'
import StepFinal from './StepFinal'
import { useAdminContext } from 'context/adminContext'
import { updateShopInfo } from 'features/authenticate/shopSlice'
import { setOpenModalLogin } from 'features/authenticate/loginSlice'
export interface IBasicInfo {
  firstName: string
  lastName: string
  phone: string
  role: IDropdownItem
  reasonKnowET: string
  email: string
}

export interface ICompanyDetails {
  id: number
  name: string
  website: string
  supEmail: string
  country: IDropdownItem
  address1: string
  address2?: string
  province: string
  zip: string
  unit?: string
  currency?: string
}

export interface ICompanyProduct {
  category: IDropdownItem
  productName: string
  productDesc: string
  shippingFrom?: IDropdownItem
  linkToPrdPage: string
  linkToReview?: string
}

export interface ICompanyMedia {
  logo: File
  images: File[]
  video: File
}

function SubmitYourPrd() {
  const [step, setStep] = useState(0)
  const userInfo =
    localStorage.getItem('ETWL') &&
    JSON.parse(localStorage.getItem('ETWL') || '')
  const location = useLocation()
  const queryShop = new URLSearchParams(location.search).get('shop')  
  let timer: ReturnType<typeof setTimeout> | null = null
  const [loading, setLoading] = useState(true)
  const { showAlert } = useAdminContext()
  const shop = useSelector((state: RootState) => state.shop.shop)
  const [installShopifyApp, setInstallShopifyApp] = useState(false)
  const [shopId, setShopId] = useState(0)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleQueryShop = async () => {
    const fetchShopInfo = await apis.get(
      `wl-shops`,
      createQuery({
        populate: '*',
        filters: {
          domain: queryShop,
        },
      })
    )

    const shopInfo = fetchShopInfo.data?.data[0]
    const memberId = shopInfo?.attributes?.member_id
    if (!memberId) {
      apis
        .update(`wl-shops`, shopInfo?.id, {
          data: {
            member: {
              set: [userInfo.id],
            },
            member_id: userInfo.id,
            connected: true,
          },
        })
        .then((res) => {
          setInstallShopifyApp(true)
          setShopId(res.data.data.id)
          dispatch(
            updateShopInfo({
              id: res.data.data.id,
              connected: res.data.data.attributes.connected,
              active: res.data.data.attributes.active,
            })
          )
          setLoading(false)
        })
        .catch((err) => {
          showAlert('error', err.message)
          setLoading(false)
          console.log(err)
        })
    }
    if (memberId && shopInfo?.attributes?.connected) {
      setInstallShopifyApp(true)
      setShopId(shopInfo.id)
      dispatch(
        updateShopInfo({
          id: shopInfo.id,
          connected: shopInfo.attributes.connected,
          active: shopInfo.attributes.active,
        })
      )
    }
  }

  const handleData = () => {
    apis
      .checkLogin()
      .then((res) => {  
        if (res.data.wl_shop?.active) {
          navigate('/brand-dashboard')
        }
        if (res.data.wl_shop?.connected) {
          setInstallShopifyApp(true)
        } else {
          setInstallShopifyApp(false)
        }
        res.data.wl_shop && setShopId(res.data.wl_shop.id)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleLoadingPage = () => {
    setLoading(false)
  }

  const handleUpdateShop = () => {
    if (shopId > 0) {
      apis
        .update('wl-shops', shopId, {
          data: { active: true },
        })
        .then((res) => {
          showAlert('success', 'Added shop information successfully')
          setStep(6)
          dispatch(updateShopInfo({ ...shop, id: shopId, active: true }))
        })
        .catch((err) => {
          showAlert('error', 'Added shop information: ' + err.message)
        })
    }
  }

  useEffect(() => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    timer = setTimeout(handleLoadingPage, 500)
  }, [])

  useEffect(() => {
    if (queryShop) {
      handleQueryShop()
    } else {
      handleData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryShop])

  useEffect(() => {
    if (!userInfo) {
      navigate('/')
      dispatch(setOpenModalLogin(true))
      showAlert('warning', 'This feature requires logging in to use')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo])

  if (loading) return <LoadingScreen />

  return installShopifyApp ? (
    <div className="w-full h-full md:et-container et-container-sm ">
      {(step === 0 || step === 5) && (
        <Step0
          handleSubmit={() => {
            handleUpdateShop()
          }}
          step={step}
          nextStep={() => setStep(step + 1)}
        />
      )}

      {/*Start Step1 */}

      {step === 1 && <Step1 nextStep={() => setStep(2)} />}

      {/*End Step1 */}

      {/* //////////////////////////////////////////////////////////////////////// */}
      {/*Start Step2 */}

      {step === 2 && (
        <Step2
          nextStep={() => {
            setStep(3)
          }}
          backStep={() => setStep(1)}
        />
      )}

      {/*End Step2 */}

      {/* //////////////////////////////////////////////////////////////////////// */}
      {/*Start Step3 */}
      {step === 3 && (
        <Step3
          nextStep={() => {
            setStep(5)
          }}
          backStep={() => setStep(2)}
          shopId={shopId}
        />
      )}

      {/*End Step3 */}

      {/* //////////////////////////////////////////////////////////////////////// */}
      {/*Start Step4 */}

      {step === 4 && (
        <Step4 step={step} nextStep={() => {}} backStep={() => setStep(3)} />
      )}

      {step === 6 && <StepFinal />}

      {/*End Step4 */}
    </div>
  ) : (
    <div className="w-full h-full md:et-container et-container-sm">
      <NotInstallApp />
    </div>
  )
}

export default SubmitYourPrd
