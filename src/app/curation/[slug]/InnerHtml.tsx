import React, { useEffect, useRef } from "react";

const InnerHtml = ({ text, className }: { text: string; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const textAfterReplaceUrl = text.replaceAll("../../../../uploads", `${process.env.NEXT_PUBLIC_BE_URL}/uploads`);
    if (ref.current) {
      ref.current.innerHTML = textAfterReplaceUrl;
      const images = ref.current.querySelectorAll("img");
      images.forEach((image) => {
        image.style.display = "inline-block";
        if (image.getAttribute("height")) {
          image.style.height = image.getAttribute("height") + "px";
        }
        if (image.getAttribute("width")) {
          image.style.width = image.getAttribute("width") + "px";
        }
      });
      const tds = ref.current.querySelectorAll("td");
      tds.forEach((td) => {
        if (!td.getAttribute("style")?.includes("border-width")) {
          td.style.borderWidth = "1px";
        }
      });
    }
  }, [text]);

  if (!text) return null;
  if (text.trim().length === 0) return null;

  return <div className={`${className}`} ref={ref}></div>;
};

export default InnerHtml;
