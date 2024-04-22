import React, { FC, ReactNode, useEffect, useRef } from 'react';
import s from './style.module.css';

interface IModalProps {
  children: ReactNode;
  className?: string;
  classNameContainer?: string;
  onClose: () => void;
}

const Modal: FC<IModalProps> = ({ children, className = "", classNameContainer = "", onClose}) => {
	const modalDialogRef = useRef<HTMLDivElement>(null);

		useEffect(() => {
			const handleOutsideClick = (e: globalThis.MouseEvent) => {
				if (
					modalDialogRef.current &&
					e.target instanceof Node &&
					!modalDialogRef.current.contains(e.target)
				) {
					onClose();
				}
			};
		
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					onClose();
				}
			};
		
			document.addEventListener('mousedown', handleOutsideClick);
			document.addEventListener('keydown', handleKeyDown);
		
			return () => {
				document.removeEventListener('mousedown', handleOutsideClick);
				document.removeEventListener('keydown', handleKeyDown);
			};
		}, [onClose]);

  return (
    // TODO: add animation
    <div role="dialog" aria-modal="true" className={`${s['el-overlay-dialog']}`}>
      <div
        className={`${s['el-dialog']} ${s['is-align-center']} ${classNameContainer} rounded-[20px] shadow-none`}
        tabIndex={-1}
        ref={modalDialogRef}
      >
        {/* TODO add header */}
        <div className={`${s['el-dialog__body']} ${className}`}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;