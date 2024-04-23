"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import Logo from "../../components/Logo/Logo";
import { INavigation } from "../../components/Header/HeaderLogged";
import Footer from "../../components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../lib/store";
import CustomButton from "../../components/Header/CustomButton";
import { setUserLogout } from "../../lib/features/authenticate/userSlice";
import useUserLogin from "../../hooks/useUserLogin";
import { setOpenModalLogin } from "../../lib/features/authenticate/loginSlice";
import AvatarComponent from "../AutoAvatar";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAlertContext } from "@/context/alertContext";

const NAV_OPTION_LOGIN = [
  // {
  //   id: 353,
  //   title: 'My Votes',
  //   slug: '/my-votes',
  //   isNew: false,
  // },
  {
    id: 354,
    title: "My Bookmarks",
    slug: "/my-bookmarks",
    isNew: false,
  },
];

export interface NavMobileProps {
  onClickClose?: () => void;
  onChangeSearchInput?: (val: string) => void;
  onEnter?: (value: string) => void;
}

const NavMobile: React.FC<NavMobileProps> = ({ onClickClose, onChangeSearchInput, onEnter }) => {
  const dispatch = useDispatch();
  const { showAlert } = useAlertContext();
  const router = useRouter();
  const logo = useSelector((state: RootState) => state.header.header.logo);
  const data = useSelector((state: RootState) => state.header.header.navItems);
  const shopRedux = useSelector((state: RootState) => state.shop.shop);
  const [value, setValue] = useState("");
  const { token } = useUserLogin();
  const inputRef = useRef<HTMLInputElement>(null);
  const userInfo = useSelector((state: RootState) => state.user.user);
  const pathname = usePathname();

  const handleEnter = (e: any) => {
    if (e.keyCode === 13) {
      onEnter && onEnter(value);
    }
  };

  const _renderItem = (item: INavigation, index?: number) => {
    return (
      <div key={index}>
        <Link
          className={`p-0 flex items-center font-medium capitalize tracking-wide text-sm w-full space-x-2 box-border h-[32px]`}
          href={{
            pathname: item.slug || undefined,
          }}
        >
          <div
            className={`border-b-[2px] border-transparent hover:border-[--gray-text] tracking-[0.48px] h-[32px]
            product-title-22 box-border ${pathname.replace("/", "") === item.slug || pathname === item.slug ? "border-b-[--gray-text]" : ""}`}
          >
            {item.title}
          </div>
          {item.isNew && <div className={"px-2 bg-red-400 rounded-full text-white text-sm"}>New</div>}
        </Link>
      </div>
    );
  };

  const renderMagnifyingGlassIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M13.6885 12.4354L10.3864 9.28605C10.3444 9.24634 10.2987 9.21049 10.25 9.17897C11.1575 8.07109 11.6055 6.66852 11.5044 5.25118C11.4033 3.83385 10.7606 2.506 9.70462 1.53267C8.64862 0.559333 7.25699 0.012104 5.80747 0.000198405C4.35794 -0.0117072 2.95715 0.512587 1.88466 1.46844C0.812174 2.42429 0.146883 3.74139 0.0215718 5.15687C-0.10374 6.57234 0.320145 7.98208 1.20862 9.10471C2.0971 10.2273 3.38482 10.9803 4.81478 11.2133C6.24473 11.4463 7.71173 11.1422 8.92299 10.3617C8.96811 10.445 9.02621 10.5209 9.09519 10.5867L12.3973 13.7361C12.4841 13.8207 12.5872 13.8876 12.7005 13.9329C12.8139 13.9782 12.9353 14.001 13.0577 14C13.1801 13.999 13.3011 13.9742 13.4137 13.9271C13.5262 13.8799 13.6282 13.8114 13.7135 13.7254C13.7989 13.6394 13.866 13.5377 13.911 13.4261C13.956 13.3145 13.978 13.1953 13.9756 13.0753C13.9733 12.9553 13.9467 12.837 13.8974 12.7272C13.8481 12.6174 13.7771 12.5182 13.6885 12.4354ZM0.983189 5.63695C0.983189 4.71087 1.26337 3.80558 1.7883 3.03557C2.31322 2.26556 3.05932 1.66541 3.93224 1.31101C4.80516 0.956614 5.7657 0.863888 6.69239 1.04456C7.61908 1.22523 8.47029 1.67118 9.1384 2.32602C9.8065 2.98086 10.2615 3.81518 10.4458 4.72347C10.6301 5.63175 10.5355 6.57322 10.174 7.42881C9.81239 8.2844 9.20009 9.01569 8.41448 9.53019C7.62887 10.0447 6.70525 10.3193 5.7604 10.3193C4.49386 10.3179 3.27961 9.82409 2.38403 8.94629C1.48844 8.06849 0.98466 6.87835 0.983189 5.63695Z"
          fill="#222222"
        />
      </svg>
    );
  };

  const renderSearchForm = () => {
    return (
      <div className="h-[32px] rounded-[24px] p-[6px_8px] flex items-center space-x-3 justify-between w-full bg-[--gray-bg-tag]">
        <div>{renderMagnifyingGlassIcon()}</div>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onChangeSearchInput && onChangeSearchInput(e.target.value);
          }}
          placeholder="Search more product and more"
          className="w-full h-full outline-none border-none bg-[--gray-bg-tag] placeholder:font-[400] placeholder:text-[14px] placeholder:leading-[20px] text-[--gray] p-0"
        />
      </div>
    );
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener("keypress", handleEnter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => inputRef.current?.removeEventListener("keypress", handleEnter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, inputRef.current]);

  useEffect(() => {
    if (pathname.includes("/product-search") || pathname.includes("/product-search/")) {
      const [, , value] = pathname.split("/");
      setValue(decodeURIComponent(value));
    }
  }, [pathname]);

  return (
    <div className={`overflow-y-auto w-full h-screen bg-white`}>
      <div className="p-[4px_16px] border-b-[1px] border-[--gray-line] h-[56px] flex items-center justify-between bg-[#F6F6F6]">
        <div className="h-[48px] flex items-center space-x-4">
          <button
            className="p-2.5 rounded-lg text-neutral-700 dark:text-neutral-300 focus:outline-none flex items-center justify-center h-[36px] w-[36px]"
            onClick={() => onClickClose && onClickClose()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {logo && <Logo logo={logo} />}
        </div>
        {!token && (
          <CustomButton label="Sign Up" className="!h-[40px] bg-[--gray-text] text-white rounded-[4px]" onClick={() => dispatch(setOpenModalLogin(true))} />
        )}
      </div>
      {userInfo.id && (
        <React.Fragment>
          <div className="my-2 mx-8 flex space-x-4 items-center">
            <div className=" h-[50px] w-[50px] border-[1px] border-[--gray-line] rounded-full p-2 hover:bg-[--gray-line] hover:cursor-pointer flex justify-center items-center">
              {/* <img src={DefaultAvatar} alt="" /> */}
              <AvatarComponent
                username={userInfo.last_name && userInfo.first_name ? `${userInfo.first_name} ${userInfo.last_name}` : userInfo.email}
                fontSize={22}
              />
            </div>
            <div className="">
              <p className="text-link-bold-16">{userInfo.email}</p>
              <p className="btn-13">{userInfo.last_name && userInfo.first_name ? `${userInfo.first_name} ${userInfo.last_name}` : userInfo.username}</p>
            </div>
          </div>
          <hr />
        </React.Fragment>
      )}
      <div className="p-[10px_24px] h-[52px] flex items-center">{renderSearchForm()}</div>
      <div className="flex flex-col space-y-6 m-[4px_32px] ">
        {/* {data.map(_renderItem)} */}

        {!token ? (
          <Fragment>
            <CustomButton
              label="Sign in"
              className="h-[40px] rounded-[4px] p-[11px_16px] border-[1px] border-[--gray-line] box-border w-fit"
              onClick={() => dispatch(setOpenModalLogin(true))}
            />
          </Fragment>
        ) : (
          <Fragment>
            {NAV_OPTION_LOGIN.map((item: INavigation, idx: number) => _renderItem(item, idx))}
            {/* {shopRedux.connected && shopRedux.active
              ? _renderItem({
                  isNew: false,
                  slug: 'brand-dashboard',
                  title: 'Brand Dashboard',
                })
              : _renderItem({
                  isNew: false,
                  slug: 'submit-your-product',
                  title: 'Submit Your Product',
                })} */}
            <CustomButton
              label="Sign out"
              className="h-[40px] rounded-[4px] p-[11px_16px] border-[1px] border-[--gray-line] box-border w-fit"
              onClick={() => {
                localStorage.removeItem("ETWL");
                dispatch(setUserLogout());
                showAlert("info", "You have logged out!");
              }}
            />
          </Fragment>
        )}
      </div>
      <div className="absolute left-[32px] bottom-[26px]">
        <Footer />
      </div>
    </div>
  );
};

export default NavMobile;
