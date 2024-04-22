import React from 'react'
import { ProductPanelProps } from './type'
import FormInput from 'components/FormInput/Input'
import FormTextarea from 'components/FormTextarea/FormTextarea'
import FormInputMedia from 'components/FormInputMedia'
import { generateSlug } from 'utils/function'

const PanelFeed: React.FC<ProductPanelProps> = ({
  data,
  onSetState,
  isCreate,
  errors 
}) => {
  return (
    <div
      id="pane-Feed"
      className="el-tab-pane"
      role="tabpanel"
      aria-hidden="true"
      aria-labelledby="tab-Feed"
    >
      <div>
        <div>
          <h2 className="mt-[25px] text-sm font-medium leading-none tracking-tight text-black">
            Stand Out In The Feed
          </h2>
          <h3 className="mt-2.5 text-base leading-tight text-gray-1150">
            Your product will likely be seen first on ET Wishlist's homepage (The
            Trending Feed). Quickly highlight its value to grab Shoppers'
            attention.
          </h3>
        </div>
        <div className="mt-[30px] flex">
          <div className="mr-[75px] w-full max-w-[520px]">
            <div className="el-form-item is-required asterisk-right">
              <FormInput
                required
                disabled={!isCreate}
                label="Product Name"
                value={data.name}
                onChange={(e) => {
                  onSetState((preState) => ({
                    ...preState,
                    name: e.target.value,
                    slug: generateSlug(e.target.value),
                  }))
                }}
                labelError={errors?.name}
                error={errors?.name !== ''}
              />
            </div>
            <div className="el-form-item is-required asterisk-right mt-5">
              <FormTextarea
                required
                label={'Feed Headline'}
                placeholder={'Enter a description'}
                limitCharacter={40}
                value={data.headline}
                onChange={(e) => {
                  onSetState((preState) => ({
                    ...preState,
                    headline: e.target.value,
                  }))
                }}
                error={errors?.headline !== ''}
                labelError={errors?.headline}
              />
            </div>
            <div className="el-form-item is-required asterisk-right mt-5">
              <FormTextarea
                required
                label={'Feed Sub-Headline'}
                placeholder={'Enter a description'}
                limitCharacter={100}
                value={data.subHeadline}
                onChange={(e) => {
                  onSetState((preState) => ({
                    ...preState,
                    subHeadline: e.target.value,
                  }))
                }}
                error={errors?.subHeadline !== ''}
                labelError={errors?.subHeadline}
              />
            </div>
          </div>
          <div className="w-full max-w-[520px]">
            <FormInputMedia
              required
              label="Feed Thumbnail"
              extraLabel="The first product image Shoppers will see. Upload an attention-grabbing image that highlights your products best features."
              accept="image/*"
              buttonLabel="Upload Image"
              value={data.thumbnail}
              onChange={(value) => {
                onSetState((preState) => ({
                  ...preState,
                  thumbnail: { ...value },
                }))
              }}
              error={errors?.thumbnail !== ''}
              labelError={errors?.thumbnail}
            />

            <FormInputMedia
              required
              label="Feed Hover Video"
              extraLabel="Like a GIF, a short video appears when Shoppers hover over your thumbnail. Quickly showcase how your product works or its main benefit. Requirements: 60 seconds and 60mb or less."
              className="mt-5"
              accept="video/*,image/gif"
              buttonLabel="Upload Video"
              value={data.hoverVideo}
              onChange={(value) => {
                onSetState((preState) => ({
                  ...preState,
                  hoverVideo: { ...value },
                }))
              }}
              error={errors?.hoverVideo !== ''}
              labelError={errors?.hoverVideo}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PanelFeed
