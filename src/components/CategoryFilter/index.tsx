import DropdownFilter, { IDropdownItem1 } from 'components/DropdownFilter'
import React, { FC, useEffect, useState } from 'react'
import apis from 'apis'
import { createQuery } from 'utils/function'
import { CategoryIcon } from 'utils/svgExport'
import useMediaQuery from 'hooks/useMediaQuery'

export interface ICategoryFilterProps {
  select?: 'one' | 'multi'
  onChangeSingle?: (val: IDropdownItem1 | null) => void
  onChangeMulti?: (val: IDropdownItem1[]) => void
  className?: string
  cateSlug: string | null
}

const CategoryFilter: FC<ICategoryFilterProps> = ({
  select = 'one',
  onChangeSingle,
  onChangeMulti,
  className = '',
  cateSlug,
}) => {
  const [categories, setCategories] = useState<IDropdownItem1[]>([])
  const [category, setCategory] = useState<IDropdownItem1 | null>(null)
  const mediaQueryWidth = useMediaQuery()

  useEffect(() => {
    if (!cateSlug) return
    apis
    .get(
      `wl-prod-cats`,
      createQuery({
        fields: ['name', 'category_order', 'slug'],
        filters: {
          slug: cateSlug
        },
      })
    )
    .then((res) => {
      const cate = res.data.data[0]
      setCategory({id: cate.id, name: cate.attributes.name, slug: cate.attributes.slug})
    })
    .catch((err) => {
      console.log(err)
    })
  }, [cateSlug])

  const handleGetCategory = () => {
    apis
      .get(
        `wl-prod-cats`,
        createQuery({
          fields: ['name', 'category_order', 'slug'],
          sort: ['category_order:asc'],
        })
      )
      .then((res) => {
        setCategories(
          res.data.data.map((item: any) => {
            return {
              id: item.id,
              name: item.attributes?.name,
              slug: item.attributes?.slug,
            }
          })
        )
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    handleGetCategory()
  }, [])


  const renderContent = (id: number, name: string) => {
    return (
      id &&
      name && (
        <div
          key={id}
          className={`px-[12px] py-[8px] flex justify-between items-center border bg-[--gray-bg-tag] rounded-[4px] h-[35px] space-x-[8px] ${mediaQueryWidth > 460 ? 'max-w-[270px]' : 'max-w-[178px]'} whitespace-normal text-ellipsis ${className}`}
        >
          <div className="font-[RobotoRegular] text-[15px] text-[--gray-text] max-w-[337px] line-clamp-2 text-ellipsis overflow-hidden">
            {name}
          </div>
          <div>
            <div
              className="w-[17px] h-[17px] rounded-full bg-[--brand-secondary3] z-30 flex justify-center items-center cursor-pointer"
              onClick={() => {
                if (select === 'one') {
                  setCategory(null)
                  onChangeSingle && onChangeSingle(null)
                } else {
                  setCategories(categories.filter((i) => i.id !== id))
                  onChangeMulti &&
                    onChangeMulti(categories.filter((i) => i.id !== id))
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="7"
                viewBox="0 0 7 7"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.413718 5.3435C0.0834481 5.6861 0.0834481 6.2415 0.413718 6.5841C0.743978 6.9266 1.27945 6.9266 1.60972 6.5841L3.49478 4.62879L5.38 6.5843C5.7103 6.9268 6.2458 6.9268 6.576 6.5843C6.9063 6.2417 6.9063 5.6863 6.576 5.3437L4.69078 3.38825L6.3602 1.65664C6.6905 1.31408 6.6905 0.75867 6.3602 0.4161C6.03 0.0735397 5.4945 0.0735397 5.1642 0.4161L3.49478 2.14772L1.82554 0.416309C1.49527 0.0737495 0.959798 0.0737495 0.629538 0.416309C0.299268 0.758869 0.299268 1.31428 0.629538 1.65685L2.29878 3.38825L0.413718 5.3435Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
      )
    )
  }

  return (
    <div className="min-h-[35px] flex justify-start h-[35px] box-border items-center space-x-2 rounded-[4px]">
      <div className="flex-2 min-h-[35px] h-[35px] box-border">
        <DropdownFilter
          value={categories}
          label="Categories"
          onChange={(val) => {
            if (select === 'one') {
              setCategory(val)
              onChangeSingle && onChangeSingle(val)
            } else {
              if (categories.findIndex((item) => item.id === val.id) === -1) {
                setCategories([...categories, val])
              }
              onChangeMulti && onChangeMulti([...categories, val])
            }
          }}
          icon={
            mediaQueryWidth < 768 ? <img alt='' src={CategoryIcon} className='w-[15px] h-[15px]' /> : null
          }
        />
      </div>
      <div className="flex justify-start items-center overflow-x-hidden min-h-[35px] space-x-[12px] overflow-y-hidden">
        {select === 'multi'
          ? categories.length > 0 &&
            categories.map((item) => renderContent(item.id, item.name))
          : category && renderContent(category.id, category.name)}
      </div>
    </div>
  )
}

export default CategoryFilter
