import React, { FC } from "react";
import { ISidebarTag } from ".";
import Link from "next/link";
import { IOptionalSetting } from "../../data/wl-types";

interface ISidebarTagProps {
  value: {
    tags: {
      data: ISidebarTag[];
    };
  };
  options?: IOptionalSetting;
  componentId?: string;
}

const SidebarTag: FC<ISidebarTagProps> = ({ value, options, componentId }) => {
  const prodType = localStorage.getItem("PROD_TYPE") || "Single";
  const sidebarStyle = {
    maxWidth: options?.width || 360,
  };

  return (options && options.isShow) || !options ? (
    <div
      className={`sidebar-right sticky top-0 z-10 hidden mb-4 h-fit shrink-0 bg-white p-0 ${value.tags?.data.length > 0 ? "md:block" : ""} w-full`}
      style={sidebarStyle}
    >
      <div className="mb-3.5  text-sm font-semibold leading-none tracking-tight text-gray-1150">
        {componentId === "shared.sidebar-popular-tag" ? "Popular Tags" : "Featured Tags"}
      </div>
      <div className="flex flex-col space-y-2" style={sidebarStyle}>
        {value?.tags.data.map((_i: ISidebarTag, idx: number) => (
          <Link href={`/tag/${_i.attributes.slug}?_pt=${prodType}`} key={idx} className="w-fit h-fit">
            <div className="align-center flex h-auto min-h-[40px] w-fit max-w-full items-center justify-center rounded-sm border border-gray-1350 bg-white py-2 pl-3 pr-4 text-15 font-semibold leading-none text-gray-1150 hover:bg-gray-2150 md:max-w-[260px]">
              <span className="min-w-0">{_i.attributes.name}</span>
              {_i.attributes.votes > 0 && <span>&nbsp;({_i.attributes.votes})</span>}
            </div>
          </Link>
        ))}
      </div>
      {/* <Link
        to={'#'}
        className="mt-2 block cursor-pointer R-home-content text-[--gray-text]"
      >
        View All Guides
      </Link> */}
    </div>
  ) : null;
};

export default SidebarTag;
