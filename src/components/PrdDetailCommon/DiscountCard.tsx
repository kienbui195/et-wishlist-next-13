import { RootState } from "@/lib/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ENUM_WL_SYS_CONFIG } from "@/utils/constants";
import { IProductState, prdDetailState } from "./prdDetailInterface";
import { formatDataNumber, getCurrencyCode } from "@/utils/function";
import { useAlertContext } from "@/context/alertContext";
import useUserLogin from "@/hooks/useUserLogin";
import apis from "@/apis";
import moment from "moment";
import { setOpenModalLogin } from "@/lib/features/authenticate/loginSlice";
import Image from "next/image";
import {
  CheckSuccess,
  CopyClipboard,
  StatusError,
  StatusWarning,
  UpvotedDetail,
  UpvotedDetailHover,
  UpVoteDetail,
} from "@/utils/svgExport";
import Link from "next/link";

interface DiscountCardProps {
  product: IProductState;
  prdDetail: prdDetailState;
  votes: number;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  disabled: boolean;
  copyClipboard: boolean;
  setCopyClipboard: React.Dispatch<React.SetStateAction<boolean>>;
  handleGetPageData: () => void;
  isDemo?: boolean;
}

const DiscountCard = ({
  product,
  prdDetail,
  votes,
  setDisabled,
  handleGetPageData,
  setCopyClipboard,
  copyClipboard,
  disabled,
  isDemo = false,
}: DiscountCardProps) => {
  const { showAlert } = useAlertContext();
  const wlMemberType = useSelector((state: RootState) => state.user.user).wl_member_type;
  const dispatch = useDispatch();

  const { token } = useUserLogin();

  const handleGetDiscount = () => {
    if (token) {
      setDisabled(true);
      apis
        .post("upVote", {
          sp_product_id: product?.attributes?.shopProductId,
          product_id: product?.id,
          date: moment().format("YYYYMMDD"),
        })
        .then((res) => {
          showAlert("success", "Vote successful!");
          handleGetPageData();
          setDisabled(false);
        })
        .catch((err) => {
          setDisabled(false);
          showAlert("error", "Vote failed, an error occurred, please try again!");
        });
    }
  };
  const salePer = wlMemberType && wlMemberType.id === ENUM_WL_SYS_CONFIG.SUBSCRIBED_ET_MEMBER ? 40 : 20;
  const pricePrd = product && product.attributes ? product.attributes.shopVariantPrice : 0;
  const priceSale = Math.ceil(pricePrd - pricePrd * (salePer / 100));

  const productBuyLink = product?.attributes?.shop?.data?.attributes?.storefrontAccessToken
    ? `http://${product?.attributes.shop.data.attributes.domain}/cart/${product?.attributes.shopVariantId}:1?access_token=${product?.attributes?.shop?.data?.attributes?.storefrontAccessToken}`
    : "";

  return prdDetail.voted && prdDetail.discount.status === "ACTIVE" ? (
    <div className="w-[440px] md:flex hidden justify-end mt-[38px]">
      <div
        id="to-discount-1549"
        className="discount-section relative h-fit w-full overflow-hidden break-normal rounded-xl border border-gray-2400 lg:p-[32px_40px] p-[28px_36px]  shadow-couponWidget hidden max-w-[400px] md:block "
      >
        <div className="truncate pb-2 product-title-22 text-[--gray-text]">Thanks for voting!</div>
        <div className="mb-5 mt-3 flex items-center space-x-4">
          <Image src={UpVoteDetail} alt="" width="16" height="16" className="h-7 w-7" />
          <span className="text-[--gray-text] text-title-18">{votes ? formatDataNumber(votes, 0) : 0} Upvotes</span>
        </div>
        <div className="overflow-hidden text-ellipsis R-product-content-16 text-[--gray-text]">
          As a thank you for helping boost their exposure on Wishlist,{" "}
          <span title={product?.attributes.name}>{product?.attributes.name}</span> just unlocked your unique discount
          code below.
        </div>
        <div
          className={`mt-[22px] flex h-14 w-full items-center justify-center bg-[--gray-line] text-title-18 ${
            copyClipboard ? "text-[--state-success]" : "text-[--gray-text]"
          }`}
        >
          {prdDetail.discount.discount_code}
          <Image
            src={copyClipboard ? CheckSuccess : CopyClipboard}
            alt=""
            className="ml-[11px] cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(prdDetail.discount.discount_code);
              showAlert("success", "Copied discount code successfully");
              setCopyClipboard(true);
            }}
          />
        </div>
        <Link
          href={
            productBuyLink
              ? `${productBuyLink}&discount=${prdDetail.discount.discount_code}`
              : `${product?.attributes.prodDtl?.productPageLink}?ref=ETWishlist&utm_source=ETWishlist&utm_medium=voting&utm_campaign=voting`
          }
          target="_blank"
          rel="noreferrer"
        >
          <button
            type="button"
            className="mt-2.5 flex h-14 w-full items-center justify-center whitespace-nowrap font-[RobotoBold] rounded-lg bg-[--brand-primary] hover:bg-[--brand-primary-hover] active:bg-[--brand-primary-pressed] px-1 text-center text-xl font-bold text-[--gray-white]"
          >
            Buy With Discount
          </button>
        </Link>
        <div className="mt-[22px] text-center R-body-box text-[--gray-text]">
          The discount code above is unique to you and can only be used once. You can access all of your discounts later
          in your ‘My Votes’ page.
        </div>
        <canvas
          width="402"
          height="500"
          className="confetti-canvas pointer-events-none absolute left-0 top-0 h-full w-full"
        ></canvas>
      </div>
    </div>
  ) : (
    <div
      id="to-discount-2306"
      className="discount-section relative h-fit w-full overflow-hidden break-normal rounded-xl border border-gray-2400 px-[40px] py-[32px] shadow-couponWidget hidden min-[852px]:max-w-[440px] max-w-[360px] min-[852px]:ml-4 md:block mt-[38px]"
    >
      <div className="w-full">
        <div className="product-title-22 text-[--gray-text]">
          {prdDetail.discount.discount_value !== ""
            ? `Upvote for ${prdDetail.discount.discount_value}% Off Your Order`
            : `Upvote for exclusive offer`}
        </div>
        <div
          className="mt-2 overflow-hidden text-ellipsis R-content-15 text-[--gray-text]"
          style={{ fontSize: "15px" }}
        >
          Support <span title={product?.attributes.name}>{product?.attributes.name}</span> with an upvote to unlock your
          unique discount code to use on their website.
        </div>
        <div>
          <div className="mt-4 flex items-center space-x-1 product-title-22 text-[--gray-text]">
            <div style={{ fontSize: "1.375rem" }} className="font-bold leading-8">
              {getCurrencyCode(
                product?.attributes.shopVariantCurrency ? product?.attributes.shopVariantCurrency : "USD"
              )}
              {formatDataNumber(Number(priceSale), 2)}
            </div>
            <div className="flex h-[20px] items-center rounded-full bg-[--brand-secondary2] px-2 text-xs font-normal text-white py-1">
              {`${salePer}%`} Off
            </div>
          </div>
          <div className="mt-1 text-[12px] leading-[15px] font-normal tracking-tight text-[--gray-text] line-through font-[RobotoRegular]">
            Normally:{" "}
            {getCurrencyCode(product?.attributes.shopVariantCurrency ? product?.attributes.shopVariantCurrency : "USD")}
            {formatDataNumber(Number(pricePrd), 2)}
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center flex-col space-x-2">
        <div className="flex flex-col mt-[28px] w-full">
          {prdDetail.discount.status !== "" && (
            <div className=" flex items-center justify-start R-content-15 space-x-[1px]">
              <Image
                src={prdDetail.discount.status === "EXPIRED" ? StatusWarning : StatusError}
                alt=""
                className="mr-[1px]"
              />
              <div>
                <span>Your Discount Code</span>
                <span
                  className={
                    prdDetail.discount.status === "EXPIRED" ? "text-[--state-warning]" : "text-[--state-error]"
                  }
                >
                  {prdDetail.discount.discount_code}
                </span>
                {`${prdDetail.discount.status === "EXPIRED" ? " is expired" : " is applied"}`}
              </div>
            </div>
          )}

          <button
            className={`group ${
              prdDetail.discount.status !== "" ? "mt-[16px]" : ""
            } flex h-14 w-full items-center justify-center whitespace-nowrap rounded-md bg-[--brand-primary] text-center text-link-16 text-[--gray-white] hover:bg-[--brand-primary-hover]`}
            onClick={
              !isDemo
                ? () => {
                    if (token) {
                      !disabled && handleGetDiscount();
                    } else {
                      dispatch(setOpenModalLogin(true));
                      showAlert("warning", "This feature requires logging in to use");
                    }
                  }
                : () => {}
            }
          >
            Upvote
            <span className="ml-2.5 h-6 w-6 overflow-hidden rounded-full border-2 border-white bg-white group-hover:bg-[--brand-primary] pt-1">
              <Image
                src={UpvotedDetail}
                width="11"
                height="13"
                alt=""
                className="m-auto transition-transform duration-300 group-hover:-translate-y-6 group-hover:opacity-0 w-3"
              />
              <Image
                src={UpvotedDetailHover}
                width="11"
                height="13"
                alt=""
                className="m-auto opacity-0 transition-transform duration-300 group-hover:-translate-y-3 group-hover:opacity-100 w-3"
              />
            </span>
            <span className="ml-2.5 text-[--gray-white]">
              {product?.attributes.votes ? formatDataNumber(product?.attributes.votes, 0) : 0}
            </span>
          </button>
        </div>
        <Link
          href={
            productBuyLink
              ? productBuyLink
              : `${product?.attributes.prodDtl?.productPageLink}?ref=ETWishlist&utm_source=ETWishlist&utm_medium=voting&utm_campaign=voting`
          }
          target="_blank"
          className="justify-content flex h-14 w-full shrink-2 cursor-pointer items-center justify-center whitespace-nowrap font-[RobotoBold] rounded-md border-2 border-gray-1350 text-xl leading-none text-[--black-btn-text]"
          rel="noreferrer"
        >
          Buy Now
        </Link>
      </div>
      <div className="leading-4.4 mt-[22px] text-center R-body-box text-[--gray-text]">
        Discount code revealed after voting.
      </div>
      <canvas
        width="402"
        height="500"
        className="confetti-canvas pointer-events-none absolute left-0 top-0 h-full w-full"
      ></canvas>
    </div>
  );
};

export default DiscountCard;
