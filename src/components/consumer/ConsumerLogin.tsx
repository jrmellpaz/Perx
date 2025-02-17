'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { motion } from 'framer-motion';
import {
  LoginConsumerInputs,
  loginConsumerSchema,
} from '@/lib/consumer/consumerSchema';
import { FieldErrors, useForm, UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PerxInput from '../custom/PerxInput';
import { loginConsumer } from '@/actions/consumer/auth';
import PerxAlert from '../custom/PerxAlert';
import { LoaderCircle } from 'lucide-react';
import SignInWithGoogle from './SignInWithGoogle';

export default function ConsumerLoginForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginConsumerInputs>({
    resolver: zodResolver(loginConsumerSchema),
  });

  const onSubmit = async (data: LoginConsumerInputs) => {
    setIsLoading(true);
    try {
      const result = await loginConsumer(data);
      if (result?.error) {
        setSubmitError(result.error);
      } else {
        reset();
      }
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
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
        className="flex flex-col justify-between"
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
  register: UseFormRegister<LoginConsumerInputs>;
  errors: FieldErrors<LoginConsumerInputs>;
}) {
  const [showPassword, setShowPassword] = useState(false);

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
          placeholder="juandelacruz@example.com"
          required
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
        <Link href="/recover-password">
          <Button
            variant="link"
            type="button"
            className="font-mono"
            size="noPadding"
          >
            Forgot password?
          </Button>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="showPassword"
          checked={showPassword}
          onCheckedChange={() => setShowPassword((prev) => !prev)}
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
    <div className="flex flex-col gap-4">
      <div className="mt-8 flex w-full justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full text-center transition-all"
        >
          {isLoading ? (
            <>
              <LoaderCircle
                className="-ms-1 animate-spin"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              Logging in...
            </>
          ) : (
            'Log in'
          )}
        </Button>
      </div>
      <Link href="/register">
        <Button
          type="button"
          variant="link"
          className="mt-[-8px] w-full text-center"
        >
          Sign up instead
        </Button>
      </Link>
      <div className="relative text-center text-sm">
        <span className="bg-background text-muted-foreground relative z-14 px-2">
          Or
        </span>
        <div className="border-border absolute inset-0 top-1/2 flex items-center border-t"></div>
      </div>
      <SignInWithGoogle />
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return <p className="mt-1 font-mono text-sm text-red-400">{message}</p>;
}
