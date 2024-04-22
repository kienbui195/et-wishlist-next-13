import React, { FC } from 'react'
import './ProductDetail.css'
import FAQDot from '../../assets/svg/FAQ_Dot.svg'

interface IFAQProps {
  question: string
  answer: string
}

const FAQ: FC<IFAQProps> = ({ question, answer }) => {
  return (
    <div className="mt-4 first:mt-0">
      <div className="flex">
        <div className="flex items-baseline text-sm font-bold tracking-wide text-gray-1150">
          <span className="text-[--text-gray]">Q</span>
          <img
            src={FAQDot}
            alt=""
            height="1"
            width="24"
            className="ml-1 mr-2 w-6 min-w-[24px]"
          />
        </div>
        <div
          className="whitespace-pre-wrap text-sm font-bold leading-[18px] tracking-wide text-[--black-text]"
          title={question}
        >
          {question}
        </div>
      </div>
      <div className="mt-1 flex">
        <div className="flex items-baseline text-sm font-bold tracking-wide text-gray-1150">
          <span className="text-[--text-gray]">A</span>
          <img
            src={FAQDot}
            height="1"
            width="24"
            alt=""
            className="ml-1 mr-2 w-6 min-w-[24px]"
          />
        </div>
        <div
          className="whitespace-pre-wrap text-sm font-normal leading-5.5 tracking-wide text-[--black-text]"
          title={answer}
        >
          {answer}
        </div>
      </div>
    </div>
  )
}

export default FAQ
