'use client';

import { useRef } from 'react';
import { Button } from '../ui/button';
import { LoaderCircle } from 'lucide-react';

interface PerxDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  isLoading?: boolean;
}

export default function PerxDialog({
  isOpen,
  onClose,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  isLoading = false,
}: PerxDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <dialog
      ref={dialogRef}
      className={`bg-perx-white fixed inset-0 m-auto rounded-lg p-8 shadow-lg transition-all duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
      }`}
    >
      <div className="flex flex-col gap-2">
        <h3 className="mb-4 font-mono text-lg font-medium">{title}</h3>
        <div>{children}</div>
      </div>
      <div className="mt-8 flex justify-end gap-2">
        <Button
          variant={'secondary'}
          className="rounded-md bg-neutral-200 px-4 py-2 text-sm hover:bg-neutral-300"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        {onConfirm && (
          <Button
            disabled={isLoading}
            onClick={onConfirm}
            className="transition-all"
          >
            {isLoading ? (
              <>
                <LoaderCircle
                  className="-ms-1 animate-spin"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                {confirmText}
              </>
            ) : (
              confirmText
            )}
          </Button>
        )}
      </div>
    </dialog>
    // <dialog
    //   ref={dialogRef}
    //   className={`fixed inset-0 m-auto p-8 transition-all duration-300 ${
    //     isOpen
    //       ? 'scale-100 opacity-100'
    //       : 'pointer-events-none scale-90 opacity-0'
    //   }`}
    //   open={isOpen}
    // >
    //   <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
    //     <h3 className="text-lg font-medium">{title}</h3>
    //     <div className="mt-4">{children}</div>
    //     <div className="mt-6 flex justify-end gap-2">
    //       <Button
    //         variant={'secondary'}
    //         className="rounded-md bg-neutral-200 px-4 py-2 text-sm hover:bg-neutral-300"
    //         onClick={onClose}
    //         disabled={isLoading}
    //       >
    //         {cancelText}
    //       </Button>
    //       {onConfirm && (
    //         <Button
    //           disabled={isLoading}
    //           onClick={onConfirm}
    //           className="transition-all"
    //         >
    //           {isLoading ? (
    //             <>
    //               <LoaderCircle
    //                 className="-ms-1 animate-spin"
    //                 size={16}
    //                 strokeWidth={2}
    //                 aria-hidden="true"
    //               />
    //               {confirmText}
    //             </>
    //           ) : (
    //             'Send redirect link'
    //           )}
    //         </Button>
    //       )}
    //     </div>
    //   </div>
    // </dialog>
  );
}
