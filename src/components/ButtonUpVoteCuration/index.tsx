import Image from 'next/image'
import * as React from 'react'
import { VoteIcon } from '@/utils/svgExport'

interface IButtonUpVote {
  onClick?: () => void
}

const ButtonUpVoteCuration: React.FC<IButtonUpVote> = ({ onClick }) => {
  return (
    <div className="relative flex w-24 flex-col items-center justify-start md:h-40 md:w-[130px] transition-all duration-300 ease-in-out group-hover:pt-3 md:group-hover:pt-[30px]">
      <div className="flex h-[30px] w-[30px] shrink-0 scale-[0.77] items-start justify-center overflow-hidden rounded-full bg-[--brand-primary] py-[5px] md:scale-100 ">
        <Image
          src={VoteIcon}
          alt="vote"
          className="vote-icons transition-transform duration-300 group-hover:-translate-y-[29px]"
        />
      </div>
      <div className="absolute left-[11px] top-3 md:left-[42px] md:top-9">
        <svg
          width="51"
          height="54"
          viewBox="0 0 51 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="rays"
        >
          <clipPath
            id="rays-550"
            transform="translate(13, 15)"
            className="rays-clip-path"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z"
              fill="white"
            ></path>
          </clipPath>
          <g clipPath="url(#rays-550)">
            <path
              d="M48.6724 0.292969C49.0629 -0.0976562 49.6961 -0.0976562 50.0866 0.292969C50.4772 0.683472 50.4772 1.31665 50.0866 1.70715L34.3137 17.48C33.9232 17.8705 33.29 17.8705 32.8995 17.48C32.509 17.0895 32.509 16.4563 32.8995 16.0658L48.6724 0.292969Z"
              fill="#0A888D"
            ></path>
            <path
              d="M22 2.37952C22 1.82727 22.4477 1.37952 23 1.37952C23.5523 1.37952 24 1.82727 24 2.37952V12.3795C24 12.9318 23.5523 13.3795 23 13.3795C22.4477 13.3795 22 12.9318 22 12.3795V2.37952Z"
              fill="#0A888D"
            ></path>
            <path
              d="M0 27.3795C0 27.9318 0.447693 28.3795 1 28.3795H8C8.55231 28.3795 9 27.9318 9 27.3795C9 26.8273 8.55231 26.3795 8 26.3795H1C0.447693 26.3795 0 26.8273 0 27.3795Z"
              fill="#0A888D"
            ></path>
            <path
              d="M8.39294 14.1868C8.00244 13.7961 8.00244 13.1631 8.39294 12.7725C8.78351 12.382 9.41663 12.382 9.80719 12.7725L13.1005 16.0659C13.491 16.4564 13.491 17.0896 13.1005 17.4801C12.71 17.8706 12.0768 17.8706 11.6863 17.4801L8.39294 14.1868Z"
              fill="#0A888D"
            ></path>
            <path
              d="M1.70709 6.08655C1.31659 6.47717 1.31659 7.11023 1.70709 7.50085L5.00049 10.7942C5.39099 11.1847 6.02417 11.1847 6.41467 10.7942C6.80518 10.4037 6.80518 9.77051 6.41467 9.38L3.12134 6.08655C2.73077 5.69604 2.09766 5.69604 1.70709 6.08655Z"
              fill="#0A888D"
            ></path>
            <path
              d="M22 42.3795C22 41.8273 22.4477 41.3795 23 41.3795C23.5523 41.3795 24 41.8273 24 42.3795V52.3795C24 52.9318 23.5523 53.3795 23 53.3795C22.4477 53.3795 22 52.9318 22 52.3795V42.3795Z"
              fill="#0A888D"
            ></path>
            <path
              d="M13.1005 37.2791C12.71 36.8884 12.0768 36.8884 11.6863 37.2791L2.54749 46.4178C2.15692 46.8083 2.15692 47.4415 2.54749 47.832C2.93799 48.2225 3.57117 48.2225 3.96167 47.832L13.1005 38.6932C13.491 38.3027 13.491 37.6696 13.1005 37.2791Z"
              fill="#0A888D"
            ></path>
            <path
              d="M38 28.3795C37.4477 28.3795 37 27.9318 37 27.3795C37 26.8273 37.4477 26.3795 38 26.3795H48C48.5523 26.3795 49 26.8273 49 27.3795C49 27.9318 48.5523 28.3795 48 28.3795H38Z"
              fill="#0A888D"
            ></path>
            <path
              d="M32.8995 37.2789C32.509 37.6696 32.509 38.3026 32.8995 38.6932L36.5218 42.3154C36.9123 42.7061 37.5455 42.7061 37.936 42.3154C38.3265 41.9249 38.3265 41.2917 37.936 40.9012L34.3137 37.2789C33.9232 36.8884 33.29 36.8884 32.8995 37.2789Z"
              fill="#0A888D"
            ></path>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default ButtonUpVoteCuration
