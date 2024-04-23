"use client";
import { usePathname as getPathname } from "next/navigation";

const usePathname = () => {
  const pathname = getPathname();
  return pathname;
};

export default usePathname;
