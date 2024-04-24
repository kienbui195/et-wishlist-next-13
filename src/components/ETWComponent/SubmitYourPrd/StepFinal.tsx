import { MainImage3 } from "@/utils/svgExport";
import Image from "next/image";
import React from "react";

const StepFinal = () => {
  return (
    <main className="w-full flex-1">
      <div className="fixed inset-x-0 inset-y-20 flex items-center justify-center">
        <div className="mx-auto w-full max-w-[316px] rounded-xl bg-white px-7 py-6 text-center shadow-appSubmit">
          <Image src={MainImage3} alt="" width="50" height="50" className="mx-auto aspect-square rounded-lg object-cover hidden" />
          <h1 className="text-base font-medium text-slate-1100">Application Submitted</h1>
          <p className="mt-2 text-xs font-normal text-gray-1150">Check your e-mail for a receipt of your application and the next steps that you can expect.</p>
          <p className="mt-2 text-xs font-semibold leading-tight text-black">Want to get ahead and be ready for launch?</p>
          <div className="mt-[18px] flex flex-wrap justify-center">
            <button className="mr-1.5 h-9 rounded-md border border-gray-2000 bg-white px-2 text-xs font-semibold text-slate-1050 shadow-media">
              Watch Video
            </button>
            <a href="/brand-products">
              <button className="h-9 rounded-md bg-[--brand-primary] hover:bg-[--brand-primary-hover] active:bg-[--brand-primary-pressed] px-2 text-xs font-semibold text-white shadow-media">
                Complete Product Page
              </button>
            </a>
          </div>
        </div>
      </div>
      <div
        className="el-overlay"
        style={{
          zIndex: 2024,
          display: "none",
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="el-id-6133-286"
          aria-describedby="el-id-6133-287"
          className="el-overlay-dialog"
          style={{ display: "flex" }}
        ></div>
      </div>
    </main>
  );
};

export default StepFinal;
