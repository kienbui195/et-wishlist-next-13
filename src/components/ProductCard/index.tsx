import React, { useState } from "react";
import Link from "next/link";
import { IImage, IProductTags, IVideo, TAward } from "@/data/wl-types";
import { useDispatch } from "react-redux";
import { setOpenModalLogin } from "@/lib/features/authenticate/loginSlice";
import { CloseGalleryButton, DefaultThumbnail, UnVotedIcon, VotedIcon, VoteIcon } from "@/utils/svgExport";
import { useAlertContext } from "@/context/alertContext";
import apis from "@/apis";
import AwardItem from "../Award/AwardItem";
import Image from "next/image";
import { formatDataNumber } from "@/utils/function";

interface IProductCardProps {
  id: number;
  name: string;
  slug: string;
  headline: string;
  subHeadline: string;
  thumbnail?: IImage;
  hoverVideo?: IVideo;
  discountType?: number;
  launcherDate?: Date;
  launchType?: number;
  launchStatus?: number;
  tags?: IProductTags[];
  voted?: boolean;
  award?: TAward[];
  dateVoted?: string;
  countVoted?: number;
  navigate?: () => void;
  spPrdId?: number;
}

interface StateProductCard {
  vote: boolean;
  clearContent: boolean;
}

function ProductCard({
  id,
  name,
  headline = "",
  subHeadline = "",
  thumbnail,
  hoverVideo,
  tags = [],
  voted = false,
  award = [],
  dateVoted,
  countVoted = 0,
  spPrdId,
  slug,
}: IProductCardProps) {
  const [productCard, setProductCard] = useState<StateProductCard>({
    vote: false,
    clearContent: false,
  });
  const [discount, setDiscount] = useState("");
  const dispatch = useDispatch();
  const { showAlert } = useAlertContext();
  const [open, setOpen] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const handleVoteAction = () => {
    const token = localStorage.getItem("ETWL") && JSON.parse(localStorage.getItem("ETWL") as string)?.token;
    if (!token) {
      dispatch(setOpenModalLogin(true));
      showAlert("warning", "This features require logging in to use");
    } else {
      setDisabled(true);
      apis
        .upVote(id, spPrdId + "")
        .then((res) => {
          showAlert("success", "Vote successfully");
          setDiscount(res.data.discountCode.summary);
          setProductCard((preState) => ({
            ...preState,
            vote: true,
          }));
          setDisabled(false);
        })
        .catch((err) => {
          console.log(err);
          setDisabled(false);
          showAlert("error", "Something went wrong! Please try again later");
        });
    }
  };

  const handleClearContent = () => {
    setProductCard((preState) => ({
      ...preState,
      clearContent: true,
    }));
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(() => {
      setOpen(false);
    }, 2000);
  };

  const renderAward = (awards: TAward[]) => {
    return (
      <React.Fragment>
        {awards.map((item, idx) => (
          <AwardItem type={item} key={idx} />
        ))}
      </React.Fragment>
    );
  };

  const renderVoteAction = () => {
    if (voted) {
      if (dateVoted) {
        return (
          <div className="group/unvote ml-auto flex h-[110px] shrink-0 flex-col items-center border-l-[1px] border-[--gray-line] md:mt-[25px] md:w-[130px] md:p-0 w-24">
            <Image src={VotedIcon} width="24" height="24" className="mt-2 group-hover/unvote:hidden" alt="" />
            <Image src={UnVotedIcon} width="24" height="24" className="mt-2 hidden group-hover/unvote:block h-[26px] w-[26px]" alt="" />
            <div className="text-base font-bold leading-none text-slate-1150 md:text-xl md:leading-none mt-[8px]">{countVoted}</div>
            <div className="font-medium leading-none text-slate-1150 text-xs mt-[21px] group-hover/unvote:hidden"> Voted!</div>
            <div className="mt-[24px] hidden text-xs font-medium leading-none text-slate-1150 group-hover/unvote:block"> Unvote </div>
          </div>
        );
      } else {
        return (
          <div className="ml-auto h-[110px] shrink-0 border-l-[1px] border-[--gray-line] md:mt-[25px] md:w-[130px] w-24">
            <Link href={slug} className="flex flex-col items-center">
              <Image src={VotedIcon} width="26" height="26" className="mt-2" alt="" />

              <div className="text-title-18 mt-[8px]">{countVoted}</div>
              <div className="leading-[10px] text-[--gray-text] text-[10px] mt-[24px]"> Voted!</div>
            </Link>
          </div>
        );
      }
    } else {
      return (
        <div
          className="ml-auto flex h-[104px] w-24 shrink-0 md:h-40 md:w-[130px] overflow-hidden justify-center"
          onClick={!disabled ? handleVoteAction : () => {}}
        >
          <div className="mt-4 h-[72px] shrink-0 md:mr-0 md:mt-[25px] md:h-[110px] bg-[--gray-line] w-[1px]"></div>
          <div className="relative flex w-24 flex-col items-center justify-start pt-7 md:h-40 md:w-[130px] md:pt-[50px] transition-all duration-300 ease-in-out group-hover:pt-3 md:group-hover:pt-[30px]">
            <div className="flex h-[24px] w-[24px] shrink-0 scale-[0.77] items-start justify-center overflow-hidden rounded-full bg-[--brand-primary] py-[5px] md:scale-100 ">
              <Image src={VoteIcon} alt="vote" className="vote-icons transition-transform duration-300 group-hover:-translate-y-[29px]" />
            </div>
            <div className="tracking-none mt-3 text-base font-semibold leading-none text-slate-1150 md:mt-[15px] md:text-xl md:font-bold md:leading-none">
              {countVoted ? formatDataNumber(countVoted, 0) : 0}
            </div>
            <div className="invisible mt-3 text-10 font-medium leading-none text-slate-1150 transition-all duration-150 ease-in-out group-hover:visible md:mt-6 md:text-xs">
              Upvote
            </div>
            <div className="mt-2 text-base font-bold leading-none text-slate-1150 md:mt-[15px] md:text-xl hidden">Voted!</div>
            <div className="absolute left-[11px] top-3 md:left-[42px] md:top-9">
              <svg width="51" height="54" viewBox="0 0 51 54" fill="none" xmlns="http://www.w3.org/2000/svg" className="rays">
                <clipPath id="rays-550" transform="translate(13, 15)" className="rays-clip-path">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z"
                    fill="white"
                  ></path>
                </clipPath>
                <g clipPath="url(#rays-550)">
                  <path
                    d="M48.6724 0.292969C49.0629 -0.0976562 49.6961 -0.0976562 50.0866 0.292969C50.4772 0.683472 50.4772 1.31665 50.0866 1.70715L34.3137 17.48C33.9232 17.8705 33.29 17.8705 32.8995 17.48C32.509 17.0895 32.509 16.4563 32.8995 16.0658L48.6724 0.292969Z"
                    fill="#0A888D"
                  ></path>
                  <path
                    d="M22 2.37952C22 1.82727 22.4477 1.37952 23 1.37952C23.5523 1.37952 24 1.82727 24 2.37952V12.3795C24 12.9318 23.5523 13.3795 23 13.3795C22.4477 13.3795 22 12.9318 22 12.3795V2.37952Z"
                    fill="#0A888D"
                  ></path>
                  <path
                    d="M0 27.3795C0 27.9318 0.447693 28.3795 1 28.3795H8C8.55231 28.3795 9 27.9318 9 27.3795C9 26.8273 8.55231 26.3795 8 26.3795H1C0.447693 26.3795 0 26.8273 0 27.3795Z"
                    fill="#0A888D"
                  ></path>
                  <path
                    d="M8.39294 14.1868C8.00244 13.7961 8.00244 13.1631 8.39294 12.7725C8.78351 12.382 9.41663 12.382 9.80719 12.7725L13.1005 16.0659C13.491 16.4564 13.491 17.0896 13.1005 17.4801C12.71 17.8706 12.0768 17.8706 11.6863 17.4801L8.39294 14.1868Z"
                    fill="#0A888D"
                  ></path>
                  <path
                    d="M1.70709 6.08655C1.31659 6.47717 1.31659 7.11023 1.70709 7.50085L5.00049 10.7942C5.39099 11.1847 6.02417 11.1847 6.41467 10.7942C6.80518 10.4037 6.80518 9.77051 6.41467 9.38L3.12134 6.08655C2.73077 5.69604 2.09766 5.69604 1.70709 6.08655Z"
                    fill="#0A888D"
                  ></path>
                  <path
                    d="M22 42.3795C22 41.8273 22.4477 41.3795 23 41.3795C23.5523 41.3795 24 41.8273 24 42.3795V52.3795C24 52.9318 23.5523 53.3795 23 53.3795C22.4477 53.3795 22 52.9318 22 52.3795V42.3795Z"
                    fill="#0A888D"
                  ></path>
                  <path
                    d="M13.1005 37.2791C12.71 36.8884 12.0768 36.8884 11.6863 37.2791L2.54749 46.4178C2.15692 46.8083 2.15692 47.4415 2.54749 47.832C2.93799 48.2225 3.57117 48.2225 3.96167 47.832L13.1005 38.6932C13.491 38.3027 13.491 37.6696 13.1005 37.2791Z"
                    fill="#0A888D"
                  ></path>
                  <path
                    d="M38 28.3795C37.4477 28.3795 37 27.9318 37 27.3795C37 26.8273 37.4477 26.3795 38 26.3795H48C48.5523 26.3795 49 26.8273 49 27.3795C49 27.9318 48.5523 28.3795 48 28.3795H38Z"
                    fill="#0A888D"
                  ></path>
                  <path
                    d="M32.8995 37.2789C32.509 37.6696 32.509 38.3026 32.8995 38.6932L36.5218 42.3154C36.9123 42.7061 37.5455 42.7061 37.936 42.3154C38.3265 41.9249 38.3265 41.2917 37.936 40.9012L34.3137 37.2789C33.9232 36.8884 33.29 36.8884 32.8995 37.2789Z"
                    fill="#0A888D"
                  ></path>
                </g>
              </svg>
            </div>
          </div>
        </div>
      );
    }
  };

  const handleVote = () => {
    return productCard.vote ? (
      <div className="relative w-full min-w-0 overflow-hidden pr-5">
        <Link href={slug}>
          <div
            className="discount-content"
            style={{
              translate: "none",
              rotate: "none",
              scale: "none",
              transform: "translate(0px, 0px)",
            }}
          >
            <div className="flex justify-between">
              <span className="mt-[6px] flex items-center text-xs font-bold leading-none text-slate-1150 md:mt-[14px]"> Thanks For Voting! </span>
            </div>
            <div className="mt-[11px]  text-lg font-semibold leading-none text-slate-1150">You Earned: {discount}</div>
            <div className="mt-2.5 max-w-[500px] text-sm font-medium leading-[1.4] text-gray-2350">
              {" "}
              Enjoy this exclusive discount from{" "}
              <span title="Maison d' Haiti Garland Nightgown" className="break-word">
                {name}
              </span>{" "}
              as a thank you for boosting their exposure on Wishlist.
            </div>
            <div className="mb-1 flex flex-wrap">
              <div className="mr-2.5 mt-2.5">
                <Link href={slug}>
                  <button
                    type="button"
                    className="h-auto min-h-[32px] w-fit rounded-md bg-[--brand-primary] hover:!bg-[--brand-primary-hover] active:!bg-[--brand-primary-pressed] px-4 text-sm font-normal leading-4 text-white"
                  >
                    Get Discount Code
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </Link>
        <Image
          src={CloseGalleryButton}
          alt=""
          className="close-discount absolute right-5 top-5 h-[14px] w-[14px] cursor-pointer"
          style={{ top: "20px" }}
          onClick={handleClearContent}
        />
      </div>
    ) : (
      <>
        <div className="grow md:flex flex md:max-w-[363px] w-full md:flex-col md:justify-center md:py-1">
          <div className="flex flex-col space-y-[14px] justify-center">
            <Link href={slug}>
              <div className="flex justify-center flex-col">
                <div>
                  <div className="R-title-explan text-[--gray-text]">{name}</div>
                </div>
                <div>
                  <div className="product-headline text-title-18 text-[--gray-text] line-clamp-1 overflow-x-hidden text-ellipsis">{headline}</div>
                </div>
              </div>

              <div className="max-md:hidden R-body-box text-[#717171] line-clamp-2 text-ellipsis">{subHeadline}</div>
            </Link>
          </div>
          {award.length > 0 ? (
            <div className="flex items-center">{renderAward(award)}</div>
          ) : (
            <div className="flex-wrap hidden sm:flex md:space-x-[6px] mt-2.5">
              {tags.map((_i, idx) => {
                return (
                  <Link key={idx} data-v-42920170="" href={`/tag${_i.slug}`}>
                    <div
                      data-v-42920170=""
                      className="md:flex hidden min-h-[20px] items-center whitespace-normal px-[4px] py-[1px] md:min-h-[18px] bg-[--bg-hover] text-[--gray] hover:bg-[--gray-bg-tag] R-14-light"
                    >
                      {_i.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        {renderVoteAction()}
      </>
    );
  };

  const handleLinkVideo = String(hoverVideo).split("/");

  return productCard.clearContent ? (
    <div
      className={`mb-2.5  w-full lg:max-w-[664px] max-w-fit items-center justify-center slide-up-enter-active slide-up-enter-to transition-all duration-300 ${
        open ? "flex h-[160px]" : "hidden h-0"
      }`}
    >
      <span className="text-base font-normal tracking-wide text-gray-1400">
        {" "}
        You can view your past Votes in{" "}
        <Link href={"/my-votes"} className="underline">
          {" "}
          My Votes{" "}
        </Link>{" "}
        page.{" "}
      </span>
    </div>
  ) : (
    <div>
      <div
        className={`group relative flex  w-full min-w-[300px] lg:max-w-[700px] max-w-full rounded-[10px] p-0 lg:min-w-fit cursor-pointer border-[--gray-line] border-[1px] max-[768px]:border-transparent  hover:bg-[--gray-bg-hover] hover:shadow-[0_4px_4px_0_#0000000D] max-[768px]:hover:bg-white max-[768px]:hover:shadow-none`}
      >
        <Link href={slug}>
          <div className="group/imagesContent  flex items-center justify-center overflow-hidden  rounded-l-[10px]  rounded-r-[10px] mr-5 mt-4 h-[72px] w-[72px] shrink-0 cursor-pointer  md:mr-[30px] md:mt-0 md:h-[160px] md:w-[160px] md:rounded-r-none">
            {hoverVideo && (
              <video
                autoPlay
                muted
                className={`h-full w-full object-cover hidden group-hover/imagesContent:block  rounded-l-[10px]  rounded-r-[10px] md:rounded-r-none`}
                loop
                playsInline
              >
                <source src={`${process.env.NEXT_PUBLIC_API_URL}/loadClip/${handleLinkVideo[handleLinkVideo.length - 1]}`} type="video/mp4" />
              </video>
            )}
            <Image
              src={thumbnail ? `${process.env.NEXT_PUBLIC_BE_URL}${thumbnail}` : DefaultThumbnail}
              className={`h-full max-h-full w-full max-w-full object-cover ${
                hoverVideo ? "group-hover/imagesContent:hidden" : ""
              }  rounded-l-[10px]  rounded-r-[10px] md:rounded-r-none`}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
            />
          </div>
        </Link>
        {handleVote()}
        <canvas width="824" height="200" className="confetti-canvas pointer-events-none absolute left-0 top-0 h-full w-full"></canvas>
      </div>
    </div>
  );
}

export default ProductCard;
