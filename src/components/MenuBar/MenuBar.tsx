import React, { useState, Fragment, useEffect } from 'react'
import { Transition } from '../../app/headlessui'
import NavMobile from '../../components/Navigation/NavMobile'
import usePathname from '../../hooks/usePathname'
import { useNavigate } from 'react-router-dom'
import useUserLogin from 'hooks/useUserLogin'
import {useDispatch} from "react-redux";
import {setDisplayMenuBar} from "../../features/global/menuBarDisplaySlice";

const MenuBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const { isLogin } = useUserLogin()
  const navigate = useNavigate()
  const pathname = usePathname()
  const dispatch = useDispatch()

  useEffect(() => {
    setIsVisible((preState) => !preState)
  }, [isLogin])

  useEffect(() => {
    setIsVisible(false)
    dispatch(setDisplayMenuBar(false))
  }, [pathname])

  const handleCloseMenu = () => {
    setIsVisible(false)
    dispatch(setDisplayMenuBar(false))
  }
  const renderContent = () => {
    return (
      <Transition show={isVisible} as={Fragment}>
        <div className="relative">
          <Transition.Child
            as={Fragment}
            enter=" duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave=" duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-neutral-900 bg-opacity-50 z-50"
              onClick={handleCloseMenu}
            />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition duration-100 transform"
            enterFrom="opacity-0 -translate-x-[768px]"
            enterTo="opacity-100 translate-x-0"
            leave="transition duration-150 transform"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 -translate-x-[768px]"
          >
            <div className="fixed !z-[99] inset-y-0 left-0 w-screen overflow-y-auto">
              <div className="flex">
                <div className="w-full overflow-hidden transition-all">
                  <NavMobile
                    onClickClose={handleCloseMenu}
                    onEnter={(val) => {
                      navigate(`/product-search/${val}`)
                    }}
                  />
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition>
    )
  }

  return (
    <div>
      <button
        onClick={() => {
          setIsVisible(!isVisible)
          dispatch(setDisplayMenuBar(!isVisible))
        }}
        className="p-2.5 rounded-lg text-neutral-700 dark:text-neutral-300 focus:outline-none flex items-center justify-center h-[36px] w-[36px]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {renderContent()}
    </div>
  )
}

export default MenuBar
