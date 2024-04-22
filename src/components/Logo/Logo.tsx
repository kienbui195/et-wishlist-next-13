import React from 'react'

import { useSelector } from 'react-redux'
import { RootState } from 'app/store'

const Logo: React.FC = () => {
    const logo = useSelector((state: RootState) => state.header.header.logo)

    return (
        <a
            href="/"
            className="w-auto h-[48px] flex justify-center items-center"
        >
            <img src={`${process.env.REACT_APP_URL_BE}${logo?.url}`} alt={logo?.name} className='object-contain h-full' />
        </a>
    )
}

export default Logo
