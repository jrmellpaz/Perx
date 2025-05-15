'use client';

import {
  Archive,
  EllipsisVertical,
  FileWarning,
  LoaderCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown';
import { toast } from 'sonner';
import { archiveCoupon } from '@/actions/coupon';
import { useRef, useState } from 'react';
import { Button } from '../ui/button';

export function ArchiveDropdown({ couponId }: { couponId: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const openDialog = () => {
    setIsDialogOpen(true);
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      dialogRef.current?.close();
    }, 300);
  };

  const handleArchiveCoupon = async () => {
    try {
      setIsLoading(true);
      await archiveCoupon(couponId);
      dialogRef.current?.close();
      closeDialog();
      setIsLoading(false);
      toast.success('Coupon archived successfully!');
    } catch (error) {
      console.error('Error archiving coupon:', error);
      toast.error('Failed to archive coupon. Please try again.');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="hover:bg-muted/10 cursor-pointer rounded-full p-2 outline-none">
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-4 p-0 py-2">
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-4 p-3 hover:bg-black/10"
            onClick={openDialog}
          >
            <Archive />
            <span>Archive coupon</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <dialog
        ref={dialogRef}
        className={`bg-perx-white fixed inset-0 m-auto w-9/10 rounded-lg shadow-lg transition-all duration-300 sm:max-w-[600px] ${
          isDialogOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            closeDialog();
          }
        }}
      >
        <div className="flex size-full flex-col p-8">
          <div className="flex flex-col gap-2">
            <h3 className="mb-2 flex items-center gap-2 font-mono text-lg font-medium text-red-500">
              <FileWarning />
              This action cannot be undone
            </h3>
            <p className="text-perx-black text-sm">
              Once you archive this coupon, you can no longer unarchive it. The
              coupon will no longer be available to customers, but you can still
              view it in your archived coupons list. Are you sure you want to
              archive this coupon?
            </p>
          </div>
          <div className="mt-12 flex justify-end gap-2">
            <Button
              variant={'secondary'}
              className="rounded-md bg-neutral-200 px-4 py-2 text-sm hover:bg-neutral-300"
              onClick={closeDialog}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={handleArchiveCoupon}
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
                  Archiving coupon
                </>
              ) : (
                'Archive coupon'
              )}
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
