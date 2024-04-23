import React from 'react'
import { ProductPanelProps } from './type'
import Dropdown from 'components/CustomDropdown'
import FormInputMedia from 'components/FormInputMedia'
import BrandDotWhiteSvg from 'assets/svg/BrandDotWhite.svg'

const PanelImages: React.FC<ProductPanelProps> = ({
  data,
  onSetState,
  isCreate,
  errors,
}) => {

  const handleDeleteImage = (idx: number) => {
    const images = [...data.images];
    if (idx >= 0 && idx < images.length) {
      const newImages = images.filter((item, i) => i !== idx)
      onSetState((preState) => ({ ...preState, images: newImages }))
    }
  }

  const handleMakePrimary = (idx: number) => {
    const images = [...data.images];
    if (!images || idx < 0 || idx >= images.length) {
      return;
    }
    const primaryImage = images[idx];
    const newImages = [primaryImage, ...images.filter((item, i) => i !== idx)];
    onSetState((preState) => ({ ...preState, images: newImages }))
  };

  return (
    <div
      id="pane-Images"
      className="el-tab-pane"
      role="tabpanel"
      aria-hidden="true"
      aria-labelledby="tab-Images"
    >
      <div>
        <h2 className="mt-[25px] text-sm font-medium leading-none tracking-tight text-black">
          Product Page Gallery
        </h2>
        <h3 className="mt-2.5 text-base leading-tight text-gray-1150">
          To win more votes, use beautiful, high-quality images that highlight
          your product's unique features, packaging, and functionality, as well
          as your core customers using it.{' '}
          <a
            target="_blank"
            href='/'
            className="text-green-950 underline"
            rel='noreferrer'
          >
            See best practices here.
          </a>
        </h3>
      </div>
      <div className="mt-[31px] grid max-w-[670px] grid-cols-[repeat(auto-fill,_minmax(130px,_1fr))] gap-[5px]">
        {data.images?.map((item, idx) => {
          return (
            <div
              key={idx}
              className="relative h-[144px] w-[130px] rounded-md first:col-span-2 first:row-span-2 first:h-[293px] first:w-[265px]"
            >
              <img
                src={process.env.NEXT_PUBLIC_BE_URL + item.url}
                alt=""
                className="h-full w-full object-cover rounded-md"
              />
              <div className="el-dropdown absolute right-[14px] top-[17px] h-1.5 w-6">
                <Dropdown
                  dropdownIcon={BrandDotWhiteSvg}
                  list={[
                    {
                      id: 1,
                      name: 'Make Primary',
                      onClick: () => {
                        handleMakePrimary(idx)
                      },
                    },
                    {
                      id: 2,
                      name: 'Delete Image',
                      onClick: () => {
                        handleDeleteImage(idx)
                      },
                    },
                  ]}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="el-form-item is-required asterisk-right mt-[31px] h-16">
        <FormInputMedia
          required
          uploadMultiple
          showPreview={false}
          buttonLabel="Upload Additional Images"
          accept="image/*"
          onChange={(val) => {
            onSetState((preState) => ({
              ...preState,
              images: [...preState.images, ...val]
            }))
          }}
          error={errors?.mediaImages !== ''}
          labelError={errors?.mediaImages}
        />
      </div>
    </div>
  )
}

export default PanelImages
