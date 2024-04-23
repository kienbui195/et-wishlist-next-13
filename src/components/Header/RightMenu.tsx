"use client";

import React, { useState } from "react";
import SearchComponent from "./SearchComponent";
import { useRouter, usePathname } from "next/navigation";
import { createQuery } from "../../utils/function";
import ButtonAvatar from "../../components/ButtonAvatar";

const RightMenu = () => {
  const [hidden, setHidden] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const shouldShowSearch = !pathname.includes("submit-your-product") && !pathname.includes("brand-");
  return (
    <div className={`flex items-center ${hidden ? "" : "space-x-6"} justify-end md:w-[420px] w-full`}>
      {shouldShowSearch && (
        <div className="md:flex hidden flex-1">
          <SearchComponent
            className={"md:flex hidden"}
            onOpen={(val) => {
              if (val) {
                setHidden(true);
              } else {
                setHidden(false);
              }
            }}
            onEnter={(val) => {
              const queryObj = {
                _pt: "Single",
              };
              if (pathname === "/brands") {
                queryObj._pt = "Merchant";
              }
              const query = createQuery(queryObj);
              router.push(`/product-search/${encodeURIComponent(val)}?${query}`);
            }}
          />
        </div>
      )}
      <div className="lg:flex hidden ml-2">
        <ButtonAvatar />
      </div>
    </div>
  );
};

export default RightMenu;
