import React, { useState } from 'react'
import SearchComponent from './SearchComponent'
import { useLocation, useNavigate } from 'react-router-dom'
import { createQuery } from 'utils/function'
import ButtonAvatar from 'components/ButtonAvatar'

const RightMenu = () => {
  const [hidden, setHidden] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const shouldShowSearch =
    !location.pathname.includes('submit-your-product') &&
    !location.pathname.includes('brand-')
  return (
    <div
      className={`flex items-center ${
        hidden ? '' : 'space-x-6'
      } justify-end md:w-[420px] w-full`}
    >
      {shouldShowSearch && (
        <div className="md:flex hidden flex-1">
          <SearchComponent
            className={'md:flex hidden'}
            onOpen={(val) => {
              if (val) {
                setHidden(true)
              } else {
                setHidden(false)
              }
            }}
            onEnter={(val) => {
              const queryObj = {
                _pt: 'Single',
              }
              if (window.location.pathname === '/brands') {
                queryObj._pt = 'Merchant'
              }
              const query = createQuery(queryObj)
              navigate(`/product-search/${encodeURIComponent(val)}?${query}`)
            }}
          />
        </div>
      )}
      <div className="lg:flex hidden ml-2">
        <ButtonAvatar />
      </div>
    </div>
  )
}

export default RightMenu
