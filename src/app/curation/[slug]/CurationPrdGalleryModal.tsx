'use client'

import React, { useEffect, useRef, useState } from "react";
import { prdDetailState, ICuration } from "@/components/PrdDetailCommon/prdDetailInterface";

import Slider from "react-slick";
import "@/components/PrdDetailCommon/PrdGalleryModal.css";
import { CrossIcon } from "@/utils/svgExport";
import Image from "next/image";

interface CurationPrdGalleryModalProps {
  product: ICuration;
  setPrdDetail: React.Dispatch<React.SetStateAction<prdDetailState>>;
  prdDetail: prdDetailState;
  closeGallery: any;
  windowSize: {
    width: number;
    height: number;
  };
  initSlideIndex?: number;
}

const CurationPrdGalleryModal = ({
  product,
  setPrdDetail,
  prdDetail,
  initSlideIndex = 0,
}: CurationPrdGalleryModalProps) => {
  let LIST_GALLERY: string[] = [];

  if (Array.from(product?.attributes?.images?.data || []).length > 0) {
    LIST_GALLERY = Array.from(product?.attributes?.images?.data || []).reduce((acc: string[], item) => {
      acc.push(item.attributes.url);
      return acc;
    }, []);
  }
  const sicklier = useRef<Slider>(null);
  useEffect(() => {
    const hanleKeyDown = (e: any) => {
      if (e.keyCode == 37) {
        (sicklier.current as Slider).slickPrev();
      }
      if (e.keyCode == 39) {
        (sicklier.current as Slider).slickNext();
      }
    };
    document.addEventListener("keydown", hanleKeyDown);
    return () => {
      document.removeEventListener("keydown", hanleKeyDown);
    };
  }, [prdDetail.selectedGlrImage]);

  const [settingSlider, setSettingSlider] = useState({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: initSlideIndex,
    // vertical: true,
    // verticalSwiping: true,
  });

  return (
    <div className="el-overlay galeryImage" style={{ zIndex: "2009" }} id="galeryImageContainer">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="el-id-8149-4"
        aria-describedby="el-id-8149-5"
        className="el-overlay-dialog"
        style={{ display: "flex" }}
      >
        <>
          <div className="el-carousel el-carousel--horizontal gallery-carousel h-screen w-full" id="galleryCarousel">
            <div className="el-carousel__container">
              <Slider {...settingSlider} ref={sicklier}>
                {LIST_GALLERY.map((_i, idx) => {
                  return (
                    <div
                      key={idx}
                      className="!flex h-full max-h-[1000px] w-full max-w-[1000px] items-center justify-center"
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BE_URL}${_i}`}
                        alt=""
                        className="h-auto max-h-full w-auto max-w-full rounded-10 object-contain"
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>
          <div
            className="absolute right-[30px] top-[30px] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white"
            onClick={() => {
              document.body.classList.remove("overflow-hidden");
              setPrdDetail((preState: any) => ({
                ...preState,
                showGallery: !prdDetail.showGallery,
                selectedGlrImg: -1,
              }));
            }}
          >
            <Image className="w-6 h-6" src={CrossIcon} alt="" />
          </div>
        </>
      </div>
    </div>
  );
};

export default CurationPrdGalleryModal;
