import React, { ReactNode } from "react";

const Title = ({ className = "", title }: { className?: string; title: string | ReactNode }) => {
  return <div className={`sm:text-[24px] text-[20px] font-bold ${className}`}>{title}</div>;
};

export default Title;
