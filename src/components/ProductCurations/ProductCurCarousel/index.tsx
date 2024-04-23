import React, { FC } from "react";
import "./index.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { DefaultThumbnail2 } from "@/utils/svgExport";

interface IProductCurCarouselProps {
  images:
    | {
        attributes: {
          url: string;
        };
      }[]
    | [];
  autoSlideDelay?: number;
  isAutoPlay?: boolean;
  className?: string;
  isAcceptClose?: boolean;
  onClose?: () => void;
  containWidth?: string;
  imageWidth?: string;
  imageHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
}

const ProductCurCarousel: FC<IProductCurCarouselProps> = ({
  images = [],
  autoSlideDelay = 10000,
  className = "",
  isAcceptClose = true,
  isAutoPlay = false,
  onClose,
  containWidth = "w-full",
  imageWidth = "w-auto",
  imageHeight = "h-[170px]",
  maxWidth = "max-w-[1060px]",
  maxHeight = "max-h-[848px]",
}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // vertical: true,
    // verticalSwiping: true,
  };

  return (
    <div className="el-carousel__container">
      {images.length > 0 ? (
        <Slider {...settings}>
          {images.map((_i, idx) => {
            return (
              <Image
                key={idx}
                src={`${process.env.NEXT_PUBLIC_BE_URL}${_i?.attributes.url}`}
                alt=""
                className={` ${imageHeight} ${imageWidth} ${maxHeight} object-contain cursor-pointer`}
                width={0}
                height={0}
                sizes="100vw"
              />
            );
          })}
        </Slider>
      ) : (
        <Image src={DefaultThumbnail2} alt="" className={` ${imageHeight} ${imageWidth} object-contain cursor-pointer`} />
      )}
    </div>
  );
};

export default ProductCurCarousel;
