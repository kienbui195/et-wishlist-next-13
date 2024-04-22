import React, { FC } from 'react'

interface ISectionInfoProps {
  label: string
  value: number
}

const SectionInfo:FC<ISectionInfoProps> = ({
  label = '',
  value = 0
}) => {
  return (
    <div
      className="flex h-[114px] w-full items-end justify-between rounded-[14px] border-[1.4px] border-gray-2600 px-[30px] py-7 shadow-dashboardCard"
      style={{ maxWidth: 326 }}
    >
      <div>
        <div className="text-base font-semibold leading-none tracking-tighte text-gray-1150 capitalize font-[RobotoBold]">
          {label}
        </div>
        <div className="mt-2.5 text-32 font-medium leading-none tracking-tight font-[RobotoBold]">
          {value}
        </div>
      </div>
      {/* <div className="flex-shrink-0">
        <div className="flex h-6 items-center justify-center rounded-full border border-gray-1150 bg-gray-1150/10 px-3">
          <img
            src="https://d22lwxpnhu2n4a.cloudfront.net/grommet/img/delta-neutral.svg"
            alt=""
          />
        </div>
      </div> */}
    </div>
  )
}

export default SectionInfo
