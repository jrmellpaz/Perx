'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { motion } from 'framer-motion';
import { LoginMerchantInputs, loginMerchantSchema } from '@/lib/merchantSchema';
import { FieldErrors, useForm, UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PerxInput from '../custom/PerxInput';
import { loginMerchant } from '@/actions/merchantAuth';
import PerxAlert from '../custom/PerxAlert';
import { LoaderCircle } from 'lucide-react';

export default function MerchantLoginForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginMerchantInputs>({
    resolver: zodResolver(loginMerchantSchema),
  });

  const onSubmit = async (data: LoginMerchantInputs) => {
    setIsLoading(true);
    try {
      await loginMerchant(data);
      reset();
      setSubmitError(null);
    } catch (error: unknown) {
      if (error instanceof Error && !error.message.includes('NEXT_REDIRECT')) {
        setSubmitError('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex h-full flex-col gap-8">
      <h1 className="text-2xl font-bold">Log in</h1>
      {submitError && (
        <PerxAlert
          heading={submitError}
          message="Make sure your email and password are correct."
          variant="error"
        />
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full flex-col justify-between"
      >
        <InputFields register={register} errors={errors} />
        <ButtonGroup isLoading={isLoading} />
      </form>
    </section>
  );
}

function InputFields({
  register,
  errors,
}: {
  register: UseFormRegister<LoginMerchantInputs>;
  errors: FieldErrors<LoginMerchantInputs>;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ x: '50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <PerxInput
          label="Email address"
          type="email"
          placeholder="business@example.com"
          required
          autofocus={true}
          {...register('email')}
        />
        {errors.email?.message && (
          <ErrorMessage message={errors.email.message} />
        )}
      </div>
      <div>
        <PerxInput
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          required
          {...register('password')}
        />
        {errors.password?.message && (
          <ErrorMessage message={errors.password.message} />
        )}
        <Link href="/merchant/recover-password">
          <Button
            variant="link"
            type="button"
            className="font-mono"
            size={'noPadding'}
          >
            Forgot password?
          </Button>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="showPassword"
          className="transition-all"
          checked={showPassword}
          onCheckedChange={handleShowPassword}
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

function ButtonGroup({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="flex justify-end gap-4">
      <Link href="/merchant/register">
        <Button type="button" variant="link">
          Register business instead
        </Button>
      </Link>
      <Button type="submit" disabled={isLoading} className="transition-all">
        {isLoading ? (
          <>
            <LoaderCircle
              className="-ms-1 animate-spin"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            Log in
          </>
        ) : (
          'Log in'
        )}
      </Button>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return <p className="mt-1 font-mono text-sm text-red-400">{message}</p>;
}
