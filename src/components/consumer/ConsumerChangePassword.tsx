'use client';

import { useState } from 'react';
import PerxInput from '../custom/PerxInput';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { motion } from 'framer-motion';
import { FieldErrors, useForm, UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePassword } from '@/actions/consumerAuth';
import { LoaderCircle } from 'lucide-react';
import PerxAlert from '../custom/PerxAlert';
import { redirect } from 'next/navigation';

import {
  type ChangePasswordInputs,
  changePasswordSchema,
} from '@/lib/merchantSchema';

export default function ConsumerChangePassword() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordInputs>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordInputs) => {
    setIsLoading(true);
    setIsError(false);
    setSuccess(false);
    try {
      const { password, confirmPassword } = data;

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      await changePassword(confirmPassword);
      console.log('done');
      reset();
      !isError && setSuccess(true);
      redirect('/login');
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        !error.message.includes(
          'supabase.auth.getSession() or from some supabase.auth.onAuthStateChange()'
        ) &&
        !error.message.includes('NEXT_REDIRECT')
      ) {
        setIsError(true);
        console.error('Error changing password:', error.message);
      }
    } finally {
      setIsLoading(false);

      if (!isError) {
        redirect('/login');
      }
    }
  };

  return (
    <section className="flex h-full flex-col gap-6">
      <h1 className="text-2xl font-bold">Change password</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full flex-col justify-between"
      >
        <div className="flex flex-col gap-6">
          {isError && <PerxAlert variant="error" heading="An error occurred" />}
          {success && !isError && (
            <PerxAlert
              variant="success"
              message="You're all set. Redirecting you to login."
              heading="Successfully changed password 🔐"
            />
          )}
          <InputGroup register={register} errors={errors} />
        </div>
        <div className="flex w-full justify-end">
          {!success && (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoaderCircle
                    className="-ms-1 animate-spin"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Change password
                </>
              ) : (
                'Change password'
              )}
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}

function InputGroup({
  register,
  errors,
}: {
  register: UseFormRegister<ChangePasswordInputs>;
  errors: FieldErrors<ChangePasswordInputs>;
}) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <motion.div
      initial={{ x: '50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-0.5">
        <PerxInput
          label="New password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          required
          {...register('password')}
        />
        {errors.password?.message ? (
          <ErrorMessage message={errors.password.message} />
        ) : (
          <p className="mt-2 font-mono text-sm text-gray-500">
            Password must be at least 8 characters
          </p>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <PerxInput
          label="Confirm new password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          required
          {...register('confirmPassword')}
        />
        {errors.confirmPassword?.message && (
          <ErrorMessage message={errors.confirmPassword.message} />
        )}
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="showPassword"
          className="transition-all"
          checked={showPassword}
          onCheckedChange={() => setShowPassword(!showPassword)}
        />
        <Label
          htmlFor="showPassword"
          className="mt-[1px] cursor-pointer text-sm"
        >
          Show password
        </Label>
      </div>
    </motion.div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return <p className="mt-1 font-mono text-sm text-red-400">{message}</p>;
}
