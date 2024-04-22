import React from 'react'
import { ProductPanelProps } from './type'
import FormInput from 'components/FormInput/Input'
import FormInputMedia from 'components/FormInputMedia'
import FormTextarea from 'components/FormTextarea/FormTextarea'
import apis from 'apis'
import { useSelector } from 'react-redux'
import { RootState } from 'app/store'

const PanelOurStory: React.FC<ProductPanelProps> = ({
  data,
  onSetState,
  isCreate = true,
  errors,
}) => {
  const userRedux = useSelector((state: RootState) => state.user.user)
  const shopRedux = useSelector((state: RootState) => state.shop.shop)

  return (
    <div
      id="pane-Our Story"
      className="el-tab-pane"
      role="tabpanel"
      aria-hidden="true"
      aria-labelledby="tab-Our Story"
    >
      <div>
        <div>
          <h2 className="mt-[25px] text-sm font-medium leading-none tracking-tight text-black">
            Our Story
          </h2>
          <h3 className="mt-2.5 text-base leading-tight text-gray-1150">
            Share a compelling story about why and how you created your product.
            This will help Shoppers relate to your brand on a personal level,
            create a stronger connection, and drive more support on ET Wishlist.
          </h3>
        </div>
        <div className="mt-[30px] flex">
          <div className="mr-[75px] w-full max-w-[520px] pb-5">
            <div className="el-form-item is-required asterisk-right">
              <FormInput
                required
                label="Founder Name(s)"
                placeholder="Add founder name(s), separated by comma "
                value={data.ourStory?.founderName}
                onChange={(e) => {
                  onSetState({
                    ...data,
                    ourStory: { ...data.ourStory, founderName: e.target.value },
                  })
                }}
                error={errors?.founderName !== ''}
                labelError={errors?.founderName}
              />
            </div>
            <div
              className="el-form-item is-required asterisk-right mt-5"
              role="group"
              aria-labelledby="el-id-7811-34"
            >
              <FormInputMedia
                required
                label="Founder Image"
                accept="image/*"
                value={data.ourStory.founderImage}
                onChange={(value) => {
                  onSetState((preState) => ({
                    ...preState,
                    ourStory: { ...preState.ourStory, founderImage: value },
                  }))
                }}
                error={errors?.avatar !== ''}
                labelError={errors?.avatar}
                minHeight={80}
                minWidth={80}
              />
            </div>
            <div className="el-form-item is-required asterisk-right mt-5">
              <FormTextarea
                label="Our Story Headline"
                required
                limitCharacter={100}
                value={data.ourStory.storyHeadline}
                placeholder="Write a short headline that teases your founding story. Example: “My quest to eliminate soggy cereal forever”. "
                onChange={(e) => {
                  onSetState((preState) => ({
                    ...preState,
                    ourStory: {
                      ...preState.ourStory,
                      storyHeadline: e.target.value,
                    },
                  }))
                }}
                error={errors?.headline !== ''}
                labelError={errors?.headline}
              />
            </div>
            <div className="mt-5">
              <FormInputMedia
                label="Our Story Clip"
                accept="video/*"
                buttonLabel="Select Clip"
                minWidth={800}
                minHeight={600}
                value={data.storyClip}
                onChange={(value) => {
                  apis
                    .post('wl-clips', {
                      data: {
                        clip: [value.id],
                        desc: '',
                        member_id: userRedux.id,
                        shop_id: shopRedux.id,
                      },
                    })
                    .then((res) => {
                      const { id } = res.data.data
                      onSetState((preState) => ({
                        ...preState,
                        storyClip: { id, name: value.name, url: value.url },
                      }))
                    })
                }}
              />
            </div>
          </div>
          <div className="w-full max-w-[520px]">
            <div className="el-form-item is-required asterisk-right">
              <FormTextarea
                label="Our Story Description"
                required
                limitCharacter={800}
                placeholder="Here are some questions that can help you craft your founder's story:
                
                1. Why did you decide to create this product?;
                2. What specific problem did you aim to solve, and why was it significant to you?;
                3. Why do you believe that your product has the potential to make a difference?;
                4. What notable achievements have you accomplished thus far with this product?;
                5. How do you envision your product making a positive change or impact in the lives of its users?"
                value={data.ourStory.storyDesc}
                onChange={(e) => {
                  onSetState((preState) => ({
                    ...preState,
                    ourStory: {
                      ...preState.ourStory,
                      storyDesc: e.target.value,
                    },
                  }))
                }}
                error={errors?.desc !== ''}
                labelError={errors?.desc}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PanelOurStory
