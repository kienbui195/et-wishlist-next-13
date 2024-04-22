import React, { FC, useEffect, useRef, useState } from 'react'
import apis from 'apis'
import { SpProduct, WLShopsBasicProps } from 'data/types'
import PlaceholderImagePrd from '../../../assets/svg/PlaceHolderImagePrd.svg'
import SingleSelect from 'components/SingleSelect'
import { CreateProductFormState } from './type'
import Modal from 'components/CustomModal'
import { createQuery } from 'utils/function'

type prdSelected = SpProduct | null
interface Props {
  productSelected: prdSelected
  callback: (value: SpProduct) => void
  data: CreateProductFormState
  onSetState: React.Dispatch<React.SetStateAction<CreateProductFormState>>
  errors?: any
}

const PanelConnection: FC<Props> = ({
  productSelected,
  callback,
  data,
  onSetState,
  errors
}) => {
  const [showListPrd, setShowListPrd] = useState(false)
  const [products, setProducts] = useState<SpProduct[]>([])
  const [connectionData, setConnectionData] =
    useState<WLShopsBasicProps | null>(null)
  const [pagination, setPagination] = useState({
    endCursor: '',
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: '',
    page: 1,
    pageSize: 10,
  })
  const listProdModalRef = useRef<HTMLDivElement>(null)

  const userId =
    localStorage.getItem('ETWL') &&
    JSON.parse(localStorage.getItem('ETWL') || '')?.id

  useEffect(() => {
    if (userId) {
      apis
        .get('wl-shops', createQuery({
          filters: {
            member: {
              id: userId
            }
          }
        }))
        .then((res) => {
          setConnectionData(res.data.data[0].attributes)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [userId])

  const handleGetSpProducts = () => {
    apis
    .get('getProducts', createQuery({
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        endCursor: pagination.endCursor,
      }
    }))
    .then((res) => {
      const {products: listProducts, pagination: {
        pageInfo
      }} = res.data
      const list = listProducts
      setProducts(pageInfo.page === 1 ? list : products.concat(list))
      setPagination({...pagination, ...pageInfo})
    })
    .catch((err) => {
      console.log(err.message)
    })
  }


  useEffect(() => {
    handleGetSpProducts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page])

  const renderSelectedPrd = () => {
    return productSelected ? (
      <div
        className="el-form-item is-required asterisk-right"
        role="group"
        aria-labelledby="el-id-8102-0"
      >
        <div id="el-id-8102-0" className="el-form-item__label">
          Product Connection
        </div>
        <div className="el-form-item__content">
          <div className="manage-select-block cursor-default-important flex w-full flex-row justify-between">
            <div className="flex flex-row">
              <div className="mr-4">
                <img
                  className="object-cover"
                  width="50"
                  height="50"
                  src={
                    productSelected.images.nodes &&
                    productSelected.images.nodes.length > 0
                      ? productSelected?.images?.nodes[0]?.url
                      : PlaceholderImagePrd
                  }
                  alt=""
                />
              </div>
              <div className="flex flex-col justify-around">
                <p className="manage-select-title"> {productSelected?.title}</p>
                <p className="manage-select-text text-left">
                  SKU:{' '}
                  { productSelected?.variants?.nodes && productSelected?.variants?.nodes.length > 0 &&
                    productSelected?.variants?.nodes[0].sku}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div
                className="text-baseshadow-dashboardButtons manage-select-button manage-select-button-active flex cursor-pointer items-center whitespace-nowrap rounded-md border-[1.4px] border-gray-2550 bg-white"
                onClick={() => setShowListPrd(true)}
              >
                <span>Switch Product</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div
        className={`el-form-item is-required asterisk-right flex flex-col items-stretch space-y-0.5`}
        role="group"
        aria-labelledby="el-id-7811-0"
      >
        <div id="el-id-7811-0" className="el-form-item__label !mb-[10px]">
          Product Connection
        </div>
        <div className={`el-form-item__content`}>
          <div className={`manage-select-block w-full ${errors?.sProduct !== "" ? '!border-[--state-error]' : 'border-gray-2550'}`}>
            <div className="flex items-center">
              <div
                className="select-product-button text-baseshadow-dashboardButtons manage-select-button manage-select-button-active flex cursor-pointer items-center whitespace-nowrap rounded-md border-[1.4px] border-gray-2550 bg-white px-2 py-2.5"
                onClick={() => setShowListPrd(true)}
              >
                <span>Select Product</span>
              </div>
            </div>
          </div>
        </div>
        {errors?.sProduct !== "" && (
          <div className="text-[10px] leading-[10px] text-[--state-error]">
            {errors?.sProduct}
          </div>
        )}
      </div>
    )
  }

  const renderListPrds = () => {
    return products?.map((_i: SpProduct, idx) => {
      return (
        <div key={idx} className="manage-select-block flex flex-row justify-between cursor-default-important">
          <div className="flex flex-row">
            <div className="mr-4">
              <img
                className="object-cover"
                width="50"
                height="50"
                src={_i.images.nodes[0]?.url || PlaceholderImagePrd}
                alt=""
              />
            </div>
            <div className="flex flex-col justify-around">
              <p className="manage-select-title">{_i.title}</p>
              <p className="manage-select-text text-left">
                SKU: {_i.variants.nodes[0].sku}
              </p>
            </div>
          </div>
          <div
            data-te-toggle="modal"
            data-te-target="#exampleModal"
            data-te-ripple-init=""
            className="flex items-center"
          >
            <div
              className="cursor-pointer flex items-center whitespace-nowrap rounded-md border-[1.4px] border-gray-2550 bg-white text-baseshadow-dashboardButtons manage-select-button manage-select-button-active"
              onClick={() => {
                callback(_i)
                setShowListPrd(false)
              }}
            >
              <span>Select Product</span>
            </div>
          </div>
        </div>
      )
    })
  }           

  const renderListPrdModal = () => {
    return (
      <Modal
        onClose={() => {
          setShowListPrd(false)
        }}
        classNameContainer="w-[900px]"
      >
        <div className="max-h-[80vh] overflow-x-auto" ref={listProdModalRef}>
          <React.Fragment>
            {renderListPrds()}
            {pagination.hasNextPage && (
              <div className="text-center mt-6">
                <button
                  onClick={(e) =>
                    {
                      e.preventDefault();
                      setPagination({ ...pagination, page: +pagination.page + 1 })
                    }
                  }
                  className="h-11 whitespace-nowrap rounded-md border-[1.4px] bg-white px-5 text-base font-semibold text-slate-1150 shadow-dashboardButtons border-gray-2550"
                >
                  Load more
                </button>
              </div>
            )}
          </React.Fragment>
        </div>
      </Modal>
    )
  }

  return (
    <div
      id="pane-Connections"
      className="el-tab-pane"
      role="tabpanel"
      aria-hidden="false"
      aria-labelledby="tab-Connections"
    >
      <div id="connections-tab" product-form-ref="[object Object]">
        <div>
          <h2 className="mt-[25px] text-sm font-medium leading-none tracking-tight text-black">
            Manage Connections
          </h2>
          <h3 className="mt-2.5 text-base leading-tight text-gray-1150">
            Complete the connections below to ensure sales tracking is accurate
            and discount codes work.
          </h3>
        </div>
        <div className="w-[520px]">
          <div className="el-form-item asterisk-left mt-[30px]">
            <label className="el-form-item__label">Shopify Connection</label>
            <div className="manage-select-block cursor-default-important flex flex-row justify-between">
              <div>
                <p className="manage-select-title mb-1.5">
                  {connectionData?.name}
                </p>
                <p className="manage-select-text">{connectionData?.domain}</p>
              </div>
              <a href={`https://${connectionData?.domain}/admin/products/`}>
                <div className="flex items-center">
                  <div className="text-baseshadow-dashboardButtons manage-select-button flex items-center whitespace-nowrap rounded-md border-[1.4px] border-gray-2550 bg-white">
                    <span>Manage Connection</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="el-form-item asterisk-left mt-[30px]">
            {renderSelectedPrd()}
            <div className="el-form-item is-required asterisk-right el-form-item asterisk-left mt-[30px]">
              <SingleSelect
                required
                label="Manage Discount"
                value={
                  data.discountType === 0 ? 'This product only' : 'Site Wide'
                }
                onChange={(val) => {
                  onSetState((preState) => ({
                    ...preState,
                    discountType: +val.id,
                  }))
                }}
                list={[
                  { id: 0, name: 'This product only' },
                  { id: 1, name: 'Site Wide' },
                ]}
              />
            </div>
            <div className="el-form-item asterisk-left mt-[30px]">
              <SingleSelect
                required
                label="Launch Date"
                value={
                  data.launchType === 0
                    ? 'Earliest Available'
                    : 'After This Date'
                }
                list={[
                  { id: 0, name: 'Earliest Available' },
                  { id: 1, name: 'After This Date' },
                ]}
                onChange={(val) => {
                  onSetState((preState) => ({ ...preState, launchType: +val.id }))
                }}
                hint="We launch products every Thursday."
              />
            </div>
          </div>
          {data.launchType === 1 && (
            <div className="mt-5">
              <input
                type="date"
                value={data.launchDate}
                onChange={(e) => {
                  onSetState((preState) => ({
                    ...preState,
                    launchDate: e.target.value,
                  }))
                }}
              />
            </div>
          )}
        </div>
        {showListPrd && renderListPrdModal()}
      </div>
    </div>
  )
}

export default PanelConnection
