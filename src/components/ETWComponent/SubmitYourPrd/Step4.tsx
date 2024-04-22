import React, { FC, useState } from 'react'
import ETModal from 'components/ETModal'

interface StepProps {
  step: number
  //   setStep: React.Dispatch<React.SetStateAction<number>>
  nextStep: () => void
  backStep: () => void
}

const Step4: FC<StepProps> = ({ step, nextStep, backStep }) => {
  const [openModal, setOpenModal] = useState(false)

  return (
    <main className="w-full flex-1">
      <div className="mt-8">
        <div className="flex">
          <div className="mr-2.5 h-1.5 w-[50px] rounded-full bg-green-950"></div>
          <div className="mr-2.5 h-1.5 w-[50px] rounded-full bg-green-950"></div>
          <div className="mr-2.5 h-1.5 w-[50px] rounded-full bg-green-950"></div>
          <div className="mr-2.5 h-1.5 w-[50px] rounded-full bg-green-950"></div>
        </div>
        <div className="mt-[9px] text-base font-semibold leading-none text-green-1450">
          4 of 4{' '}
        </div>
        <h1 className="mt-[35px] text-xl font-semibold leading-none text-black">
          Show us your product.
        </h1>
        <h2 className="mt-2.5 text-sm leading-tight text-gray-1150">
          {' '}
          We’re looking for new, unique products that address a need for
          Shoppers. Upload images and videos to show what your product is, how
          it works, and why it's special.{' '}
        </h2>
        <div
          className="el-divider el-divider--horizontal mb-[40px] mt-[29px] border-gray-1350 px-[50px]"
          role="separator"
        ></div>
      </div>
      <div className="flex">
        <div className="w-full max-w-[240px]">
          <div className="text-sm font-medium leading-none text-slate-1050">
            {' '}
            Company Logo <span className="required-manage-field">*</span>
          </div>
          <div className="relative mt-3 flex h-60 w-full max-w-[240px] items-center justify-center overflow-hidden rounded-md border border-gray-1350 bg-gray-2150">
            <button
              className="flex min-h-[39px] items-center rounded bg-green-950 px-[18px] py-2.5 text-base font-semibold leading-[19px] text-white z-10"
              onClick={() => setOpenModal(true)}
            >
              {/*<img*/}
              {/*  src={Plus}*/}
              {/*  alt=""*/}
              {/*  width="10"*/}
              {/*  height="10"*/}
              {/*  className="mr-2"*/}
              {/*/>{' '}*/}
              <div className={'text-white mr-2'}>+</div>
              Add Logo
            </button>
          </div>
          <div className="mt-[22px] text-sm leading-normal text-gray-2050">
            <p className="mb-0.5 font-semibold text-slate-950">
              Logo Requirements
            </p>
            <p>Min. Size - 400x400px.</p>
            <p>Ensure image is centered in frame.</p>
            <p>Max. File Size - 10mb</p>
          </div>
        </div>
        <div
          className="el-divider el-divider--vertical mx-[30px] h-[370px] border-gray-1350"
          role="separator"
        ></div>
        <div className="w-full max-w-[935px]">
          <div className="text-sm font-medium leading-none text-slate-1050">
            {' '}
            Images <span className="required-manage-field">*</span>
          </div>
          <div className="relative mt-3 flex min-h-[390px] w-full flex-col items-center justify-start rounded-md border border-gray-1350 bg-gray-2150 px-[23px] py-5">
            <div className="mb-[25px] mt-auto text-center text-sm leading-normal text-gray-2050">
              <p className="mb-0.5 font-semibold text-slate-950">
                {' '}
                Image Requirements{' '}
              </p>
              <p>Images must be a minimum of 800 x 600 px.</p>
              <p>Ensure the image is high resolution.</p>
              <p>Maximum file size of 10mb per image.</p>
            </div>
            <button className="flex min-h-[39px] items-center rounded bg-green-950 px-[18px] py-2.5 text-base font-semibold leading-[19px] text-white absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform whitespace-nowrap">
              <img
                src="https://d22lwxpnhu2n4a.cloudfront.net/grommet/img/plus.svg"
                alt=""
                width="10"
                height="10"
                className="mr-2"
              />{' '}
              Add Image(s)
            </button>
          </div>
        </div>
        <div
          className="el-divider el-divider--vertical mx-[30px] h-[370px] border-gray-1350"
          role="separator"
        ></div>
        <div className="w-full max-w-[300px]">
          <div className="text-sm font-medium leading-none text-slate-1050">
            {' '}
            Video{' '}
          </div>
          <div className="relative mt-3 flex min-h-[390px] w-full max-w-[240px] flex-col items-center justify-end rounded-md border border-gray-1350 bg-gray-2150 p-5">
            <button className="flex min-h-[39px] items-center rounded bg-green-950 px-[18px] py-2.5 text-base font-semibold leading-[19px] text-white absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform whitespace-nowrap">
              <img
                src="https://d22lwxpnhu2n4a.cloudfront.net/grommet/img/plus.svg"
                alt=""
                width="10"
                height="10"
                className="mr-2"
              />{' '}
              Add Video
            </button>
            <div className="mb-1 mt-auto text-center text-sm leading-normal text-gray-2050">
              <p className="mb-0.5 font-semibold text-slate-950">
                {' '}
                Video Requirements{' '}
              </p>
              <p>Resolution - 576x1024</p>
              <p>Max. Length - :60</p>
              <p>Max. File Size - 60mb</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 flex">
        <button
          className="flex h-[50px] items-center justify-center rounded-md bg-[--brand-primary] px-6 hover:bg-[--brand-primary-hover] active:bg-[--brand-primary-pressed]"
          onClick={() => nextStep && nextStep()}
        >
          <span className="text-lg font-semibold text-white">
            Complete Application
          </span>
        </button>
        <button
          className="w-full rounded-md text-xs font-semibold px-2.5 text-black bg-transparent border border-gray-1350 hover:bg-gray-2150 ml-2.5 h-[50px] max-w-[120px]"
          onClick={() => backStep && backStep()}
        >
          <span className="text-lg font-semibold">Back</span>
        </button>
      </div>
      <ETModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        children={
          <div className={'p-[21px_18px]'}>
            <header className="el-dialog__header">
              <button
                aria-label="Close this dialog"
                className="el-dialog__headerbtn"
                type="button"
              >
                <i
                  className="el-icon el-dialog__close"
                  onClick={() => setOpenModal(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1024 1024"
                  >
                    <path
                      fill="currentColor"
                      d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
                    ></path>
                  </svg>
                </i>
              </button>
            </header>
            <div id="el-id-4996-281" className="el-dialog__body">
              <div className="text-sm font-semibold leading-none text-slate-1100">
                Upload Images
              </div>
              <div className="mt-2.5 text-xs font-normal leading-none text-gray-2050">
                {' '}
                Attach and upload your files below
              </div>
              <div className="upload-media mt-4">
                <div className="el-upload el-upload--text is-drag ">
                  <div className="el-upload-dragger">
                    <img
                      src="https://d22lwxpnhu2n4a.cloudfront.net/grommet/img/upload.svg"
                      alt="upload media"
                      width="40"
                      height="40"
                      className="mx-auto h-10 w-10"
                    />
                    <div className="mt-3 text-xs font-normal leading-5 text-gray-2050">
                      <span className="font-semibold text-black">
                        {' '}
                        Click to upload{' '}
                      </span>{' '}
                      or drag and drop
                    </div>
                  </div>
                  <input
                    className="el-upload__input"
                    name="file"
                    accept="image/*"
                    type="file"
                  />
                  <ul className="el-upload-list el-upload-list--text"></ul>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    className="h-9 w-full rounded-md text-xs font-semibold px-2.5 text-black bg-transparent border border-gray-1350 hover:bg-gray-2150"
                    onClick={() => setOpenModal(false)}
                  >
                    {' '}
                    Cancel
                  </button>
                  <button className="h-9 w-full rounded-md text-xs font-semibold bg-[--brand-primary] px-6 hover:bg-[--brand-primary-hover] active:bg-[--brand-primary-pressed] text-white">
                    {' '}
                    Upload Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </main>
  )
}

export default Step4
