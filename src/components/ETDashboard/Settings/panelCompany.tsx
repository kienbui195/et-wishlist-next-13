import React from 'react'
import { CompanyProf } from '.'
import SingleSelect from 'components/SingleSelect'
import FormInput from 'components/FormInput/Input'
import FormInputMedia from 'components/FormInputMedia'

interface CompanyPanelProps {
  company: CompanyProf
  country: any[]
  onChange?: (value: any, field: string, nestedField?: string) => void
  onChangeImg?: (value: any, field: string, nestedField?: string) => void
  errors: any
}

const CompanyPanel: React.FC<CompanyPanelProps> = ({
  company,
  country,
  onChange,
  onChangeImg,
  errors,
}) => {
  let url = process.env.REACT_APP_URL_BE
  let imageUrl = url + company.logo.url
  const img = new Image()
  img.src = imageUrl

  return (
    <div
      id="pane-Company Info"
      className="el-tab-pane"
      role="tabpanel"
      aria-hidden="false"
      aria-labelledby="tab-Company Info"
    >
      <div className="el-form el-form--default el-form--label-top mt-2.5 max-w-[555px]">
        <div className="el-form-item is-required asterisk-right">
          <FormInput
            required
            label="Company Name"
            value={company.name}
            labelError={errors.name}
            onChange={(e) => onChange && onChange(e, 'name')}
            error={errors.name !== ''}
          />
        </div>
        <div className="el-form-item is-required asterisk-right mt-5">
          <FormInputMedia
            label="Logo"
            value={company.logo}
            onChange={(e) => onChangeImg && onChangeImg(e, 'logo')}
            accept="image/*"
            showPreview={false}
            required
            error={errors.logo.url !== ''}
            labelError={errors.logo.url}
          />
          <div className='mt-5'>
            <img
              className="mt-5 h-60 w-60 object-cover rounded-md"
              src={
                company.logo?.url !== ''
                  ? imageUrl
                  : './default-thumbnail-md.jpg'
              }
              alt={url + company.logo?.name}
            />
          </div>
        </div>
        <div className="el-form-item is-required asterisk-right mt-5">
          <FormInput
            required
            label="Website"
            value={company.website}
            labelError={errors.website}
            placeholder="https://"
            onChange={(e) => onChange && onChange(e, 'website')}
            error={errors.website !== ''}
          />
        </div>
        <div className="el-form-item is-required asterisk-right mt-5">
          <FormInput
            required
            label="Support Email"
            value={company.support_email}
            labelError={errors.support_email}
            placeholder="Enter Support Email"
            onChange={(e) => onChange && onChange(e, 'support_email')}
            error={errors.support_email !== ''}
            type="email"
          />
        </div>

        <div className="el-form-item is-required asterisk-right mt-5">
          {/* select */}
          <SingleSelect
            key={company.id}
            required
            label={'Country of Incorporation'}
            placeholder={'Choose a country'}
            list={country}
            value={company.business_in_country}
            onChange={(e) => {
              onChange &&
                onChange({ target: { value: e.name } }, 'business_in_country')
            }}
            labelError={errors.business_in_country}
            error={errors.business_in_country !== ''}
          />
          {/* end select */}
        </div>
        <div className="mt-[30px] text-lg font-semibold leading-tight text-gray-1050">
          Company Address
        </div>
        <div className="el-form-item asterisk-right mt-5">
          <FormInput
            required
            label="Address line 1"
            value={company.address?.address1}
            labelError={errors.address?.address1}
            placeholder="Address Line 1"
            onChange={(e) => onChange && onChange(e, 'address', 'address1')}
            error={errors.address.address1 !== ''}
          />
        </div>
        <div className="el-form-item asterisk-right mt-5">
          <FormInput
            label="Address line 2"
            value={company.address?.address2}
            labelError={errors.address?.address2}
            placeholder="Address Line 2"
            onChange={(e) => onChange && onChange(e, 'address', 'address2')}
          />
        </div>
        <div className="flex items-center space-x-5 mt-5">
          <FormInput
            required
            label="City / Province"
            value={company.address?.city}
            labelError={errors.address?.city}
            placeholder="City"
            onChange={(e) => onChange && onChange(e, 'address', 'city')}
            error={errors.address.city !== ''}
            className="flex-1"
          />
          <FormInput
            required
            label="Postal Code"
            value={company.address?.zip}
            labelError={errors.address?.zip}
            placeholder="000-00"
            onChange={(e) => onChange && onChange(e, 'address', 'zip')}
            error={errors.address.zip !== ''}
            type="number"
          />
        </div>
      </div>
    </div>
  )
}

export default CompanyPanel