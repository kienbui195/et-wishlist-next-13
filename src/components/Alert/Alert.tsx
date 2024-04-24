import React, { Fragment, useEffect, useRef, useState } from "react";
import { TAlertType } from "../../data/wl-types";

import useMediaQuery from "../../hooks/useMediaQuery";
import { isMobileOrTabletDevice } from "../../utils/function";
import Image from "next/image";
import { CloseE, CloseI, CloseS, CloseW, Info, Success, Warning } from "@/utils/svgExport";

export interface AlertProps {
  children: string;
  containerClassName?: string;
  type?: TAlertType;
  open: boolean;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ children = "Alert Text", containerClassName = "", type = "info", open = true, onClose }) => {
  const alertRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLImageElement>(null);
  const [openAlert, setOpenAlert] = useState(open);
  const mediaWidth = useMediaQuery();
  let classes = "";
  useEffect(() => {
    if (alertRef.current && alertRef.current.parentElement && alertRef.current.parentElement.parentElement) {
      const alertWithContainer = mediaWidth > 650 ? 650 : mediaWidth - 30;
      alertRef.current.parentElement.parentElement.style.width = alertWithContainer + "px";
      if (isMobileOrTabletDevice()) {
        alertRef.current.parentElement.style.width = "100%";
      }
      alertRef.current.parentElement.parentElement.style.display = "flex";
      alertRef.current.parentElement.parentElement.style.justifyContent = "center";
      alertRef.current.parentElement.parentElement.style.alignItems = "center";
    }
  }, [mediaWidth]);

  switch (type) {
    case "info":
      classes += " text-[--state-info] border-[--state-info]";
      break;
    case "success":
      classes += " text-[--state-success] border-[--state-success]";
      break;
    case "error":
      classes += " text-[--state-error] border-[--state-error]";
      break;
    case "warning":
      classes += " text-[--state-warning] border-[--state-warning]	";
      break;
    default:
      break;
  }

  return (
    <Fragment>
      {openAlert && (
        <div
          ref={alertRef}
          className={`w-full rounded-[7px] border-[1px] flex space-x-[10px] bg-white items-center justify-between p-[12px_16px] ${classes} ${containerClassName}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <Image src={type === "info" ? Info : type === "success" ? Success : type === "error" ? Error : Warning} alt="" />
              <div
                // className={`!max-w-[99vw] !w-full text-ellipsis line-clamp-4 ${
                className={`!max-w-[99vw] !w-full${
                  type === "info"
                    ? "text-[--state-info]"
                    : type === "warning"
                    ? "text-[--state-warning]"
                    : type === "success"
                    ? "text-[--state-success]"
                    : "text-[--state-error]"
                }`}
              >
                {children}
              </div>
            </div>
          </div>
          <Image
            className="ml-4px cursor-pointer"
            src={type === "info" ? CloseI : type === "success" ? CloseS : type === "error" ? CloseE : CloseW}
            ref={closeBtnRef}
            alt=""
            onClick={() => {
              setOpenAlert(false);
              onClose && onClose();
            }}
          />
        </div>
      )}
    </Fragment>
  );
};
