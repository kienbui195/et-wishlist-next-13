import React, { Fragment, useEffect, useState } from 'react'
import ClipCard from './ClipComponent/ClipCard'
import apis from 'apis'
import { convertKeys, createQuery } from 'utils/function'
import { useSelector } from 'react-redux'
import { RootState } from 'app/store'
import Modal from 'components/CustomModal'
import FormInputMedia from 'components/FormInputMedia'
import FormTextarea from 'components/FormTextarea/FormTextarea'
import SingleSelect from 'components/SingleSelect'
import MuteOffSvg from 'assets/svg/MuteOff.svg'
import MuteOnSvg from 'assets/svg/MuteOn.svg'
import { useAdminContext } from 'context/adminContext'
import DashboardButton from '../Components/Button'

interface IProductClip {
  id: string | number
  name: string
}

export interface IWlClip {
  id?: number
  clip: {
    id: number
    url: string
    name: string
  }
  desc: string
  shopId: number
  memberId?: number
  views?: number
  likes?: number
  product?: IProductClip
  useAsClipOurStory?: boolean
}

interface IWlClipErr {
  video?: string
  desc?: string
  product?: string
}

const BrandClip = () => {
  const { showAlert } = useAdminContext()
  const shopInfo = useSelector((state: RootState) => state.shop.shop)
  const user = useSelector((state: RootState) => state.user.user)
  const initStateForm: IWlClip = {
    id: 0,
    clip: {
      id: 0,
      url: '',
      name: '',
    },
    desc: '',
    shopId: 0,
    memberId: 0,
    views: 0,
    likes: 0,
    product: {
      id: 0,
      name: '',
    },
    useAsClipOurStory: false,
  }

  const initStateError: IWlClipErr = {
    video: '',
    desc: '',
    product: '',
  }
  const [clips, setClips] = useState<IWlClip[]>([])
  const [form, setForm] = useState<IWlClip>(initStateForm)
  const [products, setProducts] = useState<IProductClip[]>([])
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [muteClip, setMuteClip] = useState<boolean>(true)
  const [modalType, setModalType] = useState<'add' | 'edit'>('add')
  const [errorMessage, setErrorMessage] = useState<IWlClipErr>(initStateError)

  const handleOpenModalForm = (id?: number) => {
    setForm({ ...form, shopId: +shopInfo.id, memberId: user.id })
    setVisibleModal(true)
    if (id) {
      setModalType('edit')
      getClip(id)
    } else {
      setModalType('add')
    }
  }

  const handleCloseModalForm = () => {
    setMuteClip(true)
    setVisibleModal(false)
    setForm(initStateForm)
    setErrorMessage(initStateError)
  }

  const getClip = (id: number) => {
    apis
      .getOne(
        'wl-clips',
        id,
        createQuery({
          populate: {
            clip: {
              fields: ['name', 'url'],
            },
            product: {
              fields: ['name'],
            },
            story_prod: {
              fields: ['name'],
            },
          },
          filters: {
            shop_id: shopInfo.id,
          },
          // TODO: phân trang theo load more hoặc next page
        })
      )
      .then((res) => {
        const { data } = res.data
        const item = convertKeys({ id: data.id, ...data.attributes })
        const clip: IWlClip = {
          ...item,
          clip: {
            id: item.clip.data?.id,
            ...item.clip.data?.attributes,
          },
          product: {
            id: item.product.data?.id,
            ...item.product.data?.attributes,
          },
        }
        setForm({ ...form, ...clip })
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  const getClips = () => {
    apis
      .get(
        'wl-clips',
        createQuery({
          populate: {
            clip: {
              fields: ['name', 'url'],
            },
            story_prod: {
              fields: ['name'],
            },
            product: {
              fields: ['name'],
            },
          },
          filters: {
            shop_id: shopInfo.id,
          },
          // TODO: phân trang theo load more hoặc next page
        })
      )
      .then((res) => {
        const { data } = res.data
        const list: IWlClip[] = convertKeys(
          data.map(({ id, attributes }: any) => ({
            id,
            ...attributes,
            clip: {
              id: attributes.clip.data?.id,
              ...attributes.clip.data?.attributes,
            },
            product: {
              id: attributes.product.data?.id,
              ...attributes.product.data?.attributes,
            },
          }))
        )
        setClips(list)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  const getProducts = () => {
    apis
      .get(
        'wl-products',
        createQuery({
          fields: ['name'],
          filters: {
            shop: {
              id: shopInfo.id,
            },
          },
          // TODO: phân trang theo load more hoặc next page
        })
      )
      .then((res) => {
        const data = convertKeys(res.data.data)
        const list: IProductClip[] = data.map(
          ({ id, attributes }: { id: number; attributes: any }) => ({
            id,
            ...attributes,
          })
        )
        setProducts(list)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  const handleValidate = () => {
    const { clip, product, desc } = form
    let error = false

    setErrorMessage({
      ...errorMessage,
      video: clip.url === '' ? 'Please select a video' : '',
      product: !product || product.id === 0 ? 'Please select a product' : '',
      desc: desc === '' ? 'Please enter the description of video' : '',
    })
    if (
      clip.url === '' ||
      !product ||
      product.id === 0 ||
      desc === '' ||
      desc.length > 250
    ) {
      error = true
    }
    return {
      error,
    }
  }

  const handleCreateWlClip = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { error } = handleValidate()
    if (!error) {
      apis
        .post('wl-clips', {
          data: {
            ...convertKeys(form, false),
          },
        })
        .then((res) => {
          handleCloseModalForm()
          getClips()
          showAlert('success', 'Add Clip Successfully')
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
  }

  const handleUpdateWlClip = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { error } = handleValidate()
    if (!error && form.id) {
      apis
        .update('wl-clips', form.id, {
          data: {
            ...convertKeys(form, false),
          },
        })
        .then((res) => {
          handleCloseModalForm()
          getClips()
          showAlert('success', 'Edit Clip Successfully')
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
  }

  const handleDelete = (id: number) => {
    apis
      .del('wl-clips', id)
      .then((res) => {
        const { data } = res.data
        showAlert('success', 'Successfully deleted clip id ' + data.id)
        getClips()
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  useEffect(() => {
    if (shopInfo.id) {
      getClips()
      getProducts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopInfo])

  useEffect(() => {
    document.title = 'ET Wishlist | Brand Clips'
  }, [])

  return (
    <Fragment>
      <main className="w-full px-10 py-7">
        <div className="brand-clips flex w-full items-end justify-between space-x-5">
          <div>
            <span className="text-10 font-bold leading-none tracking-wide text-gray-1150">
              CLIPS
            </span>
            <h1 className="mt-3 text-xl font-semibold leading-none tracking-tight text-black">
              My Clips
            </h1>
            <h2 className="font-base mt-[11px] leading-none text-gray-1150">
              Bring your product to life with entertaining and informative
              videos (:60 or less) – they can help you drive more sales.
            </h2>
          </div>
          <DashboardButton
            label="Add New Clip"
            onClick={() => handleOpenModalForm()}
          />
        </div>
        <div
          className="el-divider el-divider--horizontal mb-10 mt-5 w-full border-gray-1350 border-t-[1px]"
          role="separator"
        ></div>
        <div className="flex w-full flex-wrap space-x-3 space-y-[30px]">
          {clips.map((clip, idx) => {
            return (
              <ClipCard
                key={idx}
                data={clip}
                onClick={handleOpenModalForm}
                handleDelete={handleDelete}
              />
            )
          })}
        </div>
      </main>
      {visibleModal && (
        <Modal onClose={handleCloseModalForm} classNameContainer="w-[821px]">
          <form
            className="el-form el-form--default el-form--label-top"
            onSubmit={
              modalType === 'add' ? handleCreateWlClip : handleUpdateWlClip
            }
          >
            <div className="flex items-center justify-between border-b border-gray-1350 px-10 pb-[15px] pt-3">
              <span className="text-lg font-semibold text-black">
                <span className="capitalize">{modalType}</span> Clip
              </span>
              <DashboardButton label="Save Clip" buttonType="submit" />
            </div>
            <div className="flex justify-between px-10 py-[23px]">
              <div className="w-full">
                {modalType === 'add' && (
                  <>
                    <span className="flex space-x-1 text-sm font-medium leading-none text-slate-1050">
                      Select Video<div className="text-[--state-error]">*</div>
                    </span>
                    <p className="mt-2.5 text-base text-gray-1150">
                      Pro Tip: Choose videos that are entertaining and
                      interesting as much as they are informative.
                    </p>
                    <div className="mt-[15px]">
                      <FormInputMedia
                        required
                        accept="video/*"
                        buttonLabel="Upload Video"
                        showPreview={false}
                        onChange={(val) => {
                          setForm((preState) => ({
                            ...preState,
                            clip: val,
                          }))
                        }}
                        error={errorMessage.video !== ''}
                        labelError={errorMessage.video}
                      />
                    </div>
                  </>
                )}
                <div className="el-form-item is-required asterisk-right mt-5">
                  <FormTextarea
                    required
                    label="Description"
                    limitCharacter={250}
                    value={form.desc}
                    onChange={(e) => {
                      setForm((preState) => ({
                        ...preState,
                        desc: e.target.value,
                      }))
                    }}
                    textareaClass={
                      modalType === 'edit' ? 'h-[230px]' : undefined
                    }
                    error={errorMessage.desc !== ''}
                    labelError={errorMessage.desc}
                  />
                </div>
                <div className="el-form-item is-required asterisk-right mt-[25px]">
                  <SingleSelect
                    required
                    label="Product"
                    list={products}
                    placeholder="Select Product"
                    value={form.product?.name}
                    onChange={(val) => {
                      setForm((preState) => ({
                        ...preState,
                        product: {
                          id: val.id,
                          name: val.name,
                        },
                      }))
                    }}
                    error={errorMessage.product !== ''}
                    labelError={errorMessage.product}
                  />
                </div>
                <div className="mt-[25px] flex items-center space-x-1 leading-[16px] box-border">
                  <span className="">
                    <input
                      id="our-story-check-box"
                      className="cursor-pointer"
                      type="checkbox"
                      value="Use this as the Clip for Our Story"
                      checked={form.useAsClipOurStory}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          useAsClipOurStory: e.target.checked,
                        })
                      }}
                    />
                  </span>
                  <label
                    htmlFor="our-story-check-box"
                    className="flex items-center cursor-pointer leading-[16px]"
                  >
                    <span className="pl-2 select-none">
                      Use this as the Clip for Our Story
                    </span>
                  </label>
                </div>
              </div>
              {form.clip.url ? (
                <div className="relative ml-10 mt-5 h-[389px] w-[222px] shrink-0 overflow-hidden rounded-[10px] bg-gray-1350">
                  <video
                    autoPlay
                    muted={muteClip}
                    loop
                    className="absolute inset-0 h-full w-full object-cover"
                    src={process.env.NEXT_PUBLIC_BE_URL + form.clip.url}
                  />
                  <div className="absolute right-2.5 top-3.5">
                    <img
                      src={MuteOffSvg}
                      alt=""
                      width="22"
                      height="22"
                      className={`w-[22px] drop-shadow-mute cursor-pointer ${
                        muteClip ? 'hidden' : ''
                      }`}
                      onClick={() => setMuteClip(true)}
                    />
                    <img
                      src={MuteOnSvg}
                      width="18.5"
                      height="15"
                      alt=""
                      className={`drop-shadow-mute cursor-pointer ${
                        !muteClip ? 'hidden' : ''
                      }`}
                      onClick={() => setMuteClip(false)}
                    />
                  </div>
                </div>
              ) : (
                <div className="relative ml-10 mt-5 h-[389px] w-[222px] shrink-0 overflow-hidden rounded-[10px] bg-gray-1350"></div>
              )}
            </div>
          </form>
        </Modal>
      )}
    </Fragment>
  )
}

export default BrandClip
