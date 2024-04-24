import React from "react";
import Link from "next/link";
import { useAlertContext } from "@/context/alertContext";
import apis from "@/apis";
import Modal from "@/components/CustomModal";
import { ICuration } from "@/components/PrdDetailCommon/prdDetailInterface";
import { CrossIcon, FacebookIcon, LinkedinIcon, PinterestIcon, TwitterIcon } from "@/utils/svgExport";
import Image from "next/image";

interface ShareModalProps {
  curation: ICuration;
  onClose: () => void;
  onShare: (val: number) => void;
  isPreview?: boolean;
}

const ShareModal = ({ curation, onClose, onShare, isPreview = false }: ShareModalProps) => {
  const { showAlert } = useAlertContext();
  const handleShare = () => {
    if (isPreview) return;
    apis
      .update("wl-curations", curation.id, {
        data: {
          shares: curation.attributes.shares + 1,
        },
      })
      .then((res) => {
        const curation: ICuration = res.data.data;
        onShare(curation.attributes.shares);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Modal onClose={onClose}>
      <div id="el-id-4766-7" className="el-dialog__body">
        <div className="flex w-full justify-end pb-4 pr-5 pt-5">
          <Image src={CrossIcon} alt="" className="my-px h-3 w-3 cursor-pointer" onClick={() => onClose()} />
        </div>
        <div className="mb-1.5 overflow-hidden text-ellipsis break-normal px-4 text-center text-2xl font-[RobotoBold] font-semibold leading-tight text-[--gray-text]">
          Don’t Keep {curation.attributes.name} a Secret!
        </div>
        <div className="break-normal text-center text-base font-normal leading-5 tracking-wide text-[--text-gray] mx-auto max-w-[382px]">
          Share {curation.attributes.name} with friends or on social media to boost its exposure and support its
          creators.
        </div>
        <div className="relative mb-8 mt-6 flex overflow-hidden rounded-lg border border-gray-1500 bg-white mx-[40px] max-w-full shadow-productShareInfo cardShare">
          <div className="group/items rounded-10 mr-5 flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-10 md:mr-[30px] md:h-[160px] md:w-[160px]">
            <video
              src={`${process.env.NEXT_PUBLIC_BE_URL}${curation.attributes.hoverVideo?.data?.attributes.url}`}
              className="h-full w-full object-cover hidden group-hover/items:block"
              loop
              playsInline
              muted
              autoPlay
            ></video>
            <Image
              src={`${process.env.NEXT_PUBLIC_BE_URL}${curation.attributes.thumbnail?.data?.attributes.url}`}
              className="h-full max-h-full w-full max-w-full object-cover group-hover/items:hidden"
              alt=""
              width={0}
              height={0}
              sizes="100vw"
            />
          </div>
          <div className="mr-2 mt-[22px] grow md:mt-0 md:flex md:max-w-[390px] md:flex-col md:justify-center md:pb-[9px] md:pt-2.5">
            <div className="flex items-center text-xs font-[RobotoBold] font-bold leading-tight text-[--gray-text]">
              <h2 className="product-title line-clamp-1 text-ellipsis">{curation.attributes.name}</h2>
            </div>
            <h3 className="product-headline mt-1.5  text-lg font-semibold font-[RobotoBold] leading-tight text-[--gray-text] md:mt-2 line-clamp-1 text-ellipsis">
              {curation.attributes.headline}
            </h3>
            {/* <div className="mt-[11px] text-sm font-medium leading-[1.4] text-gray-2350 max-md:hidden text-[--gray-text] line-clamp-3 text-ellipsis">
                  {curation.attributes.prodDtl?.productPageHeadline}
                </div> */}
            <div className=" md:flex-wrap hidden md:flex mt-2.5">
              {Array.from(curation.attributes.tags.data || []).map((_i: any, idx: number) => (
                <Link
                  key={idx}
                  onClick={() => {
                    onClose();
                  }}
                  href={`/tag/${_i.attributes.slug}`}
                  className="mb-1 mr-1 flex min-h-[24px] items-center whitespace-normal rounded px-1 py-0.5 text-15 font-semibold leading-4 md:min-h-[20px] md:leading-4 md:text-sm text-[--gray] tagPrd"
                >
                  {_i.attributes.name}
                </Link>
              ))}
            </div>
            <div className="mt-2.5 flex flex-wrap"></div>
          </div>
        </div>
        <div className="flex h-[74px] items-center justify-center shadow-productShareNetwork">
          <div className="share-network-facebook mr-2 cursor-pointer">
            <Image src={FacebookIcon} alt="" />
          </div>
          <div className="share-network-pinterest mr-2 cursor-pointer">
            <Image src={PinterestIcon} alt="" />
          </div>
          <div className="share-network-linkedin mr-2 cursor-pointer">
            <Image src={LinkedinIcon} alt="" />
          </div>
          <div className="share-network-twitter mr-2 cursor-pointer">
            <Image src={TwitterIcon} alt="" />
          </div>
          <div
            className={`select-none cursor-pointer flex h-9 font-[RobotoBold] items-center rounded-full bg-[--brand-primary] px-4 text-center text-sm font-semibold tracking-wide text-[--gray-white] hover:bg-[--brand-primary-hover] active:bg-[--brand-primary-pressed]`}
            onClick={() => {
              showAlert("success", "Copied!");
              navigator.clipboard.writeText(window.location.href);
              handleShare();
            }}
          >
            Copy Link
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
