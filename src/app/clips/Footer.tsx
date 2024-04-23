'use client'

import React, { Fragment, useState } from "react";
import CustomButton from "./CustomButton";
import UpVote from "../../assets/svg/UpVote.svg";
import CheckSuccess from "../../assets/svg/check_success.svg";
import CopyClipboard from "../../assets/svg/CopyClipboard.svg";
import { useAlertContext } from "@/context/alertContext";
import Image from "next/image";
import { TVoteStatus } from "./page";

const SectionFooter = () => {
  const [voteStatus, setVoteStatus] = useState<TVoteStatus>("ACTIVE");
  const [copyClipBoard, setCopyClipBoard] = useState(false);
  const { showAlert } = useAlertContext();

  const renderFooter = () => {
    switch (voteStatus) {
      case "":
        return (
          <div className="flex space-x-[11px] items-stretch">
            <CustomButton
              className="space-x-2"
              label={
                <Fragment>
                  <div>Upvote</div>
                  <Image src={UpVote} alt="" />
                  <div>112</div>
                </Fragment>
              }
            />
            <CustomButton label={<div className="whitespace-nowrap">Visit Product Page</div>} type="normal" />
          </div>
        );
      case "ACTIVE":
        return (
          <div className="flex space-x-[11px] items-stretch">
            <div className={`h-[56px] bg-[--gray-bg-tag] flex items-center space-x-1 p-[10px_17px] rounded-[6px]`}>
              <div className={`${copyClipBoard ? "text-[--state-success]" : "text-[--gray-text]"}`}>GRM-HFLZHSZE</div>
              <Image
                src={copyClipBoard ? CheckSuccess : CopyClipboard}
                alt=""
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText("GRM-HFLZHSZE");
                  showAlert("success", "Copied discount code successfully");
                  setCopyClipBoard(true);
                }}
              />
            </div>
            <CustomButton label={<div className="whitespace-nowrap">Buy with Discount</div>} type="primary" />
          </div>
        );
      case "EXPIRED":
        return (
          <div className="flex space-x-[11px] items-stretch">
            <CustomButton
              className="space-x-2"
              label={
                <Fragment>
                  <div>Upvote</div>
                  <Image src={UpVote} alt="" />
                  <div>112</div>
                </Fragment>
              }
            />
            <CustomButton label={<div className="whitespace-nowrap">Visit Product Page</div>} type="normal" />
          </div>
        );
      case "LIMIT":
        return <></>;
      default:
        return (
          <div className="flex space-x-[11px] items-stretch">
            <CustomButton
              className="space-x-2"
              label={
                <Fragment>
                  <div>Upvote</div>
                  <Image src={UpVote} alt="" />
                  <div>112</div>
                </Fragment>
              }
            />
            <CustomButton label={<div className="whitespace-nowrap">Visit Product Page</div>} type="normal" />
          </div>
        );
    }
  };
  return renderFooter();
};

export default SectionFooter;
