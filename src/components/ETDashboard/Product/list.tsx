import React, { useEffect, useState } from 'react'
import ProductItem from './ProductComponent/ProductItem'
import apis from '@/apis'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { createQuery } from '@/utils/function'
import { useAlertContext } from '@/context/alertContext'
import moment from 'moment'
import DashboardButton from '../Components/Button'
import {useRouter} from 'next/navigation'
export interface IProductState {
  id: number
  name: string
  sub_headline: string
  thumbnail: {
    data: {
      attributes: {
        name: string
        url: string
      }
    }
  }
  page_submitted: boolean
  page_approved: boolean
  launch_date: string
}

const BrandProduct = () => {
  const shopInfo = useSelector((state: RootState) => state.shop.shop)
  const { showAlert } = useAlertContext()
  const [products, setProducts] = useState<IProductState[]>([])
  const router = useRouter()

  const handleGetProducts = () => {
    if (shopInfo.id > 0) {
      apis
        .get(
          'wl-products',
          createQuery({
            fields: [
              'id',
              'sub_headline',
              'name',
              'page_submitted',
              'page_approved',
              'launch_date',
              'published_at',
            ],
            populate: {
              thumbnail: {
                fields: ['name', 'url'],
              },
            },
            filters: {
              shop: {
                id: shopInfo.id,
              },
            },
          })
        )
        .then((res) => {
          const { data } = res.data
          setProducts(
            data.reduce((acc: any[], item: any) => {
              acc.push({
                id: item.id,
                name: item.attributes.name,
                sub_headline: item.attributes.sub_headline,
                thumbnail: item.attributes.thumbnail,
                page_submitted: item.attributes.page_submitted,
                page_approved: item.attributes.page_approved,
                launch_date: item.attributes.launch_date
                  ? moment(item.attributes.launch_date).format('MMMM DD, YYYY')
                  : 'Pending',
              })
              return acc
            }, [])
          )
        })
        .catch((err) => {
          showAlert('error', err.message)
        })
    }
  }

  useEffect(() => {
    handleGetProducts()
    document.title = `ET Wishlist | Brand Products`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopInfo.id])

  return (
    <main className="w-full px-10 py-7">
      <div>
        <div className="flex w-full items-end justify-between">
          <div>
            <span className="text-10 font-bold leading-none tracking-wide text-gray-1150">
              MY PRODUCTS
            </span>
            <h2 className="mt-3 text-xl font-semibold leading-none tracking-tight text-black">
              Products
            </h2>
            <h3 className="font-base mt-[11px] leading-none text-gray-1150">
              Manage your products on ET Wishlist.
            </h3>
          </div>
            <DashboardButton
              label="Submit New Product"
              // onClick={() => onSetState(PROD_LAYOUT_TYPE['create'])}
              onClick={() => router.push('/brand-products/create')}
            />
        </div>
        <div
          className="el-divider el-divider--horizontal mb-[25px] mt-[26px] w-full border-gray-1350 border-t-[1px]"
          role="separator"
        ></div>
        <div className="w-full">
          {products.map((item: IProductState, idx: number) => {
            return (
              <ProductItem
                key={idx}
                value={item}
              />
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default BrandProduct
