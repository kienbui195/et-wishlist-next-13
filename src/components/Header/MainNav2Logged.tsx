/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Logo from "@/components/Logo/Logo";
import MenuBar from "@/components/MenuBar/MenuBar";
import Navigation from "@/components/Navigation/Navigation";
import RightMenu from "./RightMenu";
import { IFooter, ILogo, INavigation } from "./HeaderLogged";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import apis from "@/apis";
import { Fragment, useEffect, useState } from "react";
import { setUser } from "@/lib/features/authenticate/userSlice";
import { updateShopInfo } from "@/lib/features/authenticate/shopSlice";
import { setOpenModalLogin } from "@/lib/features/authenticate/loginSlice";
import { usePathname, useRouter } from "next/navigation";
import { useAlertContext } from "@/context/alertContext";
import useUserLogin from "@/hooks/useUserLogin";

export interface MainNav2LoggedProps {
  navInfo?: INavigation[];
  logo?: ILogo;
  footer?: IFooter;
}

const MainNav2Logged = () => {
  const pathnameCurrent = usePathname();
  const logo = useSelector((state: RootState) => state.header.header.logo);
  const { token } = useUserLogin();
  const dispatch = useDispatch();
  const pathname = pathnameCurrent.includes("submit-your-product") || pathnameCurrent.includes("brand-");
  const router = useRouter();
  const { showAlert } = useAlertContext();
  const [loading, setLoading] = useState(true);

  const getUser = () => {
    apis
      .checkLogin()
      .then((res) => {
        setLoading(false);
        dispatch(setUser(res.data));
        dispatch(
          updateShopInfo({
            id: res.data.wl_shop ? res.data.wl_shop.id : 0,
            active: res.data.wl_shop ? res.data.wl_shop.active : false,
            connected: res.data.wl_shop ? res.data.wl_shop.connected : false,
          })
        );
      })

      .catch((err) => {
        console.log(err);
        localStorage.removeItem("ETWL");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (token) {
      getUser();
    }
  }, [token]);

  useEffect(() => {
    if (
      pathnameCurrent.includes("brand-") ||
      pathnameCurrent.includes("submit-your-product") ||
      pathnameCurrent.includes("my-votes") ||
      pathnameCurrent.includes("my-bookmarks")
    ) {
      if (!token) {
        router.push("/");
        dispatch(setOpenModalLogin(true));
        showAlert("warning", "Features require logging in to use");
      }
    }
  }, [pathnameCurrent, token]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const renderContent = () => {
    return (
      <div className="h-[48px] w-full flex items-center justify-between lg:py-0 py-[4px] space-x-2 lg:!px-0 px-4">
        <div className="flex items-center space-x-4">
          <div className="flex lg:hidden items-center flex-1">
            <MenuBar />
          </div>
          {logo && <Logo logo={logo} />}
        </div>
        <div className="flex-[2] hidden lg:flex justify-center mx-4">{!pathname && <Navigation />}</div>

        <div className="lg:flex-[3] flex-1 items-center flex justify-end h-[34px] w-full">
          <RightMenu />
        </div>
      </div>
    );
  };

  if (loading) return <Fragment></Fragment>;

  return (
    <div className={`${pathnameCurrent.includes("brand-") ? "px-10" : "lg:et-container et-container-sm"} flex w-full items-center h-[56px] lg:h-[70px] m-auto`}>
      {renderContent()}
    </div>
  );
};

export default MainNav2Logged;
