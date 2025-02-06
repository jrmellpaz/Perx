'use client';

import {
  Step1Schema,
  Step2Schema,
  Step3Schema,
  ConsumerFormInputs,
} from '@/lib/consumerAuth/consumerSchema';
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
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import Link from 'next/link';
import PerxInput from '../../custom/PerxInput';
import { signupConsumer } from '@/actions/consumer/auth';
import PerxAlert from '../../custom/PerxAlert';
import { LoaderCircle } from 'lucide-react';

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
    fields: ['referralCode'],
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
  const delta = currentStep - previousStep;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<ConsumerFormInputs>({
    resolver: zodResolver(schemas[currentStep]),
  });

  const processForm: SubmitHandler<ConsumerFormInputs> = async () => {
    setIsLoading(true);
    try {
      const data = getValues();
      console.log(data);
      await signupConsumer(data);
      reset();
      setSubmitError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('An unknown error occurred');
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
      <h1 className="text-2xl font-bold">Sign up</h1>
      {submitError && (
        <PerxAlert
          heading={submitError}
          message="Make sure your email and password are correct."
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
            <Step2 register={register}  delta={delta} />
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
        {errors.name?.message && (
          <ErrorMessage message={errors.name.message} />
        )}
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
  delta,
}: {  register: UseFormRegister<ConsumerFormInputs>;
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
        <PerxInput
          label="Enter Code "
          type = "text"
          placeholder="IpSuM123"
          {...register('referralCode')}
        />
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
  register: UseFormRegister<ConsumerFormInputs>;
  errors: FieldErrors<ConsumerFormInputs>;
  delta: number;
  watch: UseFormWatch<ConsumerFormInputs>;
}) {
  const [customInterests, setCustomInterests] = useState<string[]>([]);
  const selectedInterests = watch('interests') || [];
  const interests = [
    'Shopping',
    'Coffee',
    'Shoes',
    'Clothes',
    'Food',
    'Others',
  ];
  const addCustomInterest = () => {
    setCustomInterests([...customInterests, '']);
  };

  const removeCustomInterest = (index: number) => {
    setCustomInterests(customInterests.filter((_, i) => i !== index));
  };

  const handleCustomInterestChange = (index: number, value: string) => {
    const newCustomInterests = [...customInterests];
    newCustomInterests[index] = value;
    setCustomInterests(newCustomInterests);
  };

  return (
    <motion.div
      initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col gap-6"
    >
      <div>
        <div className="flex flex-col gap-2">
          {interests.map((interest) => (
            <label key={interest} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={interest}
                {...register('interests')}
              />
              {interest}
            </label>
          ))}
        </div>
        {selectedInterests.includes('Others') && (
          <div className="mt-2">
            {customInterests.map((interest, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="text"
                  value={interest}
                  onChange={(e) => handleCustomInterestChange(index, e.target.value)}
                />
                <button type="button" onClick={() => removeCustomInterest(index)}>X</button>
              </div>
            ))}
            <button type="button" onClick={addCustomInterest}>+ Add More</button>
          </div>
        )}
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
