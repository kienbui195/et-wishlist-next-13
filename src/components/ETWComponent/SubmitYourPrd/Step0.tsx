import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import MainImage from 'assets/svg/Step2-image.svg'
import { ETLogo } from 'utils/svgExport'

interface Step0Props {
  step: number
  //   setStep: React.Dispatch<React.SetStateAction<number>>
  nextStep: () => void
  handleSubmit: () => void
}

const Step0: FC<Step0Props> = ({ step, nextStep, handleSubmit }) => {
  return (
    <div className="init-brand flex min-h-screen flex-col ml-auto md:w-[1060px] pl-1">
      <main className="w-full flex-1">
        <div className="ml-auto flex w-full justify-between">
          <div className="mr-2 max-w-[440px]">
            <h1 className="step-title ml-7 mt-[130px] font-grommet text-26 font-medium leading-none text-slate-1150">
              {' '}
              Great job – let’s keep going!{' '}
            </h1>
            <div className="align-center ml-7 mr-4 mt-10 items-center w-[360px] grid grid-cols-2 gap-12">
              <div>
                <div className="text-xs font-semibold leading-none text-gray-1150">
                  {' '}
                  Step 1{' '}
                </div>
                <div className="mt-1.5 text-base font-medium leading-none text-gray-1150">
                  {' '}
                  Install Wishlist Shopify App{' '}
                </div>
                {step === 5 ? null : (
                  <div className="mt-1.5 text-sm leading-tight text-gray-1150">
                    {' '}
                    Shopify app installed!{' '}
                  </div>
                )}
              </div>
              <div className="flex h-6 w-fit items-center rounded bg-gray-2150 px-2.5 text-sm font-semibold text-gray-1150">
                <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[--state-success]"></div>{' '}
                Complete{' '}
              </div>
            </div>

            <div
              className={`mt-[31px] bg-white  ${
                step === 5
                  ? ''
                  : 'rounded-10 shadow-brandStep p-[27px_20px_31px_34px]'
              }`}
            >
              <div
                className={`${
                  step === 5 ? 'ml-7 mr-4 mt-10' : ''
                } items-center grid grid-cols-2 gap-12 w-[360px]`}
              >
                <div>
                  <div
                    className={`leading-none font-semibold ${
                      step === 5
                        ? 'text-gray-1150 text-xs'
                        : 'text-slate-1150 text-sm '
                    }`}
                  >
                    {' '}
                    Step 2{' '}
                  </div>
                  <div
                    className={`mt-1.5  leading-none ${
                      step === 5
                        ? 'text-gray-1150 font-medium '
                        : 'text-slate-1150 font-semibold text-xl'
                    }`}
                  >
                    {' '}
                    Complete Application{' '}
                  </div>
                </div>
                <div className="flex h-6 w-fit items-center rounded bg-gray-2150 px-2.5 text-sm font-semibold text-gray-1150">
                  <div
                    className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                      step === 5 ? 'bg-[--state-success]' : 'bg-[--state-error]'
                    }`}
                  ></div>
                  {step === 5 ? 'Complete' : 'Incomplete'}
                </div>
              </div>
              <div
                className={`mt-2.5 ${
                  step === 5 ? 'text-xs hidden' : 'text-base'
                } leading-tight text-gray-1150`}
              >
                {' '}
                Applying to Wishlist is fast and easy. Click 'Get Started' below
                to complete your application.{' '}
              </div>
              {step === 5 ? null : (
                <button
                  className="mt-5 inline-flex h-7 items-center rounded bg-[--brand-primary] hover:bg-[--brand-primary-hover] active:bg-[--brand-primary-pressed] px-2 text-13 font-medium leading-none text-white shadow-initBrandButton"
                  onClick={() => nextStep && nextStep()}
                >
                  {' '}
                  Get Started{' '}
                </button>
              )}
            </div>

            <div className="ml-7 mr-4 mt-9">
              <div className="text-xs font-semibold leading-none text-gray-1150">
                {' '}
                Step 3{' '}
              </div>
              <div className="mt-1.5 text-base font-medium leading-none text-gray-1150">
                {' '}
                {step === 5 ? (
                  <button
                    className="mt-5 flex h-[50px] items-center justify-center rounded-md bg-[--brand-primary] px-6 hover:bg-[--brand-primary-hover] active:bg-[--brand-primary-pressed] select-none"
                    onClick={() => handleSubmit && handleSubmit()}
                  >
                    <span className="text-lg font-semibold text-white">
                      Submit Application
                    </span>
                  </button>
                ) : (
                  'Submit Application For Approval '
                )}
              </div>
            </div>
          </div>
          <img
            src={MainImage}
            alt=""
            width="720"
            height="678"
            className="h-[678px] w-[720px]"
          />
        </div>
      </main>
      <div className="flex h-12 w-full items-center bg-white mt-5">
        <div className="flex w-full items-center justify-between max-w-[1120px]">
          <div className="flex h-[18px] items-center text-xs font-medium leading-none text-gray-950">
            <div className="flex items-center border-r border-gray-950 pr-3.5">
              {' '}
              Powered by{' '}
              <Link to={"/"} className="ml-1">
                <img src={ETLogo} alt="" className="h-[18px]" />
              </Link>
            </div>
            <a href="/merchant-terms" className="mx-3.5">
              {' '}
              Terms{' '}
            </a>
            <a href="/privacy">Privacy</a>
          </div>
          <div className="text-xs leading-none text-gray-950">
            {' '}
            © 2023, Wishlist. All Rights Reserved.{' '}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step0
