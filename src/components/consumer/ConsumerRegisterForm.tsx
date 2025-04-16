'use client';

import {
  Step1Schema,
  Step2Schema,
  Step3Schema,
  ConsumerFormInputs,
} from '@/lib/consumerSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  FieldErrors,
  SubmitHandler,
  useForm,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from 'react-hook-form';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import Link from 'next/link';
import PerxInput from '../custom/PerxInput';
import { signupConsumer, checkReferrer } from '@/actions/consumerAuth';
import PerxAlert from '../custom/PerxAlert';
import { LoaderCircle } from 'lucide-react';
import PerxCheckbox from '../custom/PerxCheckbox';
import { couponCategories } from '@/lib/couponSchema';

const schemas = [Step1Schema, Step2Schema, Step3Schema];

const steps = [
  {
    id: 'Step 1',
    name: 'Fill out personal details',
    fields: ['name', 'email', 'password', 'confirmPassword'],
  },
  {
    id: 'Step 2',
    name: 'Referral Code',
    fields: ['referrer_code'],
  },
  {
    id: 'Step 3',
    name: 'Choose your interests',
    fields: ['interests'],
  },
];

export default function ConsumerRegisterForm() {
  const [previousStep, setPreviousStep] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [referrerExists, setReferrerExists] = useState<boolean | null>(null);
  const delta = currentStep - previousStep;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ConsumerFormInputs>({
    resolver: zodResolver(schemas[currentStep]),
    defaultValues: {
      interests: [],
    },
  });

  const processForm: SubmitHandler<ConsumerFormInputs> = async () => {
    setIsLoading(true);
    try {
      console.log('hereee');
      const data = getValues();
      console.log(data);

      if (data.referrerCode) {
        const isValidReferrer = await checkReferrer(data.referrerCode);
        if (!isValidReferrer) {
          setSubmitError('Invalid referral code');
          return;
        }
      }
      await signupConsumer(data);
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

  type FieldName = keyof ConsumerFormInputs;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const isValidData = await trigger(fields as FieldName[], {
      shouldFocus: true,
    });

    if (!isValidData) return; // Prevent next step if validation fails

    if (currentStep === 1) {
      const referrerCode = getValues('referrerCode');
      if (referrerCode && referrerExists === false) {
        setSubmitError('Invalid referral code');
        return; // Stop next step if referral code is invalid
      }
    }

    if (currentStep < steps.length - 1) {
      setPreviousStep(currentStep);
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      await handleSubmit(processForm)();
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
      <h1 className="text-2xl font-bold">Sign up</h1>
      {submitError && (
        <PerxAlert
          heading={submitError}
          message="Make sure your inputs are correct."
          variant="error"
        />
      )}
      <Steps currentStep={currentStep} />
      <form
        onSubmit={handleSubmit(processForm)}
        className="flex h-full flex-col justify-between gap-4"
      >
        <div className="flex flex-col gap-6">
          {currentStep === 0 && (
            <Step1 register={register} errors={errors} delta={delta} />
          )}
          {currentStep === 1 && (
            <Step2
              register={register}
              watch={watch}
              delta={delta}
              referrerExists={referrerExists}
              setReferrerExists={setReferrerExists}
            />
          )}
          {currentStep === 2 && (
          <div className="max-h-[300px] overflow-y-auto">
            <Step3
              register={register}
              errors={errors}
              delta={delta}
              watch={watch}
              setValue={setValue}
            />
          </div>
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
  register: UseFormRegister<ConsumerFormInputs>;
  errors: FieldErrors<ConsumerFormInputs>;
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
          label="Name"
          type="text"
          placeholder="Juan Dela Cruz"
          required
          {...register('name')}
        />
        {errors.name?.message && <ErrorMessage message={errors.name.message} />}
      </div>
      <div>
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
  watch,
  delta,
  referrerExists,
  setReferrerExists,
}: {
  register: UseFormRegister<ConsumerFormInputs>;
  watch: UseFormWatch<ConsumerFormInputs>;
  delta: number;
  referrerExists: boolean | null;
  setReferrerExists: (exists: boolean | null) => void;
}) {
  // const [referrerCode, setReferrerCode] = useState('');
  // const [debouncedReferrerCode] = useDebounce(referrerCode, 500); // Delay API call by 500ms

  const referrerCode = watch('referrerCode');
  const [debouncedCode, setDebouncedCode] = useState(referrerCode);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCode(referrerCode);
    }, 300); // Delay API call by 500ms

    return () => clearTimeout(handler);
  }, [referrerCode]);

  useEffect(() => {
    if (!debouncedCode?.trim()) {
      setReferrerExists(null);
      return;
    }

    const verifyReferrer = async () => {
      setReferrerExists(null);
      const exists = await checkReferrer(debouncedCode);
      setReferrerExists(exists);
    };

    verifyReferrer();
  }, [debouncedCode, setReferrerExists]);

  return (
    <motion.div
      initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col gap-5"
    >
      <div>
        <PerxInput
          label="Enter code (Optional)"
          type="text"
          placeholder="IpSuM123"
          {...register('referrerCode')}
        />
        {referrerExists === false && (
          <ErrorMessage message="Invalid referral code" />
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
  setValue,
}: {
  register: UseFormRegister<ConsumerFormInputs>;
  errors: FieldErrors<ConsumerFormInputs>;
  delta: number;
  watch: UseFormWatch<ConsumerFormInputs>;
  setValue: UseFormSetValue<ConsumerFormInputs>;
}) {
  const [interests, setInterests] = useState<string[]>([]);
  const selectedInterests = watch('interests', []) || [];

  useEffect(() => {
    setInterests([...couponCategories]);
    setValue('interests', []);
  }, [setValue]);

  const handleCheckboxChange = (interest: string, checked: boolean) => {
    if (checked) {
      setValue('interests', [...selectedInterests, interest]);
    } else {
      setValue(
        'interests',
        selectedInterests.filter((item) => item !== interest)
      );
    }
  };

  return (
    <motion.div
      initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col gap-6"
    >
      <div>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest) => (
            <label key={interest} className="flex items-center gap-2">
              <PerxCheckbox
                label={interest}
                checked={selectedInterests.includes(interest)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(interest, checked)
                }
              />
            </label>
          ))}
        </div>
        {errors.interests?.message && (
          <ErrorMessage message={errors.interests.message} />
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
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        next();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [next]);

  return (
    <div className="flex justify-end gap-4">
      {currentStep === 0 && (
        <Link href="/login">
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
              Registering...
            </>
          ) : (
            'Register'
          )}
        </Button>
      )}
    </div>
  );
}
