import React from "react";
import { ProductPanelProps } from "./type";
import FormTextarea from "@/components/FormTextarea/FormTextarea";
import SingleSelect from "@/components/SingleSelect";

const PanelMoreInfo: React.FC<ProductPanelProps> = ({ data, onSetState, errors }) => {
  return (
    <div id="pane-More Info" className="el-tab-pane" role="tabpanel" aria-hidden="true" aria-labelledby="tab-More Info">
      <div product-form-ref="[object Object]">
        <div>
          <h2 className="mt-[25px] text-sm font-medium leading-none tracking-tight text-black">More Details</h2>
          <h3 className="mt-2.5 text-base leading-tight text-gray-1150">
            Located at the bottom of your Product Page, include detailed information about shipping, returns, and what Shoppers can expect when they buy your
            product. Accurate information ensures a great customer experience and encourages purchases.
          </h3>
        </div>
        <div className="mt-[30px] flex pb-5">
          <div className="mr-[75px] w-full max-w-[520px]">
            <div className="el-form-item is-required asterisk-right">
              <FormTextarea
                required
                label="Features"
                limitCharacter={400}
                value={data.moreInfo?.features}
                placeholder="Highlight the top features your customers love most and what sets your product apart from others. Note: This section will be formatted using bullet points. Each line of text you write will become a separate bullet point on the page. To create a new bullet point, simply press the Return or Enter key on your keyboard to start a new line."
                onChange={(e) => {
                  onSetState((preState) => ({
                    ...preState,
                    moreInfo: {
                      ...preState.moreInfo,
                      features: e.target.value,
                    },
                  }));
                }}
                error={errors?.features !== ""}
                labelError={errors?.features}
              />
            </div>
          </div>
          <div className="mr-[75px] w-full max-w-[520px]">
            <div className="el-form-item is-required asterisk-right">
              <FormTextarea
                required
                label="Shipping Information"
                limitCharacter={250}
                value={data.moreInfo?.shippingInfo}
                placeholder="Set clear and realistic expectations for Shoppers. How fast is the product shipped? Average delivery time? Do you offer free or expedited shipping options?"
                onChange={(e) => {
                  onSetState((preState) => ({
                    ...preState,
                    moreInfo: {
                      ...preState.moreInfo,
                      shippingInfo: e.target.value,
                    },
                  }));
                }}
                error={errors?.shippingInfo !== ""}
                labelError={errors?.shippingInfo}
              />
            </div>
            <div className="el-form-item is-required asterisk-right mt-5">
              <FormTextarea
                required
                label="Return &amp; Exchange Policy"
                limitCharacter={250}
                value={data.moreInfo?.returnExchangePolicy}
                placeholder="What's the return/exchange time frame? Any requirements or conditions? Are there fees like restocking or return shipping charges?"
                onChange={(e) => {
                  onSetState((preState) => ({
                    ...preState,
                    moreInfo: {
                      ...preState.moreInfo,
                      returnExchangePolicy: e.target.value,
                    },
                  }));
                }}
                error={errors?.returnPolicy !== ""}
                labelError={errors?.returnPolicy}
              />
            </div>
            <div className="el-form-item is-required asterisk-right mt-5">
              <FormTextarea
                required
                label="What’s Included"
                limitCharacter={250}
                value={data.moreInfo?.whatIncluded}
                placeholder="Emphasize the value of your product by listing everything that Shoppers will receive when they purchase it, including any accessories, add-ons etc..."
                onChange={(e) => {
                  onSetState((preState) => ({
                    ...preState,
                    moreInfo: {
                      ...preState.moreInfo,
                      whatIncluded: e.target.value,
                    },
                  }));
                }}
                error={errors?.includes !== ""}
                labelError={errors?.includes}
              />
            </div>
            <div className="el-form-item asterisk-right mt-5">
              <SingleSelect
                label="What’s Included title"
                placeholder="Select title"
                value={data.moreInfo?.whatIncludedTitle}
                list={[
                  { id: "What's Included", name: "What's Included" },
                  { id: "Ingredients", name: "Ingredients" },
                ]}
                onChange={(val) => {
                  onSetState((preState) => ({
                    ...preState,
                    moreInfo: {
                      ...preState.moreInfo,
                      whatIncludedTitle: val.name,
                    },
                  }));
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelMoreInfo;
