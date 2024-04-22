import React, { useEffect, useState } from 'react'
import { ProductPanelProps } from './type'
import SingleSelect from 'components/SingleSelect'
import FormTextarea from 'components/FormTextarea/FormTextarea'
import apis from 'apis'
import { createQuery } from 'utils/function'
import MultiSelect from 'components/MultiSelect'
import { Link } from 'react-router-dom'

const PanelPrdPage: React.FC<ProductPanelProps> = ({
  data,
  onSetState,
  isCreate = true,
  errors,
}) => {
  const [tag, setTag] = useState<any>([])
  const [category, setCategory] = useState<any>([])
  // const [value, setValue] = useState<any>([])

  const handleGetTag = () => {
    apis.get('wl-prod-tags', createQuery({})).then((res) => {
      const { data } = res.data
      const list = data.reduce((acc: any[], { id, attributes }: any) => {
        acc.push({
          id: id,
          name: attributes.name,
        })
        return acc
      }, [])
      setTag(list)
    })
  }

  const handleGetCategory = () => {
    apis.get('wl-prod-cats', createQuery({})).then((res) => {
      const { data } = res.data
      const list = data.reduce((acc: any[], { id, attributes }: any) => {
        acc.push({
          id: id,
          name: attributes.name,
        })
        return acc
      }, [])
      setCategory(list)
    })
  }

  // const handleGetValue = () => {
  //   apis.get("wl-prod-values", createQuery({})).then((res) => {
  //   const {data} = res.data
  //   const list = data.reduce((acc: any[], {id, attributes}: any) => {
  //     acc.push({
  //       id: id,
  //       name: attributes.name,
  //     })
  //     return acc
  //   }, [])
  //   setValue(list)
  //   })
  // }

  useEffect(() => {
    handleGetTag()
    handleGetCategory()
    // handleGetValue()
  }, [])

  return (
    <div
      id="pane-Product Page"
      className="el-tab-pane"
      role="tabpanel"
      aria-hidden="true"
      aria-labelledby="tab-Product Page"
    >
      <div product-form-ref="[object Object]">
        <div>
          <h2 className="mt-[25px] text-sm font-medium leading-none tracking-tight text-black">
            Build Your Product Page
          </h2>
          <h3 className="mt-2.5 text-base leading-tight text-gray-1150">
            Showcase your product's unique features and benefits to encourage
            upvotes and purchases.
            <Link to="/">
              <span className="cursor-pointer text-green-950 underline decoration-solid">
                Click here to view an example.
              </span>
            </Link>
          </h3>
        </div>
        <div className="mt-[30px] flex">
          <div className="mr-[75px] w-full max-w-[520px] pb-5">
            <SingleSelect
              required
              label="Product Category"
              placeholder="Choose a category"
              list={category}
              value={data?.category?.name}
              onChange={(val) => {
                onSetState((preState) => ({
                  ...preState,
                  category: { id: +val.id, name: val.name },
                }))
              }}
              error={errors?.category !== ''}
              labelError={errors?.category}
            />
            <MultiSelect
              limit={3}
              label="Product Tags: Choose up to 3"
              placeholder="Select Relevant Tags"
              className="mt-[30px]"
              list={tag}
              value={data.tags}
              onChange={(val) => {
                onSetState((preState) => ({ ...preState, tags: val }))
              }}
            />

            <div className="el-form-item is-required asterisk-right mt-5">
              <FormTextarea
                required
                label="Product Headline"
                placeholder="Located below your product name at the top of the product page. Focus on the main benefit or problem your product solves."
                limitCharacter={40}
                value={data.prodDtl?.productHeadline}
                onChange={(e) => {
                  onSetState((preState) => ({
                    ...preState,
                    prodDtl: {
                      ...preState.prodDtl,
                      productHeadline: e.target.value,
                    },
                  }))
                }}
                error={errors?.prdHeadline !== ''}
                labelError={errors?.prdHeadline}
              />
            </div>
            <div className="el-form-item is-required asterisk-right mt-5">
              <FormTextarea
                required
                label="Product Page Headline"
                placeholder="Bold copy that kicks off your Product Page description; quickly highlight what your product is and how it solves a problem. Be sure to grab attention!"
                limitCharacter={100}
                value={data.prodDtl?.productPageHeadline}
                onChange={(e) => {
                  onSetState((preState) => ({
                    ...data,
                    prodDtl: {
                      ...preState.prodDtl,
                      productPageHeadline: e.target.value,
                    },
                  }))
                }}
                error={errors?.prdPageHeadline !== ''}
                labelError={errors?.prdPageHeadline}
              />
            </div>
            <div className="el-form-item is-required asterisk-right mt-5">
              <FormTextarea
                required
                label="Product Page Description"
                placeholder="The intro paragraph on your Product Page. Tell a brief story about what your product is, why it's unique, and how it helps Shoppers. Show off your brand's voice and personality!"
                limitCharacter={800}
                value={data.prodDtl?.productPageDesc}
                onChange={(e) => {
                  onSetState((preState) => ({
                    ...preState,
                    prodDtl: {
                      ...preState.prodDtl,
                      productPageDesc: e.target.value,
                    },
                  }))
                }}
                error={errors?.prdPageDesc !== ''}
                labelError={errors?.prdPageDesc}
              />
            </div>
          </div>
          <div className="w-full max-w-[520px]">
            <p className="mb-3 text-xs font-medium leading-none text-slate-1050">
              Why You’ll Love It
            </p>
            <p className="mt-2.5 text-base text-gray-1150">
              Add up to 5 reasons why Shoppers will love having your product.
            </p>
            <div className="el-form-item asterisk-right mt-3">
              <FormTextarea
                label=""
                placeholder="Reason 1"
                limitCharacter={80}
                value={data.wyli?.reason1}
                onChange={(e) => {
                  onSetState((preState) => ({
                    ...preState,
                    wyli: {
                      ...preState.wyli,
                      reason1: e.target.value,
                    },
                  }))
                }}
                // error={errors.prdDesc !== ''}
                // labelError={errors.prdDesc}
              />
            </div>
            <div className="el-form-item asterisk-right mt-3">
              <FormTextarea
                label=""
                placeholder="Reason 2"
                limitCharacter={80}
                value={data.wyli?.reason2}
                onChange={(e) => {
                  onSetState((preState) => ({
                    ...preState,
                    wyli: {
                      ...preState.wyli,
                      reason2: e.target.value,
                    },
                  }))
                }}
                // error={errors.prdDesc !== ''}
                // labelError={errors.prdDesc}
              />
            </div>
            <div className="el-form-item asterisk-right mt-3">
              <FormTextarea
                label=""
                placeholder="Reason 3"
                limitCharacter={80}
                value={data.wyli?.reason3}
                onChange={(e) => {
                  onSetState((preState) => ({
                    ...preState,
                    wyli: {
                      ...preState.wyli,
                      reason3: e.target.value,
                    },
                  }))
                }}
                // error={errors.prdDesc !== ''}
                // labelError={errors.prdDesc}
              />
            </div>
            <div className="el-form-item asterisk-right mt-3">
              <FormTextarea
                label=""
                placeholder="Reason 4"
                limitCharacter={80}
                value={data.wyli?.reason4}
                onChange={(e) => {
                  onSetState((preState) => ({
                    ...preState,
                    wyli: {
                      ...preState.wyli,
                      reason4: e.target.value,
                    },
                  }))
                }}
                // error={errors.prdDesc !== ''}
                // labelError={errors.prdDesc}
              />
            </div>
            <div className="el-form-item asterisk-right mt-3">
              <FormTextarea
                label=""
                placeholder="Reason 5"
                limitCharacter={80}
                value={data.wyli?.reason5}
                onChange={(e) => {
                  onSetState((preState) => ({
                    ...preState,
                    wyli: {
                      ...preState.wyli,
                      reason5: e.target.value,
                    },
                  }))
                }}
                // error={errors.prdDesc !== ''}
                // labelError={errors.prdDesc}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PanelPrdPage
