import React, { FC } from "react";
import Link from "next/link";

interface ITag {
  name: string;
  slug: string;
}

const CustomTag: FC<ITag> = ({ name = "Tag name", slug = "/#" }) => {
  return (
    <Link href={slug} className="h-[20px] rounded-[4px] p-[0_9px] bg-[--gray-bg-tag] w-fit">
      <div className="R-home-content text-[--gray]">{name}</div>
    </Link>
  );
};

export default CustomTag;
