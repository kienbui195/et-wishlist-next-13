'use client'

import { IGlobalData } from '@/data/wl-types'
import { setCompanyInfo } from '@/lib/features/global/companyDefaultSlice'
import { setFooterMenu, setFooterSubMenu } from '@/lib/features/global/footerSlice'
import { setHeaderBar } from '@/lib/features/global/headerbarSlice'
import { setLogo, setNavItems } from '@/lib/features/global/headerSlice'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const GlobalData = ({data} : {data: any}) => {
  const dispatch = useDispatch()
  const pathnameImage = process.env.NEXT_PUBLIC_BE_URL


  useEffect(() => {
    if (data) {
      // dispatch(setLogo(data.logo?.url))
      dispatch(setHeaderBar(data?.headerBar))
      dispatch(setCompanyInfo(data?.companyInfo))
      dispatch(setLogo(`${pathnameImage}${data?.logo}`))
      dispatch(setNavItems(data?.navItems))
      dispatch(setFooterMenu(data?.footerMenu))
      dispatch(setFooterSubMenu(data?.footerSubMenu))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <div></div>
  )
}

export default GlobalData