'use client';

import {
  Step1Schema,
  Step2Schema,
  Step3Schema,
  MerchantFormInputs,
} from '@/lib/merchant/merchantSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  FieldErrors,
  SubmitHandler,
  useForm,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import Link from 'next/link';
import PerxInput from '../custom/PerxInput';
import PerxTextarea from '../custom/PerxTextarea';
import { signupMerchant } from '@/actions/merchantAuth';
import PerxAlert from '../custom/PerxAlert';
import { LoaderCircle } from 'lucide-react';

const schemas = [Step1Schema, Step2Schema, Step3Schema];

const steps = [
  {
    id: 'Step 1',
    name: 'Fill out business details',
    fields: ['businessName', 'email', 'password', 'confirmPassword'],
  },
  {
    id: 'Step 2',
    name: 'Briefly describe your business',
    fields: ['description', 'address'],
  },
  {
    id: 'Step 3',
    name: 'Upload your logo',
    fields: ['logo'],
  },
];

export default function MerchantRegisterForm() {
  const [previousStep, setPreviousStep] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const delta = currentStep - previousStep;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<MerchantFormInputs>({
    resolver: zodResolver(schemas[currentStep]),
  });

  const processForm: SubmitHandler<MerchantFormInputs> = async () => {
    setIsLoading(true);
    try {
      const data = getValues();
      await signupMerchant(data);
      reset();
      setSubmitError(null);
    } catch (error: unknown) {
      if (error instanceof Error && !error.message.includes('NEXT_REDIRECT')) {
        setSubmitError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  type FieldName = keyof MerchantFormInputs;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const isValidData = await trigger(fields as FieldName[], {
      shouldFocus: true,
    });

    if (isValidData) {
      if (currentStep < steps.length - 1) {
        setPreviousStep(currentStep);
        setCurrentStep((prevStep) => prevStep + 1);
      } else {
        await handleSubmit(processForm)();
      }
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <section className="flex h-full flex-col gap-6">
      <h1 className="text-2xl font-bold">Register business</h1>
      {submitError && (
        <PerxAlert
          heading={'Something went wrong'}
          message="Make sure your inputs are correct."
          variant="error"
        />
      )}
      <Steps currentStep={currentStep} />
      <form
        onSubmit={handleSubmit(processForm)}
        className="flex h-full flex-col justify-between"
      >
        <div className="flex flex-col gap-6">
          {currentStep === 0 && (
            <Step1 register={register} errors={errors} delta={delta} />
          )}
          {currentStep === 1 && (
            <Step2 register={register} errors={errors} delta={delta} />
          )}
          {currentStep === 2 && (
            <Step3
              register={register}
              errors={errors}
              delta={delta}
              watch={watch}
            />
          )}
        </div>
        <Navigation
          next={next}
          prev={prev}
          currentStep={currentStep}
          isLoading={isLoading}
        />
      </form>
    </section>
  );
}

function Steps({ currentStep }: { currentStep: number }) {
  return (
    <nav aria-label="Progress" className="flex flex-col gap-3">
      <ol role="list" className="flex space-x-2">
        {steps.map((step, index) => (
          <li key={step.name} className="basis-full md:flex-1">
            {currentStep > index ? (
              <div className="group bg-perx-blue flex h-2 w-full flex-col rounded-full transition-colors"></div>
            ) : currentStep === index ? (
              <div
                className="group bg-perx-blue flex h-2 w-full flex-col rounded-full transition-colors"
                aria-current="step"
              ></div>
            ) : (
              <div className="group flex h-2 w-full flex-col rounded-full bg-gray-200 transition-colors"></div>
            )}
          </li>
        ))}
      </ol>
      <div className="flex flex-col">
        <span className="text-perx-blue text-sm font-medium">
          {steps[currentStep].id}
        </span>
        <span className="text-xl font-medium">{steps[currentStep].name}</span>
      </div>
    </nav>
  );
}

function Step1({
  register,
  errors,
  delta,
}: {
  register: UseFormRegister<MerchantFormInputs>;
  errors: FieldErrors<MerchantFormInputs>;
  delta: number;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col gap-5"
    >
      <div>
        <PerxInput
          label="Business name"
          type="text"
          placeholder="Business, Inc."
          required
          autofocus
          {...register('businessName')}
        />
        {errors.businessName?.message && (
          <ErrorMessage message={errors.businessName.message} />
        )}
      </div>
      <div>
        <PerxInput
          label="Email address"
          type="email"
          placeholder="business@example.com"
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
        {errors.password?.message ? (
          <ErrorMessage message={errors.password.message} />
        ) : (
          <p className="mt-2 font-mono text-sm text-gray-500">
            Password must be at least 8 characters
          </p>
        )}
      </div>
      <div>
        <PerxInput
          label="Confirm password"
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

function Step2({
  register,
  errors,
  delta,
}: {
  register: UseFormRegister<MerchantFormInputs>;
  errors: FieldErrors<MerchantFormInputs>;
  delta: number;
}) {
  return (
    <motion.div
      initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col gap-5"
    >
      <div>
        <PerxTextarea
          label="Business description"
          placeholder="Tell us about your business"
          required
          autofocus
          {...register('description')}
        />
        {errors.description?.message && (
          <ErrorMessage message={errors.description.message} />
        )}
      </div>
      <div>
        <PerxInput
          label="Address"
          type="text"
          placeholder="123 Main St, Cebu City, Cebu 6000"
          required
          {...register('address')}
        />
        {errors.address?.message && (
          <ErrorMessage message={errors.address.message} />
        )}
      </div>
    </motion.div>
  );
}

function Step3({
  register,
  errors,
  delta,
  watch,
}: {
  register: UseFormRegister<MerchantFormInputs>;
  errors: FieldErrors<MerchantFormInputs>;
  delta: number;
  watch: UseFormWatch<MerchantFormInputs>;
}) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoFile = watch('logo');

  useEffect(() => {
    if (logoFile && logoFile.length > 0) {
      const file = logoFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  }, [logoFile]);

  return (
    <motion.div
      initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col items-center justify-center">
        {logoPreview && (
          <img
            src={logoPreview}
            alt="Your business logo"
            className="border-input aspect-square size-48 rounded-full border object-cover"
          />
        )}
      </div>
      <div>
        <Label htmlFor="logo">Logo</Label>
        <Input
          id="logo"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          placeholder="Attach your business logo"
          {...register('logo')}
          required={logoPreview === null ? true : false}
        />
        {errors.logo?.message ? (
          <ErrorMessage
            message={
              typeof errors.logo.message === 'string'
                ? errors.logo.message
                : 'Something went wrong'
            }
          />
        ) : (
          <p className="mt-2 font-mono text-sm text-gray-500">
            Logo must be in 1:1 &#40;square&#41; aspect ratio
          </p>
        )}
      </div>
    </motion.div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return <p className="mt-1 font-mono text-sm text-red-400">{message}</p>;
}

function Navigation({
  next,
  prev,
  currentStep,
  isLoading,
}: {
  next: () => Promise<void>;
  prev: () => void;
  currentStep: number;
  isLoading: boolean;
}) {
  return (
    <div className="flex justify-end gap-4">
      {currentStep === 0 && (
        <Link href="/merchant/login">
          <Button type="button" variant="link">
            Log in instead
          </Button>
        </Link>
      )}
      {currentStep > 0 && (
        <Button
          type="button"
          onClick={prev}
          disabled={currentStep === 0}
          variant={'outline'}
        >
          Back
        </Button>
      )}
      {currentStep < steps.length - 1 && (
        <Button
          type="button"
          onClick={next}
          className="bg-perx-blue transition-all"
        >
          Next
        </Button>
      )}
      {currentStep === steps.length - 1 && (
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-perx-blue transition-all"
        >
          {isLoading ? (
            <>
              <LoaderCircle
                className="-ms-1 animate-spin"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              Registering
            </>
          ) : (
            'Register business'
          )}
        </Button>
      )}
    </div>
  );
}
