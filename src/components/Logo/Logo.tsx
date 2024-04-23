import React from "react";

import Image from "next/image";

const Logo = ({ logo }: { logo: string }) => {
  return (
    <a href="/" className="w-auto h-[48px] flex justify-center items-center">
      <Image width={0} height={0} sizes="100vw" src={logo} alt="" className="w-full h-auto object-contain h-full" />
    </a>
  );
};

export default Logo;
