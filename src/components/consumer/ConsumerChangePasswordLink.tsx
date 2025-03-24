'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { updateConsumerPassword } from '@/actions/consumer/profile';
import PerxAlert from '../custom/PerxAlert';
import { LoaderCircle } from 'lucide-react';

export default function ChangePasswordButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateConsumerPassword();
      console.log('Link sent');
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <form
      className="flex w-full max-w-[800px] flex-col gap-4 px-2"
      onSubmit={handleSubmit}
    >
      {isSuccess && (
        <PerxAlert
          variant="success"
          heading="Link successfully sent 🎉"
          message="Check your email for the link."
        />
      )}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-medium">Change password?</h1>
        <p>A redirect link will be set to your email.</p>
      </div>
      {!isSuccess && (
        <Button type="submit" disabled={isLoading} className="transition-all">
          {isLoading ? (
            <>
              <LoaderCircle
                className="-ms-1 animate-spin"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              Send redirect link
            </>
          ) : (
            'Send redirect link'
          )}
        </Button>
      )}
    </form>
  );
}
