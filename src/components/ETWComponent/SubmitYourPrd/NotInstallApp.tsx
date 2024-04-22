import React from 'react'

import ShopifyApp from '../../../assets/svg/Shopify-app.svg'
import MainImage from 'assets/svg/Step1.1-image.svg'
import { ETLogo } from 'utils/svgExport'
import { Link } from 'react-router-dom'

function NotInstallApp() {
  return (
    <div className="init-brand flex min-h-screen flex-col ml-auto md:w-[1060px] w-fit pl-1">
      <main className="w-full">
        <div className="ml-auto flex w-full justify-between">
          <div className="mr-2 max-w-[440px] w-full">
            <h1 className="step-title ml-7 mt-[123px] font-grommet text-26 font-medium leading-none text-slate-1150">
              {' '}
              Welcome to Wishlist!{' '}
            </h1>
            <div className="mt-[31px] rounded-10 bg-white p-[35px_41px_34px_34px] shadow-brandStep">
              <div className="text-sm font-semibold leading-none text-slate-1150">
                {' '}
                Step 1{' '}
              </div>
              <div className="mt-2.5 text-xl font-semibold leading-none text-slate-1150">
                {' '}
                Install Wishlist Shopify App{' '}
              </div>
              <div className="text-base leading-tight text-gray-1150">
                {' '}
                We’ve made it easy for brands to apply with the Wishlist
                Shopify App. Install the application using the link below to get
                started.{' '}
              </div>
              <div className="mt-4 flex items-center">
                <Link to="https://apps.shopify.com/the-etwishlist">
                  <img
                    src={ShopifyApp}
                    alt="shopify app"
                    width="180"
                    height="47"
                  />
                </Link>
                <Link
                  to="/#"
                  className="ml-3.5 text-sm font-semibold text-slate-1150"
                >
                  {' '}
                  I don’t have Shopify{' '}
                </Link>
              </div>
            </div>
            <div className="ml-7 mr-4 mt-9">
              <div className="flex w-full items-center justify-between">
                <div>
                  <div className="text-xs font-semibold leading-none text-gray-1150">
                    {' '}
                    Step 2{' '}
                  </div>
                  <div className="mt-1.5 text-base font-medium leading-none text-gray-1150">
                    {' '}
                    Complete Application{' '}
                  </div>
                </div>
                <div className="flex h-6 w-fit items-center rounded bg-gray-2150 px-2.5 text-sm font-semibold text-gray-1150">
                  <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-1000"></div>{' '}
                  Incomplete{' '}
                </div>
              </div>
              <div
                className="el-divider el-divider--horizontal my-[30px] border-gray-1350"
                role="separator"
              ></div>
              <div className="text-xs font-semibold leading-none text-gray-1150">
                {' '}
                Step 3{' '}
              </div>
              <div className="mt-1.5 text-base font-medium leading-none text-gray-1150">
                {' '}
                Submit for Approval{' '}
              </div>
            </div>
          </div>
          <img
            src={MainImage}
            alt=""
            width="720"
            height="678"
            className="h-[678px] w-[720px] md:flex hidden"
          />
          <div
            className="el-overlay"
            style={{ zIndex: '2001', display: 'none' }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="el-id-8935-0"
              aria-describedby="el-id-8935-1"
              className="el-overlay-dialog"
              style={{ display: 'flex' }}
            ></div>
          </div>
        </div>
      </main>
      <div className="flex h-12 w-full items-center bg-white mt-5 fixed bottom-0">
        <div className="flex w-full items-center justify-between max-w-[1120px]">
          <div className="flex h-[18px] items-center text-xs font-medium leading-none text-gray-950">
            <div className="flex items-center border-r border-gray-950 pr-3.5">
              {' '}
              Powered by{' '}
              <a href="/#" className="ml-1 ">
                <img src={ETLogo} alt="" className="h-[18px]" />
              </a>
            </div>
            <a href="/merchant-terms" className="mx-3.5">
              {' '}
              Terms{' '}
            </a>
            <a href="/privacy">Privacy</a>
          </div>
          <div className="text-xs leading-none text-gray-950">
            {' '}
            © 2023, ET Wishlist. All Rights Reserved.{' '}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotInstallApp