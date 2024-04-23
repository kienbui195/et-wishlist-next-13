"use client";

import { RootState } from "../../lib/store";
import AvatarComponent from "../../components/AutoAvatar";
import CustomButton from "../../components/Header/CustomButton";
import { useAlertContext } from "../../context/alertContext";
import { setOpenModalLogin } from "../../lib/features/authenticate/loginSlice";
import { setUserLogout } from "../../lib/features/authenticate/userSlice";
import useUserLogin from "../../hooks/useUserLogin";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const ButtonAvatar = () => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const { token } = useUserLogin();
  const shopInfo = useSelector((state: RootState) => state.shop.shop);
  const userInfo = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const { showAlert } = useAlertContext();
  const avatarRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const rows = [
    // {
    //   label: 'My Votes',
    //   action: () => navigate('/my-votes'),
    // },
    {
      label: "My Bookmarks",
      action: () => router.push("/my-bookmarks"),
    },
    // {
    //   label:
    //     shopInfo.connected && shopInfo.active
    //       ? 'Brand Dashboard'
    //       : 'Submit Your Product',
    //   action: () =>
    //     navigate(
    //       shopInfo.connected && shopInfo.active
    //         ? '/brand-dashboard'
    //         : '/submit-your-product'
    //     ),
    // },
  ];

  const handleClickOutSideDropdown = (e: globalThis.MouseEvent) => {
    if (e.target instanceof Node && dropdownRef.current && avatarRef.current) {
      if (!dropdownRef.current.contains(e.target) && !avatarRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener("mousedown", handleClickOutSideDropdown);

    return () => window.removeEventListener("mousedown", handleClickOutSideDropdown);
  }, [dropdownRef, avatarRef]);

  const renderRow = (label: React.ReactNode, action: () => void) => {
    return (
      <div
        className="py-2 px-6 hover:bg-[--gray-line] whitespace-nowrap cursor-pointer text-link-16"
        onClick={() => {
          setShowDropdown(false);
          action();
        }}
      >
        {label}
      </div>
    );
  };

  return (
    <React.Fragment>
      {token ? (
        <div className="relative">
          <div
            ref={avatarRef}
            className=" h-[50px] w-[50px] border-[1px] border-[--gray-line] rounded-full p-2 hover:bg-[--gray-line] hover:cursor-pointer flex justify-center items-center"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {/* <img src={DefaultAvatar} alt="" /> */}
            <AvatarComponent
              username={userInfo.last_name && userInfo.first_name ? `${userInfo.first_name} ${userInfo.last_name}` : userInfo.email}
              fontSize={22}
            />
          </div>
          <div
            ref={dropdownRef}
            className={`w-fit shadow-lg bg-white py-4  right-0 top-[110%] z-50 rounded-md absolute transition-all transform duration-300 ${
              showDropdown ? "scale-100 skew-y-0" : "scale-0 skew-y-12"
            } `}
          >
            <div className="py-2 mx-4 flex space-x-3 items-center justify-between border-b-[1px] border-[--gray-line]">
              <div className="h-[30px] w-[30px] rounded-full border-[1px] border-[--gray-line] flex justify-center items-center">
                <AvatarComponent
                  username={userInfo.last_name && userInfo.first_name ? `${userInfo.first_name} ${userInfo.last_name}` : userInfo.email}
                  height={30}
                  width={30}
                />
              </div>
              <div className="">
                <p className="text-link-bold-16">{userInfo.email}</p>
                <p className="btn-13">{userInfo.last_name && userInfo.first_name ? `${userInfo.first_name} ${userInfo.last_name}` : userInfo.username}</p>
              </div>
            </div>
            <div className="py-2">
              {rows.map((_i, idx) => (
                <React.Fragment key={idx}>{renderRow(_i.label, _i.action)}</React.Fragment>
              ))}
            </div>
            <hr />
            <div className="pt-2">
              {renderRow("Log Out", () => {
                localStorage.removeItem("ETWL");
                dispatch(setUserLogout());
                showAlert("info", "You have logged out!");
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-[10px]">
          <CustomButton
            className="border border-[--gray-line] px-[16px] py-[6px] bg-[--gray-white] hover:bg-[--gray-line] rounded-[4px]"
            onClick={() => router.push("/login")}
            label={"Sign In"}
          />
          <CustomButton
            className="border border-[--gray-line] px-[16px] py-[6px] bg-[--brand-primary] text-white rounded-[4px]"
            label={"Sign Up"}
            onClick={() => router.push("/register")}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default ButtonAvatar;
