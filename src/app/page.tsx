"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, Fragment, useRef } from "react";
import { convertKeys, createQuery, devLog } from "../utils/function";
import LoadingScreen from "../components/LoadingScreen";
import TopBanner, { ITopBannerComponent } from "@/components/TopBanner/TopBanner";
import { IDropdownItem1 } from "@/components/DropdownFilter";
import { ISidebarComponent } from "@/components/Sidebar";
import { IPagination } from "@/data/types";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { useAlertContext } from "@/context/alertContext";
import useInView from "@/hooks/useInView";
import useUserLogin from "@/hooks/useUserLogin";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import useScrollDirection from "@/hooks/useScrollDirection";
import apis from "@/apis";
import { setUser } from "@/lib/features/authenticate/userSlice";
import { setOpenModalLogin } from "@/lib/features/authenticate/loginSlice";
import CategoryFilter from "@/components/CategoryFilter";
import CurationTimeFilter from "@/components/CurationTimeFilter";
import TimeFilter from "@/components/TimeFilter";
import CurationSkeleton from "@/components/CurationSkeleton";
import ProductSkeleton from "@/components/ProductSkeleton";
import ProductCurationsCard from "@/components/ProductCurations/ProductCurationsCard";
import ProductCard from "@/components/ProductCard";
import { NotFoundProduct2 } from "@/components/NotFoundProduct";
import StickySidebar from "@/components/StickySidebar";

const HomePageCMS: React.FC = () => {
  const [listPage, setListPage] = useState<number[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const provider = useSearchParams().get("provider");
  const categorySlug = useSearchParams().get("category");
  const dispatch = useDispatch();
  const { showAlert } = useAlertContext();
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [switchingProduct, setSwitchingProduct] = useState<boolean>(false);
  const [topBanner, setTopBanner] = useState<ITopBannerComponent[]>([]);
  const [category, setCategory] = useState<IDropdownItem1 | null>(null);
  const [timeFilter, setTimeFilter] = useState<"newest" | "most_voted">("newest");
  const [sidebar, setSidebar] = useState<ISidebarComponent[]>([]);
  const [product, setProduct] = useState({
    list: [],
    loading: false,
  });
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageCount: 0,
    pageSize: 10,
    total: 0,
    hasNextPage: true,
  });
  const { isInView, ref } = useInView();
  // const [ ref, isInView ] = useInView()
  const { token } = useUserLogin();
  const mediaQueryWidth = useMediaQuery();
  const mainFilterRef = useRef<HTMLDivElement>(null);
  const categoryFilterRef = useRef<HTMLDivElement>(null);
  const [controlDisplayTimerFilter, setControlDisplayTimerFilter] = useState(false);
  const menuBarDisplay = useSelector((state: RootState) => state.menuBarDisplay.isShow);
  const { isScrollingDown } = useScrollDirection();

  const retrieveUser = () => {
    const idToken = searchParams.get("id_token");
    const accessToken = searchParams.get("access_token");
    apis
      .get(
        `auth/${provider}/callback`,
        createQuery({
          id_token: idToken,
          access_token: accessToken,
        })
      )
      .then((res) => {
        const { user, jwt } = res.data;
        localStorage.setItem(
          "ETWL",
          JSON.stringify({
            id: user.id,
            username: user.username,
            token: jwt,
          })
        );
        dispatch(setUser({ ...user, jwt }));
        router.push("/");
        showAlert("success", "Login Successfully");
        dispatch(setOpenModalLogin(false));
      })
      .catch((err) => {
        router.push("/");
        if (err?.response?.data?.error) {
          showAlert("warning", err?.response?.data?.error, 30000);
        } else {
          showAlert("error", "Login failed! Please try again!");
        }
      });
  };

  const retrieveUserLwpw = () => {
    const confirmationToken = searchParams.get("lwpw");
    const returnUser = searchParams.get("return_user");
    const error = searchParams.get("error");
    showAlert("success", "Please wait us verify your login");
    apis
      .get(
        `auth/login-without-password-confirm`,
        createQuery({
          lwpw: confirmationToken,
          return_user: returnUser,
          error,
        })
      )
      .then((res) => {
        const { user, jwt } = res.data;
        localStorage.setItem(
          "ETWL",
          JSON.stringify({
            id: user.id,
            username: user.username,
            token: jwt,
          })
        );
        dispatch(setUser({ ...user, jwt }));
        let timer: ReturnType<typeof setTimeout> | null = null;
        if (timer !== null) {
          clearTimeout(timer);
          timer = null;
        }
        timer = setTimeout(() => {
          router.push("/");
          showAlert("success", "Login Successfully");
        }, 2000);
      })
      .catch((err) => {
        let timer: ReturnType<typeof setTimeout> | null = null;
        if (timer !== null) {
          clearTimeout(timer);
          timer = null;
        }
        timer = setTimeout(() => {
          router.push("/");
          showAlert("error", "Login failed! Please try again!");
        }, 2000);
      });
  };

  const retrieveUserSSOET = () => {
    const code = searchParams.get("code");
    apis
      .post(`auth/login-with-the-epochtimes`, {
        code,
      })
      .then((res) => {
        const { user, jwt } = res.data;
        localStorage.setItem(
          "ETWL",
          JSON.stringify({
            id: user.id,
            username: user.username,
            token: jwt,
          })
        );
        dispatch(setUser({ ...user, jwt }));
        router.push("/");
        showAlert("success", "Login Successfully");
        dispatch(setOpenModalLogin(false));
      })
      .catch((err) => {
        router.push("/");
        if (err?.response?.data?.error) {
          showAlert("warning", err?.response?.data?.error, 30000);
        } else {
          showAlert("error", "Login failed! Please try again!");
        }
      });
  };

  const getProduct = (page?: number) => {
    if (page === 1) {
      setSwitchingProduct(true);
    }
    setProduct((preState) => ({ ...preState, loading: true }));
    apis
      .get(
        `wl-curations`,
        createQuery({
          populate: {
            // member: {
            //   fields: ['id'],
            // },
            thumbnail: {
              fields: ["name", "url"],
            },
            hover_video: {
              fields: ["name", "url"],
            },
            videos: {
              fields: ["name", "url", "width", "height"],
            },
            // prod_dtl: '*',
            category: {
              fields: ["name", "slug"],
            },
            tags: {
              fields: ["name", "slug"],
            },
            // values: {
            //   fields: ['name', 'slug'],
            // },
            // shop: {
            //   fields: ['shop_id'],
            // },
            // short_clips: {
            //   populate: {
            //     clip: {
            //       fields: ['name', 'url'],
            //     },
            //   },
            // },
            // our_story: {
            //   populate: {
            //     founder_image: {
            //       fields: ['name', 'url'],
            //     },
            //   },
            // },
            images: {
              fields: ["name", "url", "width", "height"],
            },
          },
          pagination: {
            page: page || pagination.page,
            pageSize: pagination.pageSize,
          },
          filters: {
            ...(categorySlug
              ? {
                  category: {
                    slug: categorySlug,
                  },
                }
              : {}),
            // product_type:
            //   pathname === '/'
            //     ? 'Single'
            //     : {
            //         $ne: 'Single',
            //       },
            // page_submitted: true,
            // page_approved: true,
          },
          sort:
            timeFilter === "most_voted"
              ? {
                  votes: "desc",
                  id: "desc",
                }
              : {
                  publishedAt: "desc",
                  id: "desc",
                },
        })
      )
      .then((res: any) => {
        const {
          data,
          meta: {
            pagination: { page, pageSize, total, pageCount },
          },
        } = res.data;
        const list = convertKeys(data);
        setProduct((preState) => ({
          ...preState,
          list: page === 1 ? list : preState.list.concat(list),
          loading: false,
        }));
        setPagination({
          ...pagination,
          page: page + 1,
          pageSize,
          total,
          pageCount,
          hasNextPage: page !== pageCount,
        });
        setIsLoading(false);
        setSwitchingProduct(false);
        listPage.findIndex((item) => item === page) === -1 && setListPage((preState) => [...preState, page]);
      })
      .catch((err) => {
        devLog(err, "HomePage");
        setProduct((preState) => ({ ...preState, loading: false }));
        setIsLoading(false);
        setSwitchingProduct(false);
      });
  };

  const handleGetPageInfo = () => {
    apis
      .get(
        `home-page`,
        createQuery({
          populate: {
            top_banner: {
              populate: {
                content: {
                  populate: {
                    image: {
                      fields: ["name", "url"],
                    },
                  },
                },
                options: "*",
              },
            },
            sidebar: {
              populate: {
                content: {
                  populate: {
                    image: {
                      fields: ["name", "url"],
                    },
                    tags: "*",
                  },
                },
                options: "*",
              },
            },
          },
        })
      )
      .then((res) => {
        const { attributes } = res.data.data;
        const { top_banner, sidebar } = attributes;
        setTopBanner(top_banner);
        setSidebar(sidebar);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const handleCheckAndControlDisplayFilter = () => {
    if (mainFilterRef.current && categoryFilterRef.current) {
      const mainRect = mainFilterRef.current.getBoundingClientRect();
      const categoryRect = categoryFilterRef.current.getBoundingClientRect();
      const timerRectDefault = mediaQueryWidth > 852 ? 267.17 : 72;

      if (timerRectDefault + 1 + categoryRect.width + (category ? 8 : 0) >= mainRect.width - (mediaQueryWidth > 768 && mediaQueryWidth < 1060 ? 32 : 0)) {
        setControlDisplayTimerFilter(true);
      } else {
        setControlDisplayTimerFilter(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleCheckAndControlDisplayFilter);
    handleCheckAndControlDisplayFilter();
    return () => window.removeEventListener("resize", handleCheckAndControlDisplayFilter);
  }, []);

  useEffect(() => {
    getProduct(1);
    handleCheckAndControlDisplayFilter();
  }, [token, pathname, timeFilter]);

  useEffect(() => {
    if (provider) {
      retrieveUser();
    }
  }, [provider]);

  useEffect(() => {
    document.title = `ET Wishlist | ${pathname === "/" ? "Home" : "Brands"}`;
    if (pathname === "/reset-password") {
      dispatch(setOpenModalLogin(true));
    }
    if (pathname === "/confirm-email") {
      dispatch(setOpenModalLogin(true));
    }
    if (pathname === "/login-without-password") {
      retrieveUserLwpw();
    }
    if (pathname === "/") {
      setCategory(null);
      localStorage.setItem("PROD_TYPE", "Single");
    }
    if (pathname === "/brands") {
      setCategory(null);
      localStorage.setItem("PROD_TYPE", "Merchant");
    }
  }, [pathname]);

  useEffect(() => {
    const state = searchParams.get("state");
    if (state === "sso-theepochtimes") {
      retrieveUserSSOET();
    }
  }, []);

  useEffect(() => {
    handleGetPageInfo();
  }, []);

  useEffect(() => {
    if (isInView) {
      getProduct();
    }
  }, [isInView]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div>
      <div className={`lg:et-container et-container-sm !p-0 w-full`}>
        <TopBanner value={topBanner} />
      </div>
      <div className={`bg-white ${pathname === "/" ? "lg:et-container et-container-sm" : "lg:brands-container brands-container-sm"}`}>
        <div className="flex flex-col w-full">
          <div className={`flex ${sidebar.length > 0 ? "justify-between" : "justify-center"} w-full max-w-[1060px]`}>
            <div className={"w-full"}>
              <div className="mt-2"></div>
              <div
                ref={mainFilterRef}
                className={`sticky w-full bg-white !py-3 left-0 ${menuBarDisplay ? "z-20" : "z-40"} ${
                  pathname === "/" ? "lg:brands-container brands-container-sm" : ""
                } ${mediaQueryWidth > 851 ? "pr-5" : "pr-0"} ${mediaQueryWidth > 851 ? "top-[70px]" : isScrollingDown ? "top-0" : "md:top-[70px] top-[56px]"}`}
              >
                <div className={`${pathname === "/" ? "flex justify-between space-x-1" : ""}`}>
                  <div ref={categoryFilterRef}>
                    <CategoryFilter
                      onChangeSingle={(val) => {
                        router.push(val && val.slug ? `/?category=${val.slug}` : "/");

                        setProduct({
                          ...product,
                          list: [],
                        });
                        setPagination({ ...pagination, page: 1 });
                      }}
                      cateSlug={categorySlug}
                    />
                  </div>
                  <div className="flex justify-end flex-1">
                    <CurationTimeFilter
                      onChange={(val) => {
                        setTimeFilter(val === "newest" ? "newest" : "most_voted");
                      }}
                      isOnlyShowIcon={mediaQueryWidth <= 768 || controlDisplayTimerFilter}
                    />
                  </div>
                </div>
              </div>
              <div className={`flex flex-col space-y-6 w-full mt-3 ${mediaQueryWidth > 852 ? "max-w-[700px] pr-5" : ""}`}>
                {/* {pathname.includes("brands") && (
                  <div className="flex">
                    <TimeFilter
                      onChange={(val) => {
                        // todo call product page 1
                      }}
                    />
                  </div>
                )} */}

                {switchingProduct ? (
                  pathname === "/" ? (
                    <CurationSkeleton />
                  ) : (
                    <ProductSkeleton />
                  )
                ) : (
                  <div id="productWrapper" className={`min-w-[135px] min-[852px]:w-[700px] max-w-full w-full flex flex-col space-y-[14px]`}>
                    {product.list.map((_i: any, idx) => {
                      const tags = _i.attributes?.tags?.data?.reduce((acc: any[], item: any) => {
                        acc.push({
                          name: item.attributes.name,
                          slug: `/${item.attributes.slug}`,
                        });
                        return acc;
                      }, []);
                      let Component = ProductCurationsCard;
                      if (pathname === "/brands") {
                        Component = ProductCard;
                      }
                      return (
                        <Fragment key={_i.id}>
                          {product.list.length === idx + 1 && pagination.hasNextPage && <div className="w-full h-1" ref={ref}></div>}
                          <Component
                            id={_i.id}
                            thumbnail={_i.attributes?.thumbnail.data?.attributes.url}
                            hoverVideo={_i.attributes?.hoverVideo.data?.attributes.url}
                            name={_i.attributes?.name}
                            headline={_i.attributes?.headline}
                            subHeadline={_i.attributes?.subHeadline}
                            voted={_i.status ? _i.status.votedId !== 0 : false}
                            votedId={_i.status?.voteId || 0}
                            tags={tags}
                            award={[]}
                            // slug={`/${
                            //   pathname === '/brands'
                            //     ? 'brands-products'
                            //     : 'products'
                            // }/${_i.attributes?.slug}`}
                            slug={`/curation/${_i.attributes?.slug}`}
                            countVoted={_i.attributes?.votes}
                            spPrdId={_i.attributes?.shopProductId}
                            navigate={
                              () => router.push(`/curation/${_i.attributes?.slug}`)
                              // navigate(`/products/${_i.attributes?.slug}`)
                            }
                            bookmarked={_i.isBookmarked}
                            prdImages={_i.attributes?.images?.data ? _i.attributes?.images?.data : []}
                            prdVideo={_i.attributes?.videos?.data?.length > 0 ? _i.attributes?.videos?.data : []}
                            // shopVariantPrice={_i?.attributes?.shopVariantPrice}
                            shopVariantPrice={_i?.attributes?.price}
                            shopVariantCurrency={_i?.attributes?.currency}
                            // shopVariantCurrency={
                            //   _i?.attributes?.shopVariantCurrency
                            // }
                            prdDetail={_i}
                          />
                        </Fragment>
                      );
                    })}
                    {product.loading && (pathname === "/" ? <CurationSkeleton /> : <ProductSkeleton />)}
                    {!product.loading && product.list.length < 1 && <NotFoundProduct2 />}
                  </div>
                )}
              </div>
            </div>

            <div
              className={`${
                pathname === "/brands" ? "pl-4 min-[852px]:flex hidden lg:max-w-[360px] max-w-[260px] w-full" : "pl-4 min-[852px]:flex hidden w-full"
              }`}
            >
              <StickySidebar sidebar={sidebar} product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageCMS;
