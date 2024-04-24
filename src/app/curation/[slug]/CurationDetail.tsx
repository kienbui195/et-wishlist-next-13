"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import apis from "@/apis";
import LoadingScreen from "@/components/LoadingScreen";
import NotFound from "@/components/NotFound";
import { ICuration, prdDetailState } from "@/components/PrdDetailCommon/prdDetailInterface";
import { useAlertContext } from "@/context/alertContext";
import useUserLogin from "@/hooks/useUserLogin";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { calculatePriceApplyDiscount, convertKeys, createQuery, formatDataNumber, getCurrencyCode, getYoutubeId } from "@/utils/function";
import { setOpenModalLogin } from "@/lib/features/authenticate/loginSlice";
import moment from "moment";
import YouTube from "react-youtube";
import { RootState } from "@/lib/store";
import {
  CheckIcon,
  CheckIconYellow,
  CloseIcon,
  ConsIcon,
  CurationBookmark,
  CurationBookmarked,
  CurationShare,
  DefaultAvatar,
  DefaultThumbnail,
  DefaultThumbnail2,
  ListIcon,
  ListIcon10,
  ListIcon2,
  ListIcon3,
  ListIcon4,
  ListIcon5,
  ListIcon6,
  ListIcon7,
  ListIcon8,
  ListIcon9,
  ProsIcon,
  VotedIcon,
} from "@/utils/svgExport";
import { VoteLandMobile } from "@/components/PrdDetailCommon";
import IconTextButton from "@/components/IconTextButton";
import IconButtonVoteAnimation from "@/components/IconButtonVoteAnimation";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Card1, Card2, Card3, Card4 } from "@/components/MediaCard";
import { IImage } from "@/data/wl-types";
import { WidthHeightRatio } from "@/components/MediaCard/Card1";
import { useParams, usePathname } from "next/navigation";
import Image from "next/image";
import Title from "./Title";
import ShareModal from "./ShareModal";
import CTAButton from "./CTAButton";
import InnerHtml from "./InnerHtml";
import CurationPrdGalleryModal from "./CurationPrdGalleryModal";
import SameCate from "./SameCate";
import CustomButton from "@/app/clips/CustomButton";

const Curation = ({ params }: { params: { slug: string } }) => {
  const isClient = useRef<boolean>(typeof window === "object");
  const pathname = usePathname()
  const { showAlert } = useAlertContext();
  const { token } = useUserLogin();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingBookmark, setLoadingBookmark] = useState<boolean>(false);
  const [loadingVote, setLoadingVote] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const closeGallery = useRef();
  const [windowSize, setWindowSize] = useState({
    width: isClient["current"] ? window.innerWidth : 0,
    height: isClient["current"] ? window.innerHeight : 0,
  });
  const initIImage = {
    id: 0,
    attributes: {
      name: "",
      url: "",
      width: 0,
      height: 0,
    },
  };
  const [prdDetail, setPrdDetail] = useState<prdDetailState>({
    voted: false,
    showPrdQT: "Features",
    showStory: false,
    showGallery: false,
    showSharePrd: false,
    selectedGlrImage: -1,
    discount: {
      title: "",
      summary: "",
      discount_code: "",
      discount_value: "",
      status: "ACTIVE",
      voteId: 0,
      votes: 0,
    },
  });
  const [curationGallery, setCurationGallery] = useState<IImage[]>([]);
  const [curation, setCuration] = useState<ICuration>({
    id: 0,
    attributes: {
      category: {
        data: {
          id: 0,
          attributes: {
            desc: "",
            name: "",
            slug: "",
          },
        },
      },
      cons: "",
      ctaButton: [],
      currency: "USD",
      discountType: "",
      discountValue: 0,
      faqs: [],
      features: "",
      featuresTitle: "",
      headline: "",
      hoverVideo: {
        data: initIImage,
      },
      images: {
        data: [],
      },
      inStock: -1,
      linkYoutube: "",
      longIntro: "",
      merchant: "",
      name: "",
      price: 0,
      pros: "",
      shares: 0,
      shortDesc: "",
      shortIntro: "",
      slug: "",
      tags: {
        data: [],
      },
      thumbnail: {
        data: initIImage,
      },
      videos: {
        data: [],
      },
      views: 0,
      votes: 0,
      wdwstp: "",
      wdwstpTitle: "",
      createdAt: new Date(),
      crawTime: new Date(),
      publishedAt: new Date(),
    },
    isBookmarked: false,
    isVoted: false,
  });
  const DEFAULT_MEDIA_WIDTH = 700;
  const [cardHeight, setCardHeight] = useState(DEFAULT_MEDIA_WIDTH);
  const innerWidth = useMediaQuery();
  const isWidthLargerThanHeight = useRef<WidthHeightRatio>();
  const [initIndex, setInitIndex] = useState(0);
  const DEFAULT_ICON = useRef([ListIcon, ListIcon2, ListIcon3, ListIcon4, ListIcon5, ListIcon6, ListIcon7, ListIcon10, ListIcon8, ListIcon9]);
  const listIcon = useRef([...DEFAULT_ICON.current]);

  const handleGetPageData = async () => {
    await apis
      .get(
        "wl-curations",
        createQuery({
          isDetail: true,
          filters: {
            slug: params.slug,
          },
          populate: {
            category: {
              fields: ["name", "slug", "desc"],
            },
            tags: {
              fields: ["name", "slug", "desc"],
            },
            thumbnail: {
              fields: ["name", "url"],
            },
            hover_video: {
              fields: ["name", "url"],
            },
            images: {
              fields: ["name", "url", "width", "height"],
            },
            videos: {
              fields: ["name", "url", "width", "height"],
            },
            cta_button: {
              populate: {
                icon: {
                  fields: ["name", "url"],
                },
              },
            },
            faqs: "*",
          },
        })
      )
      .then((res) => {
        const { data } = res.data;
        const [prod] = data;
        if (!prod) {
          showAlert("warning", "Product not found");
          return;
        }
        const curationData: ICuration = convertKeys(prod);
        setCuration({ ...curationData, isVoted: !!prod.status });

        setCurationGallery(curationData.attributes.images.data ? prod.attributes.images.data : []);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const companyInfo = useSelector((state: RootState) => state.companyDefault);

  const handleBookmark = (productId: number, type: "bookmark" | "unbookmark") => {
    if (!token) {
      dispatch(setOpenModalLogin(true));
      showAlert("warning", "This features require logging in to use");
    } else {
      setLoadingBookmark(true);
      apis
        .post(`wl-bookmarks/${type}`, {
          data: {
            product_id: productId,
          },
        })
        .then((res) => {
          showAlert("success", type === "bookmark" ? "Bookmarked!" : "UnBookmarked!");
          setLoadingBookmark(false);
          setCuration((preState) => {
            return {
              ...preState,
              isBookmarked: type === "bookmark",
            };
          });
        })
        .catch((err) => {
          console.log(err);
          setLoadingBookmark(false);
          showAlert("error", type === "bookmark" ? "Bookmarked failed! Please try again later!" : "UnBookmarked failed! Please try again later!");
        });
    }
  };

  const handleVote = () => {
    if (!token) {
      dispatch(setOpenModalLogin(true));
      showAlert("warning", "This features require logging in to use");
    } else {
      if (curation) {
        setLoadingVote(true);
        apis
          .upVoteCuration(curation.id)
          .then((res) => {
            setCuration((preState) => ({
              ...preState,
              attributes: {
                ...preState.attributes,
                votes: res.data.votes,
              },
              isVoted: true,
            }));
            showAlert("success", "Vote successfully");
          })
          .catch((err) => {
            console.log(err);
            showAlert("error", "Something went wrong! Please try again later");
          })
          .finally(() => {
            setLoadingVote(false);
          });
      }
    }
  };

  const handleUpdateView = () => {
    apis
      .post("wl-prod-views", {
        data: {
          product_id: curation.id,
          date: moment().format("YYYYMMDD"),
        },
      })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleGetPageData();
    const handleResize = (e: any) => {
      setWindowSize({
        width: e.target.innerWidth,
        height: e.target.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, token]);

  useEffect(() => {
    if (curation.id > 0) {
      handleUpdateView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curation.id]);

  useEffect(() => {
    const hiddenOurStory = () => {
      document.body.classList.remove("overflow-hidden");
      setPrdDetail({ ...prdDetail, showStory: !prdDetail.showStory });
    };
    const hiddenGaleryModal = () => {
      document.body.classList.remove("overflow-hidden");
      setPrdDetail({
        ...prdDetail,
        showGallery: !prdDetail.showGallery,
        selectedGlrImage: -1,
      });
    };
    const handleKeyDown = (e: any) => {
      if (prdDetail.showStory && e.keyCode === 27) {
        hiddenOurStory();
      }
      if (prdDetail.showGallery && e.keyCode === 27) {
        hiddenGaleryModal();
      }
    };
    document.getElementById("ourstoryModal") &&
      (document.getElementById("ourstoryModal")!.onclick = function (e) {
        if (prdDetail.showStory) {
          if (e.target === document.querySelector("#ourstoryModal > div")) {
            hiddenOurStory();
          }
        }
      });

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [prdDetail.showStory, prdDetail.showGallery, prdDetail.showSharePrd, prdDetail]);

  const handleShowPrice = () => {
    const currencySymbol = getCurrencyCode(curation.attributes.currency ? curation.attributes.currency : "USD");

    return curation.attributes.discountValue ? (
      <div className="flex space-x-2 items-end">
        <div className="text-red-600 font-bold text-[44px]">
          {currencySymbol}
          <span>
            {formatDataNumber(calculatePriceApplyDiscount(curation.attributes.price, curation.attributes.discountValue, curation.attributes.discountType), 2)}
          </span>
        </div>
        {curation.attributes.discountValue && (
          <div className="text-muted text-[#777] font-medium text-[28px] line-through leading-none">
            {currencySymbol}
            {formatDataNumber(curation.attributes.price, 2)}
          </div>
        )}
      </div>
    ) : (
      <div className="text-red-600 font-bold text-[42px]">
        {currencySymbol}
        {curation.attributes.price}
      </div>
    );
  };

  useEffect(() => {
    if (curationGallery.length > 0) {
      const width = curationGallery[0].attributes.width;
      const height = curationGallery[0].attributes.height;

      if (width > height) {
        isWidthLargerThanHeight["current"] = "larger";
      }
      if (width < height) {
        isWidthLargerThanHeight["current"] = "smaller";
      }
      if (width === height) {
        isWidthLargerThanHeight["current"] = "equal";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curationGallery]);

  useEffect(() => {
    const calculateSizeVideoWrapper = () => {
      const windowHeight = window.innerHeight;
      let ImageHeight = windowHeight - 326;

      if (windowHeight <= 768) {
        ImageHeight = DEFAULT_MEDIA_WIDTH * 0.75;
      }
      if (windowHeight > 768 && windowHeight <= 900) {
        ImageHeight = DEFAULT_MEDIA_WIDTH * 0.9;
      }
      if (windowHeight > 900 && windowHeight <= 1060) {
        ImageHeight = DEFAULT_MEDIA_WIDTH;
      }
      if (windowHeight < 1230 && windowHeight > 1060) {
        ImageHeight = DEFAULT_MEDIA_WIDTH * 1.1;
      }
      if (windowHeight >= 1230) {
        ImageHeight = DEFAULT_MEDIA_WIDTH * 1.2;
      }

      setCardHeight(innerWidth < 631 ? innerWidth : ImageHeight);
    };

    window.addEventListener("resize", calculateSizeVideoWrapper);
    calculateSizeVideoWrapper();

    return () => {
      window.removeEventListener("resize", calculateSizeVideoWrapper);
    };
  }, [innerWidth]);

  useEffect(() => {
    if (curation.id !== 0) {
      document.title = curation.attributes.headline;
    }
  }, [curation]);

  if (loading) return <LoadingScreen />;

  if (!loading && curation.id === 0) {
    return (
      <div className="w-full mainContent">
        <NotFound />
      </div>
    );
  }

  return (
    <div className="w-full px-4 lg:px-0 mainContent">
      <div className="intro-hook flex flex-col space-y-4 mt-8">
        <Title className="capitalize font-black" title={curation.attributes.headline} />
        <div className="flex space-x-4 min-[480px]:flex-row flex-col ">
          <div className="flex space-x-4 items-center">
            <div className="w-6 h-6">
              <Image
                alt=""
                className="w-6 h-6 rounded"
                src={companyInfo.logo?.data ? `${process.env.NEXT_PUBLIC_BE_URL}${companyInfo.logo.data?.attributes.url}` : DefaultAvatar}
                width={0}
                height={0}
                sizes="100vw"
              />
            </div>
            <span>by</span>
            <div className="font-bold uppercase">{companyInfo.name}</div>
            <Link className="font-bold text-gray-500" href={`/?category=${curation.attributes.category.data?.attributes.slug}`}>
              {curation.attributes.category.data?.attributes.name}
            </Link>
          </div>
          <div className="h-14 grow items-center justify-end self-end flex space-x-3">
            <IconTextButton
              className="text-menu-15 text-[--gray-text]"
              startIcon={<Image src={CurationShare} alt="" width={"24"} height={"24"} />}
              label="Share"
              onClick={() => {
                document.body.classList.add("overflow-hidden");
                setShowShareModal((prev) => !prev);
              }}
              whenHiddenLabel="none"
            />
            <div
              className="cursor-pointer md:flex hidden"
              onClick={
                !loadingBookmark && curation
                  ? !curation.isBookmarked
                    ? () => handleBookmark(curation.id, "bookmark")
                    : () => handleBookmark(curation.id, "unbookmark")
                  : () => {}
              }
            >
              <Image className="h-7 w-7" src={curation.isBookmarked ? CurationBookmarked : CurationBookmark} alt="" />
            </div>
            <CustomButton
              className={`!h-[42px] group space-x-2 sm:p-[16px_22px] p-[16px_8px] md:flex hidden`}
              disabled={loadingVote}
              type={curation.isVoted ? "normal" : "primary"}
              label={
                <React.Fragment>
                  <div className="md:flex hidden whitespace-nowrap">{curation.isVoted ? "Buy Now" : "Upvote"}</div>
                  <div className="w-6 h-6">{curation.isVoted ? <Image src={VotedIcon} alt="" /> : <IconButtonVoteAnimation />}</div>
                  <div>{curation.attributes.votes ? formatDataNumber(curation.attributes.votes, 0) : 0}</div>
                </React.Fragment>
              }
              onClick={!loadingVote ? (!curation.isVoted ? handleVote : () => window.open(curation.attributes.ctaButton[0]?.link, "_blank")) : () => {}}
            />
          </div>
        </div>
        <div className="bg-white">
          {curationGallery.length > 0 ? (
            curationGallery.length < 3 ? (
              <Card1
                showProdGallery={prdDetail.showGallery}
                media={curationGallery}
                cardHeight={
                  curationGallery.length === 1
                    ? curationGallery[0].attributes.height < cardHeight
                      ? curationGallery[0].attributes.height
                      : cardHeight
                    : cardHeight
                }
                setShowPrdGallery={() => {
                  document.body.classList.add("overflow-hidden");
                  setPrdDetail({ ...prdDetail, showGallery: true });
                }}
                isWidthLargerThanHeight={isWidthLargerThanHeight.current}
                onClick={(url) => {
                  const index = curationGallery.findIndex((item) => item.attributes.url === url);
                  setInitIndex(index);
                }}
                defaultMediaWidth={cardHeight}
              />
            ) : curationGallery.length < 4 ? (
              <Card2
                showProdGallery={prdDetail.showGallery}
                media={curationGallery}
                cardHeight={cardHeight}
                setShowPrdGallery={() => {
                  document.body.classList.add("overflow-hidden");
                  setPrdDetail({ ...prdDetail, showGallery: true });
                }}
                isWidthLargerThanHeight={isWidthLargerThanHeight.current}
                onClick={(url) => {
                  const index = curationGallery.findIndex((item) => item.attributes.url === url);
                  setInitIndex(index);
                }}
              />
            ) : curationGallery.length < 5 ? (
              <Card3
                showProdGallery={prdDetail.showGallery}
                media={curationGallery}
                cardHeight={cardHeight}
                setShowPrdGallery={() => {
                  document.body.classList.add("overflow-hidden");
                  setPrdDetail({ ...prdDetail, showGallery: true });
                }}
                isWidthLargerThanHeight={isWidthLargerThanHeight.current}
                onClick={(url) => {
                  const index = curationGallery.findIndex((item) => item.attributes.url === url);
                  setInitIndex(index);
                }}
              />
            ) : (
              <Card4
                showProdGallery={prdDetail.showGallery}
                media={curationGallery}
                cardHeight={cardHeight}
                setShowPrdGallery={() => {
                  document.body.classList.add("overflow-hidden");
                  setPrdDetail({ ...prdDetail, showGallery: true });
                }}
                isWidthLargerThanHeight={isWidthLargerThanHeight.current}
                onClick={(url) => {
                  const index = curationGallery.findIndex((item) => item.attributes.url === url);
                  setInitIndex(index);
                }}
              />
            )
          ) : (
            <div className="bg-gray-100">
              <Image
                alt=""
                className="object-contain w-full"
                src={DefaultThumbnail}
                style={{
                  maxHeight: `${cardHeight}px`,
                  height: `${cardHeight}px`,
                }}
                loading="lazy"
              />
            </div>
          )}
        </div>
        <InnerHtml
          className="short-intro bg-blue-200 rounded-sm p-3 text-[24px] border-blue-500 text-blue-500 font-bold italic space-y-2"
          text={curation.attributes.shortIntro}
        />
        <InnerHtml className="long-intro space-y-2" text={curation.attributes.longIntro} />
      </div>
      <div className="short-desc flex flex-col space-y-6 mt-8">
        <Title className="capitalize font-extrabold" title={curation.attributes.name} />
        <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-8">
          <div className="w-full h-auto flex-1">
            <Image
              alt=""
              className="w-full h-auto object-cover"
              src={`${process.env.NEXT_PUBLIC_BE_URL}${
                curation.attributes.images.data ? curation.attributes.images.data[0]?.attributes.url : DefaultThumbnail2
              }`}
              width={0}
              height={0}
              sizes="100vw"
            />
          </div>
          <div className="flex flex-col flex-1 space-y-6 mt-8">
            <div className="flex items-start flex-col gap-2 leading-10">
              {handleShowPrice()}
              {curation.attributes.inStock > 0 && <div className="bg-yellow-300 text-green-500 px-3 py-1 text-[16px] leading-none rounded">in stock</div>}
            </div>
            {curation.attributes.ctaButton[0] && <CTAButton ctaButton={curation.attributes.ctaButton[0]} className="max-w-full sm:max-w-[350px]" />}
            <div>{curation.attributes.merchant}</div>
            <div className="text-link-16 italic">
              as of {moment(curation.attributes.crawTime || curation.attributes.publishedAt).format("MMMM DD, YYYY h:mm a")}
            </div>
          </div>
        </div>
        <InnerHtml className="short-desc space-y-2" text={curation.attributes.shortDesc} />
        <div className="feature flex flex-col space-y-4">
          {curation.attributes.featuresTitle && curation.attributes.featuresTitle.trim().length > 0 && (
            <Title className="bg-yellow-500 capitalize px-5 py-2 rounded-lg" title={curation.attributes.featuresTitle} />
          )}
          {curation.attributes.features?.split("\n").map((_i, idx) => (
            <div key={idx} className="flex space-x-4 items-center">
              <Image className="w-6 h-6" src={CheckIconYellow} alt="" />
              <InnerHtml className="text-[16px] space-y-2" text={_i} />
            </div>
          ))}
        </div>
      </div>
      <div className="pros-cons mt-8">
        <div className="flex flex-col sm:flex-row space-y-8 sm:space-y-0 space-x-0 sm:space-x-8">
          {curation.attributes.pros && curation.attributes.pros.trim().length > 0 && (
            <div className="w-full sm:w-1/2 p-5 flex flex-col space-y-8 shadow-lg rounded-lg">
              <Title
                title={
                  <div className="flex space-x-4 items-center">
                    <Image alt="" className="w-12 h-12" src={ProsIcon} />
                    <span>Pros</span>
                  </div>
                }
              />
              <div className="flex flex-col space-y-4">
                {curation.attributes.pros?.split("\n").map((_i, idx) => (
                  <div key={idx} className="flex space-x-4 items-center">
                    <Image alt="" src={CheckIcon} className="w-6 h-6" />
                    <InnerHtml className="text-[16px] space-y-2" text={_i} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {curation.attributes.cons && curation.attributes.cons.trim().length > 0 && (
            <div className="w-full sm:w-1/2 p-5 flex flex-col space-y-8 shadow-lg rounded-lg">
              <Title
                title={
                  <div className="flex space-x-4 items-center">
                    <Image alt="" className="w-12 h-12" src={ConsIcon} />
                    <span>Cons</span>
                  </div>
                }
              />
              <div className="flex flex-col space-y-4">
                {curation.attributes.cons?.split("\n").map((_i, idx) => (
                  <div key={idx} className="flex space-x-4 items-center">
                    <Image alt="" src={CloseIcon} className="w-6 h-6" />
                    <InnerHtml className="text-[16px] space-y-2" text={_i} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {curation.attributes.linkYoutube && (
          <div className="mt-8">
            <Title title={"Video Review"} />
            <YouTube
              className="mt-4 rounded-sm"
              videoId={getYoutubeId(curation.attributes.linkYoutube?.split("\n")[0])}
              iframeClassName="w-full sm:h-[600px] h-[300px]"
            />
          </div>
        )}
      </div>
      <div className="mt-8 flex flex-col space-y-4">
        {curation.attributes.wdwstp && <Title title={curation.attributes.wdwstpTitle} />}
        {curation.attributes.wdwstp?.split("\n").map((_i, idx) => {
          if (listIcon.current.length < 1) {
            listIcon["current"] = [...DEFAULT_ICON.current];
          }
          const randomIndex = Math.floor(Math.random() * (listIcon["current"].length - 1));
          let chooseIcon = listIcon["current"][randomIndex];
          listIcon["current"].splice(randomIndex, 1);
          return (
            <div key={idx} className="flex space-x-4 items-center">
              <Image alt="" src={chooseIcon} className="w-8 h-8" />
              <InnerHtml className="text-[16px]" text={_i} />
            </div>
          );
        })}
      </div>
      {curation.attributes.ctaButton[1] && <CTAButton ctaButton={curation.attributes.ctaButton[1]} className="mt-8" />}
      <div className="faq flex flex-col space-y-4 mt-8">
        {curation.attributes.faqs?.map((faq, idx) => (
          <Fragment key={idx}>
            <Title title={faq.question} />
            <InnerHtml className="space-y-2" text={faq.answer} />
          </Fragment>
        ))}
      </div>
      {curation.attributes.ctaButton[2] && curation.attributes.faqs.length > 0 && <CTAButton ctaButton={curation.attributes.ctaButton[2]} className="mt-8" />}
      <SameCate curation={curation} />
      {showShareModal && (
        <ShareModal
          curation={curation}
          onClose={() => {
            document.body.classList.remove("overflow-hidden");
            setShowShareModal((prev) => !prev);
          }}
          onShare={(val) => {
            setCuration((prev) => ({
              ...prev,
              attributes: {
                ...prev.attributes,
                shares: val,
              },
            }));
          }}
        />
      )}
      {!showShareModal && (
        <VoteLandMobile
          prodLink={curation.attributes.ctaButton[0]?.link}
          prodPrice={curation.attributes.price}
          isVoted={curation.isVoted}
          prodCurrency={curation.attributes.currency ? curation.attributes.currency : "USD"}
          votes={curation.attributes.votes}
          isBookmark={curation.isBookmarked}
          prodName={curation.attributes.name}
          handleVote={handleVote}
          handleBookmark={() => handleBookmark(curation.id, "bookmark")}
          handleUnBookmarked={() => handleBookmark(curation.id, "unbookmark")}
          priceSale={calculatePriceApplyDiscount(curation.attributes.price, curation.attributes.discountValue, curation.attributes.discountType)}
        />
      )}
      {prdDetail.showGallery && (
        <CurationPrdGalleryModal
          product={curation}
          setPrdDetail={setPrdDetail}
          prdDetail={prdDetail}
          closeGallery={closeGallery}
          windowSize={windowSize}
          initSlideIndex={initIndex}
        />
      )}
    </div>
  );
};

export default Curation;
