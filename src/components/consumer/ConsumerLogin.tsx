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
} from '@/lib/consumerAuth/consumerSchema';
import { FieldErrors, useForm, UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PerxInput from '../custom/PerxInput';
import { loginConsumer } from '@/actions/consumer/auth';
import PerxAlert from '../custom/PerxAlert';
import { LoaderCircle } from 'lucide-react';
import SignInWithGoogle from './SignInWithGoogle';
import SignInWithFacebook from './SignInWithFacebook';

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
      await loginConsumer(data);
      reset();
      setSubmitError(null);
    } catch (error: unknown) {
      setSubmitError(error instanceof Error ? error.message : 'An unknown error occurred');
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between">
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
        <PerxInput label="Email address" type="email" placeholder="juandelacruz@example.com" required {...register('email')} />
        {errors.email?.message && <ErrorMessage message={errors.email.message} />}
      </div>
      <div>
        <PerxInput label="Password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" required {...register('password')} />
        {errors.password?.message && <ErrorMessage message={errors.password.message} />}
        <Link href="/recover-password">
          <Button variant="link" type="button" className="font-mono" size="noPadding">
            Forgot password?
          </Button>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="showPassword" checked={showPassword} onCheckedChange={() => setShowPassword((prev) => !prev)} />
        <Label htmlFor="showPassword" className="mt-[1px] cursor-pointer text-sm">
          Show password
        </Label>
      </div>
    </motion.div>
  );
}

function ButtonGroup({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end w-full mt-8">
        <Button type="submit" disabled={isLoading} className="w-full text-center transition-all">
          {isLoading ? (
            <>
              <LoaderCircle className="-ms-1 animate-spin" size={16} strokeWidth={2} aria-hidden="true" />
              Logging in...
            </>
          ) : (
            'Log in'
          )}
        </Button>
      </div>
      <Link href="/register">
        <Button type="button" variant="link" className="w-full text-center mt-[-8px]">
          Sign up instead
        </Button>
      </Link>
      <div className="relative text-center text-sm">
        <span className="relative z-14 bg-background px-2 text-muted-foreground">Or continue with</span>
        <div className="absolute inset-0 flex items-center border-t border-border top-1/2"></div>
      </div>

      {/* <Button variant="outline" className="w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 mr-2">
          <path
            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            fill="currentColor"
          />
        </svg>
        Login with GitHub
      </Button> */}
      <SignInWithFacebook />
      <SignInWithGoogle />
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return <p className="mt-1 font-mono text-sm text-red-400">{message}</p>;
}
