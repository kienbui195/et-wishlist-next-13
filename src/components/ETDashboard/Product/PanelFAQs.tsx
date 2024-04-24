import React, { useState } from "react";
import { ProductPanelProps } from "./type";
import FormInput from "@/components/FormInput/Input";
import FormTextarea from "@/components/FormTextarea/FormTextarea";
import { FAQ } from "./type";
import Image from "next/image";
import { DeleteIcon } from "@/utils/svgExport";

const PanelFAQs: React.FC<ProductPanelProps> = ({ data, onSetState, isCreate = true }) => {
  const initialFAQ: FAQ = {
    question: "",
    answer: "",
  };

  const [faqs, setFAQs] = useState<FAQ[]>([...data.faqs, ...[initialFAQ]]);

  const addFAQ = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFAQs((prevFAQs) => [...prevFAQs, { ...initialFAQ }]);
  };

  const deleteFAQ = (index: number) => {
    setFAQs((prevFAQs) => {
      const newFAQs = [...prevFAQs];
      newFAQs.splice(index, 1);
      return newFAQs;
    });
    const f = data.faqs;
    const newF = f.filter((item, i) => i !== index);
    onSetState((preState) => ({ ...preState, faqs: newF }));
  };

  return (
    <div id="pane-FAQs" className="el-tab-pane" role="tabpanel" aria-hidden="true" aria-labelledby="tab-FAQs">
      <div product-form-ref="[object Object]">
        <div>
          <h2 className="mt-[25px] text-sm font-medium leading-none tracking-tight text-black">Frequently Asked Questions</h2>
          <h3 className="mt-2.5 text-base leading-tight text-gray-1150">
            Pro tip: Focus on the most common questions (or objections) your potential customers will have before buying your product. Prioritize them and use
            each answer as an opportunity to convey the value of your product and why its worth buying.
          </h3>
        </div>
        <div className="mt-[41px] w-[555px]">
          <form className="el-form el-form--default el-form--label-top">
            {faqs.map((faq, index) => {
              return faqs.length === index + 1 ? (
                <React.Fragment key={index}>
                  <div className="asterisk-left">
                    <FormInput
                      label={`Question ${index + 1}`}
                      maxLength={250}
                      placeholder="Enter Question"
                      value={data.faqs[index]?.question}
                      onChange={(e) => {
                        const updatedFAQs = data.faqs.map((faq, idx) => (index === idx ? { ...faq, question: e.target.value } : faq));

                        const newFAQs = updatedFAQs.some((faq, idx) => index === idx)
                          ? updatedFAQs
                          : [...updatedFAQs, { ...initialFAQ, question: e.target.value }];

                        onSetState((preState) => ({
                          ...preState,
                          faqs: newFAQs,
                        }));
                      }}
                    />
                  </div>
                  <div className="asterisk-left mt-5 mb-5">
                    <FormTextarea
                      label={`Answer ${index + 1}`}
                      limitCharacter={500}
                      placeholder="Enter Answer"
                      value={data.faqs[index]?.answer}
                      onChange={(e) => {
                        const updatedFAQs = data.faqs.map((faq, idx) => (index === idx ? { ...faq, answer: e.target.value } : faq));

                        const newFAQs = updatedFAQs.some((faq, idx) => index === idx)
                          ? updatedFAQs
                          : [...updatedFAQs, { ...initialFAQ, answer: e.target.value }];

                        onSetState((preState) => ({
                          ...preState,
                          faqs: newFAQs,
                        }));
                      }}
                    />
                  </div>
                </React.Fragment>
              ) : (
                <div className="relative mb-5 rounded-md border border-gray-1350 p-[30px]">
                  <div className="text-sm font-medium leading-none text-slate-1050">Question {index + 1}</div>
                  <div className="mt-3 text-sm font-medium leading-none text-slate-1150">{data.faqs[index]?.question}</div>
                  <div className="mt-1.5 text-sm text-gray-1150">{data.faqs[index]?.answer}</div>
                  <div className="absolute right-[30px] top-[30px] h-1 cursor-pointer">
                    <div onClick={() => deleteFAQ(index)}>
                      <Image src={DeleteIcon} alt="" />
                    </div>
                  </div>
                </div>
              );
            })}
            <button
              onClick={addFAQ}
              className="mt-[30px] h-11 whitespace-nowrap rounded-md border-[1.4px] border-gray-2550 bg-white px-5 text-base font-semibold text-slate-1150 shadow-dashboardButtons"
            >
              Add Another FAQ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PanelFAQs;
