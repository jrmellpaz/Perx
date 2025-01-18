'use client';

import {
  Step1Schema,
  Step2Schema,
  Step3Schema,
  Inputs,
} from '@/lib/consumerSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';

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
    fields: ['code'],
  },
  {
    id: 'Step 3',
    name: 'Choose your interests',
    fields: ['interests'],
  },
];

export default function ConsumerRegisterForm() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schemas[currentStep]),
    defaultValues: {
      interests: [], // Default value as an empty array
    },
  });

  const processForm: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    reset();
  };

  type FieldName = keyof Inputs;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const isValidData = await trigger(fields as FieldName[], {
      shouldFocus: true,
    });

    if (isValidData && currentStep < steps.length - 1) {
      if (currentStep === steps.length - 1) {
        await handleSubmit(processForm)();
      }

      setPreviousStep(currentStep);
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <section className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <Steps currentStep={currentStep} />
        <form onSubmit={handleSubmit(processForm)}>
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
        </form>
      </div>
      <Navigation next={next} prev={prev} currentStep={currentStep} />
    </section>
  );
}

function Steps({ currentStep }: { currentStep: number }) {
  return (
    <nav aria-label="Progress" className="flex flex-col gap-3">
      <ol role="list" className="space-x-2 flex">
        {steps.map((step, index) => (
          <li key={step.name} className="md:flex-1 basis-full">
            {currentStep > index ? (
              <div className="group flex w-full flex-col h-2 rounded-full bg-sky-600 transition-colors"></div>
            ) : currentStep === index ? (
              <div
                className="group flex w-full flex-col h-2 rounded-full bg-sky-600 transition-colors"
                aria-current="step"
              ></div>
            ) : (
              <div className="group flex w-full flex-col h-2 rounded-full bg-gray-200 transition-colors"></div>
            )}
          </li>
        ))}
      </ol>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-sky-600">
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
  register: UseFormRegister<Inputs>;
  errors: FieldErrors<Inputs>;
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
      className="flex flex-col gap-3"
    >
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Juan Dela Cruz"
          {...register('name')}
          required
        />
        {errors.name?.message && <ErrorMessage message={errors.name.message} />}
      </div>
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="juandelacruz@example.com"
          {...register('email')}
          required
        />
        {errors.email?.message && (
          <ErrorMessage message={errors.email.message} />
        )}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          {...register('password')}
          required
        />
        {errors.password?.message ? (
          <ErrorMessage message={errors.password.message} />
        ) : (
          <p className="font-mono mt-2 text-sm text-gray-500">
            Password must be at least 8 characters
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          {...register('confirmPassword')}
          required
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
          className="text-sm mt-[1px] cursor-pointer"
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
  register: UseFormRegister<Inputs>;
  errors: FieldErrors<Inputs>;
  delta: number;
}) {
  return (
    <motion.div
      initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col gap-3"
    >
      <div>
        <Label htmlFor="code">Referral code</Label>
        <Input
          id="code"
          type="text"
          placeholder="Enter your referral code"
          {...register('code')}
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
  register: UseFormRegister<Inputs>;
  errors: FieldErrors<Inputs>;
  delta: number;
  watch: UseFormWatch<Inputs>;
}) {
  const interests = [
    'Shopping',
    'Coffee',
    'Shoes',
    'Clothes',
    'Food',
    'Others',
  ];
  const selectedInterests = watch('interests', []); // Dynamically track selected interests
  const showOtherInput = selectedInterests.includes('Others');

  return (
    <motion.div
      initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col gap-6"
    >
      <h2 className="text-xl font-bold text-center">Choose your Interests</h2>
      <div className="flex flex-col gap-4">
        {interests.map((interest) => (
          <label
            key={interest}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              value={interest}
              {...register('interests')}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-base">{interest}</span>
          </label>
        ))}

        {showOtherInput && (
          <div className="mt-2">
            <label
              htmlFor="otherInterest"
              className="block text-sm font-medium"
            >
              Specify your interest:
            </label>
            <input
              id="otherInterest"
              type="text"
              placeholder="Enter your interest"
              {...register('otherInterest')}
              className="w-full border rounded-md p-2 mt-1"
            />
            {errors.otherInterest && (
              <p className="text-red-500 text-sm mt-1">
                {errors.otherInterest.message?.toString()}
              </p>
            )}
          </div>
        )}
      </div>
      {errors.interests && (
        <p className="text-red-500 text-sm">
          {errors.interests.message?.toString() ||
            'Please select at least one interest.'}
        </p>
      )}
    </motion.div>
  );
}

// function Step4() {
// 	return (
// 		<h1>Done!!</h1>
// 	)
// }

function ErrorMessage({ message }: { message: string }) {
  return <p className="font-mono mt-1 text-sm text-red-400">{message}</p>;
}

function Navigation({
  next,
  prev,
  currentStep,
}: {
  next: () => Promise<void>;
  prev: () => void;
  currentStep: number;
}) {
  return (
    <div className="flex justify-end gap-4">
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
      {currentStep <= steps.length - 1 && (
        <Button
          type={currentStep === steps.length - 1 ? 'submit' : 'button'}
          onClick={next}
        >
          {currentStep === steps.length - 1 ? 'Sign up' : 'Next'}
        </Button>
      )}
    </div>
  );
}
