import React, { FC, useEffect, useRef, useState } from "react";
import s from "./style.module.css";
import { IDropdownItem } from "@/data/wl-types";
import Dropdown from "assets/svg/DropdownIcon.svg";
import CheckedIcon from "assets/svg/Checked.svg";
import { generateUID } from "@/utils/function";
import Image from "next/image";

export interface IMultiSelectProps {
  onChange?: (val: IDropdownItem[]) => void;
  list: IDropdownItem[];
  label: string;
  dropdownIcon?: string;
  value?: IDropdownItem[];
  className?: string;
  placeholder?: string;
  required?: boolean;
  startIcon?: string;
  error?: boolean;
  labelError?: string;
  hint?: string;
  textHidden?: boolean;
  onClick?: () => void;
  loading?: boolean;
  limit: number;
}

const MultiSelect: FC<IMultiSelectProps> = ({
  list = [],
  label = "",
  onChange,
  dropdownIcon,
  value = [],
  className = "",
  placeholder = "",
  required = false,
  startIcon,
  error = false,
  labelError,
  hint = "",
  textHidden = false,
  onClick,
  loading = false,
  limit = 3,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<IDropdownItem[]>(value);
  const uid = useRef(generateUID());

  const renderDropdownRow = (id: string | number, name: string, isEmpty: boolean = false) => {
    return (
      <div
        onClick={() => {
          if (!isEmpty) {
            setOpen(false);
            selected.some((item) => item.id === id) ? handleUnselect(id) : handleSelect(id);
          }
        }}
        className={`relative bg-white p-[12px] flex space-x-2 justify-between items-center ${
          selected.length < limit || selected.some((item) => item.id === id) ? "cursor-pointer" : "cursor-not-allowed"
        } select-none text-[16px] leading-[18.75px] text-[--gray-text] ${
          selected.some((item) => item.id === id) ? "font-[700]" : "font-[400]"
        } whitespace-nowrap ${isEmpty ? "" : "hover:bg-[--gray-bg-tag]"}`}
        key={id}
      >
        {name}
        {selected.some((item) => item.id === id) && <Image src={CheckedIcon} alt="" />}
      </div>
    );
  };

  const handleSelect = (id: string | number) => {
    if (selected.length < limit) {
      const selectedItem = list.find((item) => item.id === id);
      if (selectedItem) {
        const newSelected: IDropdownItem[] = [...selected, ...[selectedItem]];
        setSelected(newSelected);
        onChange && onChange(newSelected);
      }
    }
  };

  const handleUnselect = (id: string | number) => {
    const newSelected = selected.filter((i) => i.id !== id);
    setSelected(newSelected);
    onChange && onChange(newSelected);
  };

  const renderSelected = () => {
    return (
      <div tabIndex={-1} className="w-full whitespace-normal flex items-center flex-wrap cursor-pointer space-x-[11px]">
        {selected.map((item, idx) => (
          <div key={idx} className="box-border">
            <div className="text-[--el-color-info] px-[9px] h-[24px] space-x-[6px] flex items-center justify-center bg-[#F4F4F5] rounded-[4px]">
              {item.name}
              <div
                className="w-[15px] h-[15px] p-[1px] rounded-[50%] cursor-pointer hover:bg-[#91949A] hover:text-white"
                onClick={() => handleUnselect(item.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                  <path
                    className="fill-current"
                    d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleClickOutSideDropdown = (e: any) => {
    if (dropdownRef.current && inputRef.current) {
      const dropdownBox = dropdownRef.current.getBoundingClientRect();
      const inputBox = inputRef.current.getBoundingClientRect();
      if (
        e.x < dropdownBox.x ||
        e.x > (inputBox.width < dropdownBox.width ? dropdownBox.x + dropdownBox.width : inputBox.x + inputBox.width) ||
        e.y < inputBox.y ||
        e.y > dropdownBox.y + dropdownBox.height
      ) {
        setOpen(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutSideDropdown);

    return () => window.removeEventListener("mousedown", handleClickOutSideDropdown);
  }, [dropdownRef, inputRef]);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  return (
    <div className={`flex flex-col items-stretch space-y-3 box-border ${className}`}>
      <div className="text-[14px] leading-[14px] flex items-center space-x-1">
        <label htmlFor={uid + ""}>{label}</label>
        {required && <div className="text-[--state-error]">*</div>}
      </div>
      <div className="relative " id={uid + ""}>
        <div
          className={`outline-none border-[1px] border-[--gray-line] px-[10px] py-[9px] bg-white rounded-[4px] cursor-pointer h-[44px] flex items-center ${
            error ? "!border-[--state-error]" : ""
          }`}
          onClick={() => {
            setOpen(!open);
            onClick && onClick();
          }}
          ref={inputRef}
        >
          <div className="flex justify-between items-center space-x-3 w-full">
            {startIcon && <Image src={startIcon} alt="" className="cursor-default w-[24px] h-[24px] object-contain" />}
            <div className={`font-[400] text-[15px] leading-[15px] text-[--gray-text] select-none flex-1`}>
              {!textHidden ? selected.length > 0 ? renderSelected() : <>{placeholder}</> : <></>}
            </div>
            <Image
              src={dropdownIcon || Dropdown}
              className={`h-[24px] w-[24px] object-contain transform duration-300 ${open ? "rotate-180" : ""}`}
              alt=""
              onClick={() => {
                onClick && onClick();
                setOpen(!open);
              }}
            />
          </div>
        </div>
        {error && labelError && labelError !== "" && (
          <div className="text-[10px] leading-[10px] text-[--state-error] mt-[2px]">{labelError}</div>
        )}
        {hint && hint !== "" && <div className="text-[10px] text-[--gray] leading-[10px] mt-[2px]">{hint}</div>}
        <div
          ref={dropdownRef}
          className={`w-full bg-white rounded-[4px] border-[1px] border-[--gray-line] ${
            open
              ? `transform h-[${list.length > 0 ? "fit-content" : "44px"}] duration-300 flex`
              : "transform duration-300 h-0 hidden"
          } 
        flex-col items-stretch max-h-[242px] ${
          list.length * 44 >= 242 ? "overflow-y-auto" : "overflow-y-hidden"
        } overflow-x-hidden absolute z-30 left-0 top-[${58 + (error ? 12 : 0) + (hint !== "" ? 12 : 0)}px] 
        shadow-[_-12px_17px_24px_0px_#4B4B7140] ${s.scrollBar}`}
        >
          {loading
            ? renderDropdownRow("-1", "Loading...", true)
            : list.length > 0
            ? list.map((item) => <div key={item.id}>{renderDropdownRow(item.id, item.name)}</div>)
            : renderDropdownRow("-1", "Loading...", true)}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
