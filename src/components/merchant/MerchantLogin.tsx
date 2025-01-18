'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { motion } from 'framer-motion';
import {
  LoginMerchantInputs,
  loginMerchantSchema,
} from '@/lib/merchantAuth/merchantSchema';
import { FieldErrors, useForm, UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginMerchant } from '@/action/merchant';

export default function MerchantLoginForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginMerchantInputs>({
    resolver: zodResolver(loginMerchantSchema),
  });

  const onSubmit = async (data: LoginMerchantInputs) => {
    try {
      await loginMerchant(data);
      reset();
      setSubmitError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('An unknown error occurred');
      }
    }
  };

  return (
    <section className="flex flex-col gap-6 h-full">
      <h1 className="text-2xl font-bold">Log in</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col h-full justify-between"
      >
        <InputFields register={register} errors={errors} />
        {submitError && <ErrorMessage message={submitError} />}
        <ButtonGroup />
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
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="business@example.com"
          {...register('email')}
          required
        />
        {errors.email?.message && (
          <ErrorMessage message={errors.email.message} />
        )}
      </div>
      <div>
        <div className="flex flex-row items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/merchant/recover-password">
            <Button variant="link" type="button">
              Forgot password?
            </Button>
          </Link>
        </div>
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          {...register('password')}
          required
        />
        {errors.password?.message && (
          <ErrorMessage message={errors.password.message} />
        )}
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
          className="text-sm mt-[1px] cursor-pointer"
        >
          Show password
        </Label>
      </div>
    </motion.div>
  );
}

function ButtonGroup() {
  return (
    <div className="flex justify-end gap-4">
      <Link href="/merchant/register">
        <Button type="button" variant="link">
          Register business instead
        </Button>
      </Link>
      <Button type="submit">Log in</Button>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return <p className="font-mono mt-1 text-sm text-red-400">{message}</p>;
}
