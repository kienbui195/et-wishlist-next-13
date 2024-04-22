import * as React from 'react'
import 'react-date-range-ts/dist/styles.css'
import 'react-date-range-ts/dist/theme/default.css'
import { DateRange, DefinedRange } from 'react-date-range-ts'
import moment from 'moment'

interface IDateRangePickerProps {
  onChange?: (value: IDateState) => void
  startDate: Date
  endDate: Date
}

export interface IDateState {
  startDate: Date
  endDate: Date
  key?: string
}

const CustomDateRangePicker: React.FC<IDateRangePickerProps> = ({
  onChange,
  startDate,
  endDate,
}) => {
  const [date, setDate] = React.useState([
    {
      startDate: startDate || new Date(),
      endDate: endDate || new Date(),
      key: 'selection',
    },
  ])
  const [showPicker, setShowPicker] = React.useState(false)
  const inputRef = React.useRef<HTMLDivElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const handleSelectDate = (value: any) => {
    const { selection } = value
    setDate([selection])
    onChange && onChange(selection)
  }

  const handleClickOutSideDropdown = (e: globalThis.MouseEvent) => {
    if (e.target instanceof Node && dropdownRef.current && inputRef.current) {
      if (
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowPicker(false)
      }
    }
  }

  React.useEffect(() => {
    window.addEventListener('mousedown', handleClickOutSideDropdown)

    return () =>
      window.removeEventListener('mousedown', handleClickOutSideDropdown)
  }, [dropdownRef, inputRef])

  return (
    <div className={`flex flex-col w-fit relative select-none box-border`}>
      <div
        className={`border-[1px] border-[--gray-line] flex items-center justify-between rounded-[6px] font-[RobotoBold]`}
        onClick={() => setShowPicker(!showPicker)}
      >
        <div
          ref={inputRef}
          className={`h-[44px] p-[9px_10px]  border-[--gray-line] rounded-[6px] w-fit outline-none select-none flex items-center`}
        >
          <div>
            {`${
              moment(date[0].startDate)
                ? moment(date[0].startDate).format('YYYY/MM/DD')
                : 'YYYY/MM/DD'
            } to ${
              moment(date[0].endDate)
                ? moment(date[0].endDate).format('YYYY/MM/DD')
                : 'YYYY/MM/DD'
            }`}
          </div>
        </div>
      </div>
      {showPicker && (
        <div
          ref={dropdownRef}
          className={`border-[1px] border-[--gray-line] z-[35] flex p-2 bg-white rounded-lg absolute top-[50px] shadow-2xl right-0 items-center justify-between`}
        >
          <DefinedRange
            ranges={date}
            onChange={handleSelectDate}
            className={``}
          />
          <DateRange
            ranges={date}
            onChange={handleSelectDate}
            maxDate={new Date()}
            dateDisplayFormat={'yyyy/MM/dd'}
            weekStartsOn={1}
            className=""
            classNames={{}}
            showDateDisplay={false}
          />
        </div>
      )}
    </div>
  )
}

export default CustomDateRangePicker