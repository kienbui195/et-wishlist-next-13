import React from "react";
import { IProductState, prdDetailState } from "./prdDetailInterface";
import OurStoryModal from "./OurStoryModal";
import { DefaultAvatar } from "@/utils/svgExport";

interface OurStoryProps {
  setPrdDetail: React.Dispatch<React.SetStateAction<prdDetailState>>;
  prdDetail: prdDetailState;
  product: IProductState;
}

const OurStory = ({ setPrdDetail, prdDetail, product }: OurStoryProps) => {
  return (
    <div className="el-overlay" style={{ zIndex: "2009" }} id="ourstoryModal">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="el-id-8149-4"
        aria-describedby="el-id-8149-5"
        className="el-overlay-dialog"
      >
        <div
          className="el-dialog mainContent max-w-[90vw] !w-fit is-align-center top-5 px-5 py-8 md:top-auto md:w-fit md:py-16 md:pl-[51px] md:pr-[49px] !h-fit"
          tabIndex={-1}
        >
          <header className="el-dialog__header">
            <button
              aria-label="Close this dialog"
              className="el-dialog__headerbtn"
              type="button"
              onClick={() => {
                document.body.classList.remove("overflow-hidden");
                setPrdDetail({
                  ...prdDetail,
                  showStory: !prdDetail.showStory,
                });
              }}
            >
              <i className="el-icon el-dialog__close">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                  <path
                    fill="currentColor"
                    d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
                  ></path>
                </svg>
              </i>
            </button>
          </header>

          <OurStoryModal
            onClick={() => {
              document.body.classList.remove("overflow-hidden");
              console.log("an close");

              setPrdDetail((preState) => ({
                ...preState,
                showStory: false,
              }));
            }}
            avatarUrl={
              product?.attributes.ourStory?.founderImage.data?.attributes.url
                ? `${product?.attributes.ourStory?.founderImage.data?.attributes.url}`
                : DefaultAvatar
            }
            founderName={product?.attributes.ourStory?.founderName ? product?.attributes.ourStory?.founderName : ""}
            storyHeadline={
              product?.attributes.ourStory?.storyHeadline ? product?.attributes.ourStory?.storyHeadline : ""
            }
            storyDesc={product?.attributes.ourStory?.storyDesc ? product?.attributes.ourStory?.storyDesc : ""}
            storyClipUrl={
              product?.attributes?.storyClip?.data?.attributes?.clip?.data?.attributes.url
                ? `${product?.attributes?.storyClip?.data?.attributes?.clip?.data?.attributes.url}`
                : ""
            }
          />
        </div>
      </div>
    </div>
  );
};

export default OurStory;
