import { IDropdownItem } from 'data/wl-types'
import React, { FC, Fragment, useState } from 'react'

export type TProdPerformanceFilters =
  | 'votes'
  | 'page_views'
  | 'orders'
  | 'sales'

  const PROD_PERFORMANCE_FILTERS:IDropdownItem[] = [
  {
    id: 'votes',
    name: 'Votes',
  },
  {
    id: 'page_views',
    name: 'Page Views',
  },
  {
    id: 'orders',
    name: 'Orders',
  },
  {
    id: 'sales',
    name: 'Sales',
  },
]

interface IProdPerformanceFiltersProps {
  onChange?: (val: IDropdownItem) => void
}

const ProdPerformanceFilters: FC<IProdPerformanceFiltersProps> = ({
  onChange,
}) => {
  const [selected, setSelected] = useState('votes')

  const renderRow = (label: IDropdownItem, isSelected: boolean = false) => {
    return (
      <div
        onClick={() => {
          setSelected(label.id as string)
          onChange && onChange(label)
        }}
        className={`h-10 shrink-0 cursor-pointer rounded px-5 py-3 text-base font-medium font-[RobotoBold] leading-none tracking-tight select-none transition-all duration-200 transform ${
          isSelected ? 'bg-black text-white scale-100' : 'bg-white text-black'
        }`}
      >
        {label.name}
      </div>
    )
  }

  return (
    <div className="flex rounded-md border-[1.4px] border-gray-2550 bg-white shadow-dashboardButtons">
      {PROD_PERFORMANCE_FILTERS.map((item: IDropdownItem, idx: number) => {
        return (
          <Fragment key={idx}>
            {renderRow(item, selected === item.id)}
          </Fragment>
        )
      })}
    </div>
  )
}

export default ProdPerformanceFilters
