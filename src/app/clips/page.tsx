"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import CustomButton from "./CustomButton";
import CustomTag from "./CustomTag";
import { useAlertContext } from "@/context/alertContext";
import Modal from "../../components/CustomModal";
import ProductCardMini from "./ProductCardMini";
import { convertKeys, createQuery, devLog, formatDataNumber } from "../../utils/function";
import apis from "../../apis";
import { IPagination } from "@/data/types";
import LoadingScreen from "@/components/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalLogin } from "@/lib/features/authenticate/loginSlice";
import moment from "moment";
import {
  ArrowUp,
  BeforeLike,
  CloseGalleryButton,
  FacebookIcon,
  LinkedinIcon,
  MuteOff,
  MuteOn,
  PinterestIcon,
  TwitterIcon,
  UpVote,
  VideoWarning,
  ShareCurationNoOutline,
  BgWhite,
  DefaultThumbnail,
  ShareDark,
} from "@/utils/svgExport";
import useUserLogin from "@/hooks/useUserLogin";
import useMediaQuery from "@/hooks/useMediaQuery";
import { setMutedVideo } from "@/lib/features/global/mutedVideoSlice";
import { RootState } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export type TVoteStatus = "" | "ACTIVE" | "LIMIT" | "EXPIRED";

interface ITag {
  id: number;
  attributes: {
    name: string;
    slug: string;
  };
}

export interface IPageInfoState {
  id: number;
  attributes: {
    views: number;
    likes: number;
    isLike: boolean;
    clip: {
      data?: {
        id: number;
        attributes: {
          name: string;
          url: string;
        };
      };
    };
    product: {
      voted?: boolean;
      data: {
        id: number;
        attributes: {
          name: string;
          slug: string;
          headline: string;
          subHeadline: string;
          tags: {
            data: ITag[];
          };
          thumbnail: {
            data: {
              id: number;
              attributes: {
                name: string;
                url: string;
              };
            };
          };
          hoverVideo: {
            data: {
              id: number;
              attributes: {
                name: string;
                url: string;
              };
            };
          };
          votes?: number;
          shopProductId: number;
          shares: number;
        };
      } | null;
    };
    brand?: {
      id: number;
      name: string;
      logo?: {
        name: string;
        url: string;
      };
    };
    discount?: {
      value?: string;
    };
  };
}

const ClipPage = () => {
  const { showAlert } = useAlertContext();
  const [isVoted, setIsVoted] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const closeSharePrd = useRef<HTMLDivElement>(null);
  const [pageInfo, setPageInfo] = useState<IPageInfoState[]>([]);
  const [currentInfo, setCurrentInfo] = useState<IPageInfoState | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10,
    total: 0,
    pageCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const mutedVideo = useSelector((state: RootState) => state.mutedVideo);
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const ci = new URLSearchParams(location.search).get("ci");
  const { token } = useUserLogin();
  const mediaQuery = useMediaQuery();

  const handleVote = () => {
    if (!token) {
      dispatch(setOpenModalLogin(true));
      showAlert("warning", "This feature need login to use!");
    } else {
      if (currentInfo?.attributes?.product?.data?.id) {
        setDisabled(true);
        apis
          .upVote(
            currentInfo.attributes.product.data?.id,
            currentInfo.attributes.product.data?.attributes.shopProductId + ""
          )
          .then((res) => {
            showAlert("success", "Vote successfully");
            getOneClips(currentInfo.id);
            setIsVoted(true);
            setCurrentInfo({
              ...currentInfo,
              attributes: {
                ...currentInfo.attributes,
                discount: {
                  ...currentInfo.attributes.discount,
                  value: res.data.discountCode.value,
                },
                product: {
                  ...currentInfo.attributes.product,
                  voted: true,
                },
              },
            });
            setDisabled(false);
          })
          .catch((err) => {
            devLog(err, "vote err");
            setDisabled(false);
            showAlert("error", "Something went wrong! Please try again later");
          });
      }
    }
  };

  const handleLike = () => {
    currentInfo &&
      apis
        .post("wl-clip-likes/like", {
          data: {
            clip_id: currentInfo.id,
          },
        })
        .then((res) => {
          const { clip } = res.data;
          const newCurrentInfo = {
            ...currentInfo,
            attributes: {
              ...currentInfo.attributes,
              isLike: clip.isLike,
              likes: clip.likes,
            },
          };
          const newPageInfo = [...pageInfo];
          newPageInfo.splice(currentIdx, 1, newCurrentInfo);
          setPageInfo(newPageInfo);
          setCurrentInfo(newCurrentInfo);
        })
        .catch((err) => {
          devLog(err.message, "handleLike");
          err?.response?.status === 401 && dispatch(setOpenModalLogin(true));
          showAlert("warning", err?.response?.data?.error || err.message);
        });
  };

  const handleUnLike = () => {
    currentInfo &&
      apis
        .post("wl-clip-likes/unlike", {
          data: {
            clip_id: currentInfo.id,
          },
        })
        .then((res) => {
          const { clip } = res.data;
          const newCurrentInfo = {
            ...currentInfo,
            attributes: {
              ...currentInfo.attributes,
              isLike: clip.isLike,
              likes: clip.likes,
            },
          };
          const newPageInfo = [...pageInfo];
          newPageInfo.splice(currentIdx, 1, newCurrentInfo);
          setPageInfo(newPageInfo);
          setCurrentInfo(newCurrentInfo);
        })
        .catch((err) => {
          devLog(err.message, "handleUnLike");
          err?.response?.status === 401 && dispatch(setOpenModalLogin(true));
          showAlert("warning", err?.response?.data?.error || err.message);
        });
  };

  const handleNextVideo = (isNext = true) => {
    setIsVoted(false);
    if (isNext) {
      setCurrentIdx((preState) => preState + 1);
    } else {
      setCurrentIdx((preState) => (preState - 1 >= 0 ? preState - 1 : preState));
    }
  };

  const getOneClips = (id: number, isCallAfterVote: boolean = true) => {
    apis
      .getOne(
        "wl-clips",
        id,
        createQuery({
          populate: {
            clip: {
              fields: ["name", "url"],
            },
            product: {
              fields: ["name", "slug", "headline", "sub_headline", "votes", "shop_product_id", "shares"],
              populate: {
                thumbnail: {
                  fields: ["name", "url"],
                },
                hover_video: {
                  fields: ["name", "url"],
                },
                tags: {
                  fields: ["name", "slug"],
                },
              },
            },
            brand: {},
          },
          isClipsPage: true,
          filters: {
            product: {
              id: {
                $gt: 0,
              },
              product_type: {
                $ne: "Single",
              },
              page_submitted: 1,
              page_approved: 1,
              publishedAt: {
                $notNull: true,
              },
            },
          },
        })
      )
      .then((res) => {
        if (isCallAfterVote) {
          const data = [...pageInfo];
          data.splice(currentIdx, 1, convertKeys(res.data.data));
          setPageInfo(data);
        } else {
          if (!convertKeys(res.data.data).attributes.publishedAt) {
            showAlert("error", "Clip not found!");
            handleGetPageInfo(1, false);
          } else {
            setCurrentIdx(0);
            setPageInfo([convertKeys(res.data.data)]);
            handleGetPageInfo(1, true);
            setCurrentInfo(convertKeys(res.data.data));
          }
        }
      })
      .catch((err) => {
        devLog(err, "getOneClips");
        setLoading(false);
      });
  };

  const handleActionMuteInMobile = () => {
    dispatch(setMutedVideo(!mutedVideo));
    if (videoRef.current) {
      if (mutedVideo) {
        videoRef.current.muted = false;
      } else {
        videoRef.current.muted = true;
      }
    }
  };

  const handleShare = () => {
    if (currentInfo?.attributes.product.data?.id) {
      apis
        .update("wl-products", currentInfo?.attributes.product.data?.id, {
          data: {
            shares: currentInfo.attributes.product.data.attributes.shares + 1,
          },
        })
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleGetPageInfo = (pageNumber = pagination.page, isDetailFirst = false) => {
    apis
      .get(
        "wl-clips",
        createQuery({
          filters: {
            ...(ci
              ? {
                  id: {
                    $notIn: [+ci],
                  },
                }
              : {}),
            product: {
              id: {
                $gt: 0,
              },
              product_type: {
                $ne: "Single",
              },
              page_submitted: 1,
              page_approved: 1,
              publishedAt: {
                $notNull: true,
              },
            },
          },
          pagination: {
            page: pageNumber,
            pageSize: pagination.pageSize,
          },
          populate: {
            clip: {
              fields: ["name", "url"],
            },
            product: {
              fields: ["name", "slug", "headline", "sub_headline", "votes", "shop_product_id", "shares"],
              populate: {
                thumbnail: {
                  fields: ["name", "url"],
                },
                hover_video: {
                  fields: ["name", "url"],
                },
                tags: {
                  fields: ["name", "slug"],
                },
              },
            },
          },
          isClipsPage: true,
        })
      )
      .then((res) => {
        const { data, meta } = res.data;
        const { page, pageCount, total } = meta.pagination;
        const clips: IPageInfoState = convertKeys(data);
        setPageInfo((preState) =>
          pagination.page === 1
            ? isDetailFirst
              ? [...preState, ...convertKeys(clips)]
              : convertKeys(clips)
            : [...preState, ...convertKeys(clips)]
        );
        !isDetailFirst && setCurrentInfo(convertKeys(clips)[0]);
        setPagination((preState) => ({ ...preState, page, pageCount, total }));
        setLoading(false);
      })
      .catch((err) => {
        devLog(err, "handleGetPageInfo");
        setLoading(false);
      });
  };

  const renderSharePrd = () => {
    return (
      <div id="el-id-4766-7" className="el-dialog__body">
        <div className="flex w-full justify-end pb-4 pr-5 pt-5" ref={closeSharePrd}>
          <Image
            src={CloseGalleryButton}
            alt=""
            className="my-px h-3 w-3 cursor-pointer"
            onClick={() => {
              document.body.classList.remove("overflow-hidden");
              setOpenShare(false);
            }}
          />
        </div>
        <div className="mb-1.5 overflow-hidden text-ellipsis break-normal px-4 text-center text-2xl font-semibold leading-tight text-[--gray-text]">
          Don’t Keep {currentInfo?.attributes.product?.data?.attributes.name} a Secret!
        </div>
        <div className="break-normal text-center text-base font-normal leading-5 tracking-wide text-[--text-gray] mx-auto max-w-[382px]">
          Share {currentInfo?.attributes.product?.data?.attributes.name} with friends or on social media to boost its
          exposure and support its creators.
        </div>
        <ProductCardMini
          name={currentInfo?.attributes.product?.data?.attributes.name || ""}
          headline={currentInfo?.attributes.product?.data?.attributes.headline || ""}
          hoverVideo={currentInfo?.attributes.product?.data?.attributes.hoverVideo.data?.attributes?.url || ""}
          thumbnail={currentInfo?.attributes.product?.data?.attributes.thumbnail.data?.attributes?.url || ""}
          pageHeadline={currentInfo?.attributes.product?.data?.attributes.subHeadline || ""}
        />
        <div className={`flex h-[74px] items-center justify-center `}>
          <Link className="share-network-facebook mr-2 cursor-pointer" href="/#">
            <Image src={FacebookIcon} alt="" />
          </Link>
          <Link className="share-network-pinterest mr-2 cursor-pointer" href="/#">
            <Image src={PinterestIcon} alt="" />
          </Link>
          <Link className="share-network-linkedin mr-2 cursor-pointer" href="/#">
            <Image src={LinkedinIcon} alt="" />
          </Link>
          <Link className="share-network-twitter mr-2 cursor-pointer" href="/#">
            <Image src={TwitterIcon} alt="" />
          </Link>
          <button
            type="button"
            className="flex h-9 items-center rounded-full bg-[--brand-primary] px-4 text-center text-sm font-semibold tracking-wide text-[--gray-white] hover:bg-[--brand-primary-hover] active:bg-[--brand-primary-pressed]"
            onClick={() => {
              showAlert("success", "Copied!");
              navigator.clipboard.writeText(window.location.href);
              handleShare();
            }}
          >
            Copy Link
          </button>
        </div>
      </div>
    );
  };

  const renderSectionAfterVote = () => {
    return (
      <div className="hidden text-center md:block">
        <div className="relative h-fit w-full overflow-hidden break-normal rounded-xl border border-gray-2400 px-10 py-[30px] text-left shadow-couponWidget">
          <div className="truncate pb-2 text-22 font-medium leading-none text-slate-1150"> Thanks For Voting! </div>
          <div className="overflow-hidden text-ellipsis text-base leading-normal text-slate-1150 ">
            {`Enjoy this exclusive discount from ${(
              <span>{currentInfo?.attributes.product?.data?.attributes.name}</span>
            )} as
            a thank you for boosting their exposure on Wishlist. As a thank you, they're giving you`}
            <span className="font-bold">
              {currentInfo?.attributes.discount?.value && !isNaN(Number(currentInfo?.attributes.discount?.value))
                ? `${Number(currentInfo?.attributes.discount.value) * 100}% Off`
                : `20% Off`}
            </span>{" "}
            your order.{" "}
          </div>
          <Link
            href={`/brands-products/${currentInfo?.attributes.product?.data?.attributes.slug}`}
            className="mt-2.5 block"
          >
            <button
              type="button"
              className=" font-bold mt-2.5 font-] flex h-14 w-full items-center justify-center whitespace-nowrap rounded-[6px] px-1 text-center text-white bg-[--brand-primary] hover:bg-[--brand-primary-hover] active:bg-[--primary-brand-pressed]"
            >
              Get Discount Code
            </button>
          </Link>
        </div>
        <Link
          href={`/brands-products/${currentInfo?.attributes.product?.data?.attributes.slug}`}
          className="mt-[31px] hidden whitespace-nowrap  text-base font-semibold leading-none text-black md:inline-block"
        >
          {" "}
          Visit Product Page{" "}
        </Link>
      </div>
    );
  };

  const renderSectionBeforeVote = () => {
    return (
      <div className="flex flex-col space-y-8 max-w-[357px]">
        <div className="flex flex-col space-y-[15px]">
          <div className="flex flex-col space-y-[6px]">
            <Link href={`/brands-products/${currentInfo?.attributes.product?.data?.attributes.slug}`}>
              <div className="R-home-content font-[RobotoBold]">
                {currentInfo?.attributes.product?.data?.attributes.name}
              </div>
              <div className="product-title-22 line-clamp-2 text-ellipsis">
                {currentInfo?.attributes.product?.data?.attributes.headline}
              </div>
              <div className="R-home-content text-[--text-gray] line-clamp-2 text-ellipsis">
                {currentInfo?.attributes.product?.data?.attributes.subHeadline}
              </div>
            </Link>
          </div>
          <div
            className={`${
              currentInfo?.attributes.product.data &&
              currentInfo?.attributes.product.data?.attributes.tags.data.length > 0
                ? "flex"
                : "hidden"
            } space-x-3 flex-wrap`}
          >
            {currentInfo?.attributes.product?.data?.attributes.tags?.data.map((item: ITag, idx: number) => {
              return <CustomTag name={item.attributes.name} slug={`/tag/${item.attributes.slug}`} key={idx} />;
            })}
          </div>
        </div>
        <div className="flex space-x-[11px] flex-wrap items-stretch">
          {!currentInfo?.attributes.product?.voted && (
            <CustomButton
              className="space-x-2"
              label={
                <Fragment>
                  <div>{"Upvote"}</div>
                  <Image src={UpVote} alt="" />
                  <div>
                    {currentInfo?.attributes.product?.data?.attributes.votes
                      ? formatDataNumber(currentInfo?.attributes.product?.data?.attributes.votes as number, 0)
                      : 0}
                  </div>
                </Fragment>
              }
              onClick={disabled ? () => {} : handleVote}
            />
          )}
          <Link href={`/brands-products/${currentInfo?.attributes.product?.data?.attributes.slug}`}>
            <CustomButton label={<div className="whitespace-nowrap">Visit Product Page</div>} type="normal" />
          </Link>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleVolumeChange = (e: any) => {
      if (e.target.volume === 0 || e.target.muted) {
        dispatch(setMutedVideo(true));
      } else {
        dispatch(setMutedVideo(false));
      }
    };

    if (videoRef.current) {
      const video = videoRef.current;
      video.addEventListener("volumechange", handleVolumeChange);
    }

    return () =>
      // eslint-disable-next-line react-hooks/exhaustive-deps
      videoRef.current?.removeEventListener("volumechange", handleVolumeChange);
  }, [videoRef.current?.volume, mutedVideo]);

  useEffect(() => {
    if (pagination.page === 1) return;

    handleGetPageInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  useEffect(() => {
    if (!ci) {
      handleGetPageInfo(1);
    } else {
      getOneClips(+ci, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  //
  useEffect(() => {
    if (pageInfo.length > 0) {
      if (currentIdx >= pageInfo.length && pagination.total > pageInfo.length) {
        setPagination({ ...pagination, page: pagination.page + 1 });
      } else setCurrentInfo(pageInfo[currentIdx]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, pagination.total]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const handleUpdateView = () => {
      apis
        .post("wl-clip-views", {
          data: {
            clip_id: currentInfo?.id,
            date: moment().format("YYYYMMDD"),
          },
        })
        .then((res) => {})
        .catch((err) => {
          devLog(err, "handleUpdateView");
        });
    };

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (currentInfo && currentInfo.id > 0) {
      timer = setTimeout(() => {
        handleUpdateView();
      }, 3000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInfo?.id]);

  useEffect(() => {
    document.title = "ET Wishlist | Clips";
    const swipeElement = document.getElementById("wlClipsWrapper");
    let startX: any, startY: any, endX, endY;
    const minSwipeDistance = 30;

    const handleTouchStart = (e: any) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: any) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      if (Math.abs(deltaY) > minSwipeDistance && Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY > 0) {
          if (currentIdx !== 0) {
            handleNextVideo(false);
            e.preventDefault();
          } else {
            showAlert("warning", "No more video!");
          }
        } else {
          if (!(pagination.page >= pagination.pageCount && currentIdx === pageInfo.length - 1)) {
            handleNextVideo(true);
          } else {
            showAlert("warning", "No more video!");
          }
        }
      }
    };

    const handleTouchMove = (e: any) => {
      e.preventDefault();
    };

    swipeElement && swipeElement.addEventListener("touchstart", handleTouchStart);

    swipeElement && swipeElement.addEventListener("touchmove", handleTouchMove);
    swipeElement && swipeElement.addEventListener("touchend", handleTouchEnd);
    return () => {
      swipeElement && swipeElement.removeEventListener("touchstart", handleTouchStart);

      swipeElement && swipeElement.removeEventListener("touchmove", handleTouchMove);
      swipeElement && swipeElement.removeEventListener("touchend", handleTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, pageInfo]);

  useEffect(() => {
    const listVideo = document.querySelectorAll(".videoSwipe");
    listVideo.forEach((_i: any) => {
      _i.pause();
    });
    const videoActive = document.querySelector(".activeVideo") as HTMLVideoElement | null;

    if (videoActive) {
      videoActive.currentTime = 0;
      videoActive.play().catch((error: any) => console.error(error));
    }
  }, [currentIdx, mediaQuery]);

  if (loading) return <LoadingScreen />;

  return (
    <section className="lg:et-container et-container-sm !flex-row">
      {pageInfo.length > 0 ? (
        <main className="overflow-visible box-border p-[16px] flex-1 min-w-0">
          <div className="fixed inset-0 z-40 w-screen md:relative md:z-10 md:mt-[36px] md:flex md:h-[calc(100vh-180px)] md:max-h-[900px] md:min-h-[300px] md:w-auto">
            {/*video*/}
            <div
              className="absolute flex h-full w-screen shrink-0 overflow-hidden bg-black md:relative md:aspect-[9/16] md:h-auto md:w-auto md:max-w-[504px] md:rounded-md"
              id="wlClipsWrapper"
            >
              {mediaQuery >= 769 ? (
                <div>
                  <video
                    className="absolute inset-0 h-full w-full"
                    playsInline
                    loop
                    ref={videoRef}
                    muted={mutedVideo}
                    autoPlay
                    controls
                    src={
                      currentInfo?.attributes.clip.data?.attributes.url
                        ? `${process.env.NEXT_PUBLIC_BE_URL}${currentInfo?.attributes.clip?.data.attributes.url}`
                        : ""
                    }
                  ></video>
                  {!currentInfo?.attributes.clip.data && (
                    <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center bg-black z-[31] space-x-4">
                      <Image src={VideoWarning} alt="" />
                      <div className="text-white font-bold">Video Unavailable</div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {pageInfo.map((_i, idx: number) => {
                    return (
                      <div
                        key={idx}
                        className={`el-carousel__item is-animating max-w-[1060px] flex min-h-[360px] items-center justify-center`}
                        style={{
                          transform: `translateY(${(idx - currentIdx) * 100}%) scale(1)`,
                        }}
                      >
                        <video
                          className={`absolute inset-0 h-full w-full object-cover videoSwipe ${
                            idx === currentIdx ? "activeVideo" : ""
                          }`}
                          playsInline
                          loop
                          muted={mutedVideo}
                          controls
                          autoPlay
                          src={
                            _i?.attributes.clip.data?.attributes.url
                              ? `${process.env.NEXT_PUBLIC_BE_URL}${_i?.attributes.clip?.data.attributes.url}`
                              : ""
                          }
                        ></video>
                        {!_i?.attributes.clip.data && (
                          <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center bg-black z-[31] space-x-4">
                            <Image src={VideoWarning} alt="" />
                            <div className="text-white font-bold">Video Unavailable</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div className="absolute inset-x-0 bottom-[65px] z-10 m-0 w-full grow flex-col justify-center break-normal md:static md:z-auto md:ml-[106px] md:flex md:max-w-[370px] md:p-0">
                    <div className="">
                      <div className="max-md:max-w-[80%] max-md:rounded-r-2xl max-md:bg-black/30 max-md:p-2.5 max-md:pl-6">
                        {/* <a
                        href="/product-clips/sockdock-sock-laundry-system"
                        className="flex items-center font-bold leading-tight md:pr-0 text-sm text-white md:text-slate-1150"
                      >
                        <Image
                          src="https://placehold.co/600x400?text=SockDock"
                          alt="brand"
                          width="28"
                          height="28"
                          className="mr-2 h-7 w-7 rounded-full object-cover md:hidden"
                        />
                        <span
                          title="SockDock Sock Laundry System"
                          className="product-title"
                        >
                          SockDock Sock Laundry System
                        </span>
                      </a> */}
                        <div className="flex justify-start items-center">
                          <Link
                            href={
                              currentInfo?.attributes.product
                                ? `/product-clips/${currentInfo?.attributes.product?.data?.attributes.slug}`
                                : "/"
                            }
                            className="flex items-center font-bold leading-tight md:pr-0 text-sm text-white md:text-slate-1150"
                          >
                            <Image
                              src={
                                currentInfo?.attributes.brand && currentInfo?.attributes.brand?.logo
                                  ? `${process.env.NEXT_PUBLIC_BE_URL}${currentInfo.attributes.brand.logo.url}`
                                  : DefaultThumbnail
                              }
                              alt="brand"
                              width={0}
                              height={0}
                              className="mr-2 h-7 w-7 rounded-full object-cover md:hidden"
                              sizes="100vw"
                            />
                          </Link>
                          <Link
                            className="R-home-content font-bold leading-tight md:pr-0 text-sm text-white md:text-slate-1150"
                            href={`/brands-products/${currentInfo?.attributes.product?.data?.attributes.slug}`}
                          >
                            {currentInfo?.attributes.product?.data?.attributes.name}
                          </Link>
                        </div>

                        <h1
                          className="product-headline two-rows mt-2 leading-normal md:mt-2.5 md:pr-0 md:text-22 md:text-black text-sm text-white md: md:font-semibold md:leading-tight"
                          title={currentInfo?.attributes.product?.data?.attributes.headline}
                        >
                          {currentInfo?.attributes.product?.data?.attributes.headline}
                        </h1>
                      </div>
                      <div className="mx-[26px] mt-2.5 flex items-center md:mx-0 md:mt-6">
                        {currentInfo?.attributes.product?.voted ? (
                          <Link
                            href={`/brands-products/${currentInfo?.attributes.product?.data?.attributes.slug}`}
                            className="flex h-10 font-[RobotoBold] w-full items-center justify-center whitespace-nowrap rounded-md bg-[--brand-primary] hover:bg-[--brand-primary-hover] active:bg-[--brand-primary-pressed] px-1 text-base font-semibold text-white md:hidden"
                          >
                            Get Discount Code
                          </Link>
                        ) : (
                          <Link
                            href={`/brands-products/${currentInfo?.attributes.product?.data?.attributes.slug}`}
                            className="flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-[--brand-primary] hover:bg-[--brand-primary-hover] active:bg-[--brand-primary-pressed] px-1 text-base font-semibold text-white md:hidden"
                          >
                            Visit Product Page
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute right-2.5 top-3.5 hidden md:block">
                <Image
                  src={mutedVideo ? MuteOn : MuteOff}
                  alt=""
                  width="22"
                  height="22"
                  className="w-[22px] drop-shadow-mute cursor-pointer"
                  onClick={handleActionMuteInMobile}
                />
              </div>
            </div>
            {/*dieu huonng*/}
            <div className="absolute bottom-[137px] right-[4.5%] z-20 flex flex-col justify-end md:relative md:right-0 md:top-0 md:my-auto ml-[16px] lg:ml-[30px] md:h-full md:max-h-[534px] md:justify-between">
              {currentIdx !== 0 ? (
                <div
                  className="hidden h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full bg-gray-2250 md:flex select-none"
                  onClick={() => handleNextVideo(false)}
                >
                  <Image src={ArrowUp} alt="" width={20} height={12} />
                </div>
              ) : (
                <div className="hidden h-[50px] w-[50px] items-center justify-center rounded-full md:flex"></div>
              )}
              <div>
                <Link
                  href={
                    currentInfo?.attributes.product
                      ? `/product-clips/${currentInfo?.attributes.product?.data?.attributes.slug}`
                      : "/"
                  }
                  className="hidden md:block"
                >
                  <div className="mb-5 h-[50px] w-[50px] cursor-pointer overflow-hidden rounded-full shadow-brandLogo select-none">
                    <Image
                      src={
                        currentInfo?.attributes.brand && currentInfo?.attributes.brand?.logo
                          ? `${process.env.NEXT_PUBLIC_BE_URL}${currentInfo.attributes.brand.logo.url}`
                          : DefaultThumbnail
                      }
                      alt=""
                      width={28}
                      height={28}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Link>
                <div className="text-center text-xs font-semibold leading-none text-white md:hidden md:text-black">
                  <div className="group relative flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full bg-white/30">
                    {currentInfo?.attributes.product.voted ? (
                      <div className="icons-wrapper flex h-6 w-6 shrink-0 items-start justify-center overflow-hidden rounded-full bg-[--brand-primary] active:bg-[--brand-primary-pressed] py-[5px] scale-[2.1]">
                        <Image src={BgWhite} alt="vote" className="vote-icons -translate-y-[60px]" />
                      </div>
                    ) : (
                      <div
                        onClick={handleVote}
                        className="icons-wrapper flex h-6 w-6 shrink-0 items-start justify-center overflow-hidden rounded-full scale-1 transition-all duration-300"
                      >
                        <Image src={UpVote} alt="vote" className="vote-icons transition-transform duration-300" />
                      </div>
                    )}

                    {/* <div className="absolute -top-0.5 left-0.5">
                    {currentInfo?.attributes.product?.votes &&
                    !isNaN(currentInfo?.attributes.product?.votes)
                      ? formatDataNumber(
                          currentInfo?.attributes.product?.votes as number,
                          0
                        )
                      : 0}
                  </div> */}
                  </div>
                  <span className="mt-2.5 block">
                    {currentInfo?.attributes.product?.data?.attributes.votes &&
                    !isNaN(currentInfo?.attributes.product?.data?.attributes.votes)
                      ? formatDataNumber(currentInfo?.attributes.product?.data?.attributes.votes as number, 0)
                      : 0}
                  </span>
                </div>
                <div className="mt-5 text-center text-xs font-semibold leading-none text-white md:text-black">
                  <div
                    className={`relative flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full ${
                      currentInfo?.attributes.isLike ? "bg-red-1200" : "bg-white/30 md:bg-gray-2250"
                    } select-none`}
                    onClick={() => {
                      if (!token) {
                        dispatch(setOpenModalLogin(true));
                        showAlert("warning", "This feature need login to use!");
                      } else {
                        currentInfo?.attributes.isLike ? handleUnLike() : handleLike();
                      }
                    }}
                  >
                    <Image src={BeforeLike} alt="" className={currentInfo?.attributes.isLike ? "block" : "md:hidden"} />
                    <svg
                      width="20"
                      height="18"
                      viewBox="0 0 20 18"
                      fill="#8E9DAE"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`clips-heart absolute left-1/2 top-1/2 h-[17px] w-[19px] -translate-x-1/2 -translate-y-1/2 transform hidden ${
                        currentInfo?.attributes.isLike ? "hidden" : "md:block"
                      }`}
                      style={{
                        translate: "none",
                        rotate: "none",
                        scale: "none",
                        transform: "translate(-9.5px, -8.5px)",
                      }}
                    >
                      <path
                        d="M10.7778 17.2491C10.4595 17.3615 9.93511 17.3615 9.61676 17.2491C6.9014 16.3222 0.833984 12.4551 0.833984 5.90083C0.833984 3.00757 3.16545 0.666748 6.03998 0.666748C7.7441 0.666748 9.25159 2.42705 10.1973 3.70046C11.143 2.42705 12.6598 0.666748 14.3546 0.666748C17.2291 0.666748 19.5606 3.00757 19.5606 5.90083C19.5606 12.4551 13.4932 16.3222 10.7778 17.2491Z"
                        fill="[object Object]"
                      ></path>
                    </svg>
                    {/* <Image src={LikeMedium} alt="" className="hidden md:block" /> */}
                  </div>
                  <span className="mt-2.5 block select-none">
                    {currentInfo?.attributes.likes && !isNaN(currentInfo?.attributes.likes)
                      ? formatDataNumber(currentInfo?.attributes.likes as number, 0)
                      : 0}
                  </span>
                </div>
                <div className="mt-5 text-center text-xs font-semibold leading-none md:text-black">
                  <div
                    className="mb-2.5 flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full bg-white/30 md:bg-gray-2250"
                    onClick={() => setOpenShare(true)}
                  >
                    <Image src={mediaQuery >= 768 ? ShareDark : ShareCurationNoOutline} alt="" />
                  </div>
                </div>
              </div>
              {pagination.page >= pagination.pageCount && currentIdx === pageInfo.length - 1 ? (
                <div className="hidden h-[50px] w-[50px]  items-center justify-center rounded-full md:flex"></div>
              ) : (
                <div
                  className="hidden h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full bg-gray-2250 md:flex select-none"
                  onClick={() => handleNextVideo(true)}
                >
                  <Image src={ArrowUp} alt="" width={20} height={12} className="rotate-180" />
                </div>
              )}
            </div>
            {/*thong tin them*/}
            <div className="h-full w-full flex flex-col justify-center min-[852px]:pl-[73px] pl-[20px]">
              {currentInfo?.attributes.product.data
                ? currentInfo?.attributes.product && !isVoted
                  ? renderSectionBeforeVote()
                  : renderSectionAfterVote()
                : null}
            </div>
            {/*button back*/}
            <button className="absolute left-5 top-[50px] z-50 md:hidden" onClick={() => router.push("/")}>
              <Image
                src="https://d22lwxpnhu2n4a.cloudfront.net/grommet/Image/button-back-opaque.svg"
                alt="Back button"
                width="36"
                height="36"
              />
            </button>
            {/*button mute*/}
            <div className="absolute right-2.5 top-3.5 z-50 md:hidden">
              <Image
                src={mutedVideo ? MuteOn : MuteOff}
                alt=""
                width="22"
                height="22"
                className="w-[22px] drop-shadow-mute cursor-pointer"
                onClick={handleActionMuteInMobile}
              />
            </div>
          </div>
        </main>
      ) : (
        <div className="overflow-visible box-border p-[16px] flex-1 min-w-0 flex justify-center items-center mt-32">
          <p className="text-[20px] font-semibold underline decoration-solid">There are no clips to display! </p>
        </div>
      )}
      {openShare && (
        <Modal classNameContainer="w-[504px] !mt-[50px]" className="!p-0" onClose={() => setOpenShare(false)}>
          {renderSharePrd()}
        </Modal>
      )}
    </section>
  );
};

export default ClipPage;
