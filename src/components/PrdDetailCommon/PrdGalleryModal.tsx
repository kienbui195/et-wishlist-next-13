import React, { useEffect, useRef, useState } from "react";
import { IProductState, prdDetailState } from "./prdDetailInterface";
import CrossIcon from "../../assets/svg/Cross.svg";
import Slider from "react-slick";
import "./PrdGalleryModal.css";
import Image from "next/image";

interface PrdGalleryModalProps {
  product: IProductState;
  setPrdDetail: React.Dispatch<React.SetStateAction<prdDetailState>>;
  prdDetail: prdDetailState;
  closeGallery: any;
  windowSize: {
    width: number;
    height: number;
  };
}

const PrdGalleryModal = ({ product, setPrdDetail, prdDetail, closeGallery, windowSize }: PrdGalleryModalProps) => {
  let LIST_GALLERY: string[] = [];

  if (Array.from(product?.attributes.images.data || []).length > 0) {
    LIST_GALLERY = Array.from(product?.attributes.images.data || []).reduce((acc: string[], item) => {
      acc.push(item.attributes.url);
      return acc;
    }, []);
  }
  const slickslider = useRef<Slider>(null);
  useEffect(() => {
    const hanleKeyDown = (e: any) => {
      if (e.keyCode == 37) {
        (slickslider.current as Slider).slickPrev();
      }
      if (e.keyCode == 39) {
        (slickslider.current as Slider).slickNext();
      }
    };
    if (prdDetail.selectedGlrImage > -1) {
      document.addEventListener("keydown", hanleKeyDown);
    }
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
    initialSlide: 0,
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
        {prdDetail.selectedGlrImage === -1 && (
          <div className=" bg-white top-5 w-full md:top-auto " tabIndex={-1}>
            <header className="el-dialog__header hidden">
              <button
                aria-label="Close this dialog"
                className="el-dialog__headerbtn"
                type="button"
                onClick={() => {
                  document.body.classList.remove("overflow-hidden");
                  setPrdDetail((preState: prdDetailState) => ({
                    ...preState,
                    showGallery: !prdDetail.showGallery,
                  }));
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
            <div id="el-id-25-3" className="el-dialog__body">
              <div
                className="absolute right-12 top-12 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white"
                onClick={() => {
                  document.body.classList.remove("overflow-hidden");
                  setPrdDetail((preState: prdDetailState) => ({
                    ...preState,
                    showGallery: !prdDetail.showGallery,
                  }));
                }}
                ref={closeGallery.current}
              >
                <Image src={CrossIcon} alt="" width="24" height="24" />
              </div>
              <div className="grid-container mx-auto my-20 grid max-w-[1080px] gap-2.5 px-2.5 overflow-hidden">
                {LIST_GALLERY.map((_i, idx) => (
                  <div
                    key={idx}
                    className={`${idx % 3 === 0 ? "col-span-2" : "col-span-1"}`}
                    onClick={() => {
                      setSettingSlider((preState: any) => ({
                        ...preState,
                        initialSlide: idx,
                      }));
                      setPrdDetail((preState: prdDetailState) => ({
                        ...preState,
                        selectedGlrImg: 0,
                      }));
                    }}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BE_URL}${_i}`}
                      alt=""
                      className="max-h-[760px] h-[71vw] w-full object-cover"
                      width={0}
                      height={0}
                      sizes="100vw"
                    />
                  </div>
                ))}
              </div>
              <div className="el-overlay" style={{ zIndex: "2007", display: "none" }}>
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="el-id-25-10"
                  aria-describedby="el-id-25-11"
                  className="el-overlay-dialog"
                ></div>
              </div>
            </div>
          </div>
        )}
        {prdDetail.selectedGlrImage > -1 && (
          <>
            <div className="el-carousel el-carousel--horizontal gallery-carousel h-screen w-full" id="galleryCarousel">
              <div className="el-carousel__container">
                <Slider {...settingSlider} ref={slickslider}>
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
        )}
      </div>
    </div>
  );
};

export default PrdGalleryModal;
