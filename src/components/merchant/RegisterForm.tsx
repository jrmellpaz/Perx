"use client"

import { Step1Schema, Step2Schema, Step3Schema, Inputs } from "@/lib/merchantSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FieldErrors, SubmitHandler, useForm, UseFormRegister, UseFormWatch } from "react-hook-form"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"

const schemas = [Step1Schema, Step2Schema, Step3Schema];

const steps = [
	{
		id: "Step 1",
		name: "Fill out business details",
		fields: ["businessName", "email", "password", "confirmPassword"],
	},
	{
		id: "Step 2",
		name: "Briefly describe your business",
		fields: ["description", "address"],
	},
	{
		id: "Step 3",
		name: "Upload your logo",
		fields: ["logo"],
	}
]

export default function MerchantRegisterForm() {
	const [previousStep, setPreviousStep] = useState(0)
	const [currentStep, setCurrentStep] = useState(0)
	const delta = currentStep - previousStep

	const {
		register,
		handleSubmit,
		watch,
		reset,
		trigger,
		formState: { errors }
	} = useForm<Inputs>({
		resolver: zodResolver(schemas[currentStep])
	})

	const processForm: SubmitHandler<Inputs> = (data) => {
		console.log(data)
		reset()
	}

	type FieldName = keyof Inputs

	const next = async () => {
		const fields = steps[currentStep].fields
		const isValidData = await trigger(fields as FieldName[], { shouldFocus: true })

		if (isValidData && currentStep < steps.length - 1) {
			if (currentStep === steps.length - 1) {
				await handleSubmit(processForm)()
			}
			
			setPreviousStep(currentStep)
			setCurrentStep(prevStep => prevStep + 1)
		}
	}

	const prev = () => {
		if (currentStep > 0) {
			setPreviousStep(currentStep)
			setCurrentStep(prevStep => prevStep - 1)
		}
	}

	return (
		<section className="flex flex-col justify-between h-full">
			<div className="flex flex-col gap-6">
				<h1 className="text-2xl font-bold">Register business</h1>
				<Steps currentStep={currentStep} />
				<form onSubmit={handleSubmit(processForm)}>
					{currentStep === 0 && <Step1 register={register} errors={errors} delta={delta} />}
					{currentStep === 1 && <Step2 register={register} errors={errors} delta={delta} />}
					{currentStep === 2 && <Step3 register={register} errors={errors} delta={delta} watch={watch} />}
				</form>
			</div>
			<Navigation next={next} prev={prev} currentStep={currentStep} />
		</section>
	)
}

function Steps({ currentStep }: { currentStep: number }) {
	return (
		<nav aria-label="Progress" className="flex flex-col gap-3">
			<ol role="list" className="space-x-2 flex">
				{steps.map((step, index) => (
          <li key={step.name} className='md:flex-1 basis-full'>
            {currentStep > index ? (
              <div className='group flex w-full flex-col h-2 rounded-full bg-sky-600 transition-colors'>
              </div>
            ) : currentStep === index ? (
							<div
								className='group flex w-full flex-col h-2 rounded-full bg-sky-600 transition-colors'
								aria-current='step'
							>
							</div>
						) : (
							<div className='group flex w-full flex-col h-2 rounded-full bg-gray-200 transition-colors'>
							</div>
						)}
					</li>
				))}
			</ol>
			<div className="flex flex-col">
				<span className='text-sm font-medium text-sky-600'>
					{steps[currentStep].id}
				</span>
				<span className='text-xl font-medium'>{steps[currentStep].name}</span>
			</div>
		</nav>
	)
}

function Step1({ 
	register,
	errors,
	delta 
}: {
	register: UseFormRegister<Inputs>,
	errors: FieldErrors<Inputs>,
	delta: number
}) {
	return (
		<motion.div
			initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ duration: 0.3, ease: 'easeInOut' }}
			className="flex flex-col gap-2"
		>
			<div>
				<Label htmlFor="businessName">Business name</Label>
				<Input 
					id="businessName" 
					type="text" 
					placeholder="Business, Inc."
					{...register("businessName")} 
					required 
				/>
				{errors.businessName?.message && (
					<ErrorMessage message={errors.businessName.message} />
				)}
			</div>
			<div>
				<Label htmlFor="email">Email address</Label>
				<Input 
					id="email" 
					type="email" 
					placeholder="business@example.com"
					{...register("email")} 
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
					type="password" 
					{...register("password")} 
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
					type="password" 
					{...register("confirmPassword")} 
					required 
				/>
				{errors.confirmPassword?.message && (
					<ErrorMessage message={errors.confirmPassword.message} />
				)}
			</div>
		</motion.div>
	)
}

function Step2({ 
	register,
	errors,
	delta 
}: {
	register: UseFormRegister<Inputs>,
	errors: FieldErrors<Inputs>,
	delta: number
}) {
	return (
		<motion.div
			initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ duration: 0.3, ease: 'easeInOut' }}
			className="flex flex-col gap-6"
		>
			<div>
				<Label htmlFor="description">Business description</Label>
				<Textarea 
					id="description" 
					placeholder="Tell us about your business"
					{...register("description")} 
					required
				/>
				{errors.description?.message && (
					<ErrorMessage message={errors.description.message} />
				)}
			</div>
			<div>
				<Label htmlFor="address">Address</Label>
				<Input 
					id="address" 
					type="text" 
					placeholder="123 Main St, Cebu City, Cebu 6000"
					{...register("address")} 
					required 
				/>
				{errors.address?.message && (
					<ErrorMessage message={errors.address.message} />
				)}
			</div>
		</motion.div>
	)
}

function Step3({ 
	register,
	errors,
	delta,
	watch 
}: {
	register: UseFormRegister<Inputs>,
	errors: FieldErrors<Inputs>,
	delta: number,
	watch: UseFormWatch<Inputs>
}) {
	const [logoPreview, setLogoPreview] = useState<string | null>(null)
	const logoFile = watch("logo")

	useEffect(() => {
		if (logoFile && logoFile.length > 0) {
			const file = logoFile[0]
			const reader = new FileReader()
			reader.onloadend = () => {
				setLogoPreview(reader.result as string)
			}
			reader.readAsDataURL(file)
		}
		else {
			setLogoPreview(null)
		}
	}, [logoFile])

	return (
		<motion.div
			initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ duration: 0.3, ease: 'easeInOut' }} 
			className="flex flex-col gap-6"
		>
			<div className="flex flex-col justify-center items-center">
				{logoPreview && (
					<img
						src={logoPreview}
						alt="Your business logo"
						className="aspect-square rounded-full size-48 object-cover border border-input"
					/>
				)}
			</div>
			<div>
				<Label htmlFor="logo">Logo</Label>
				<Input 
					id="logo"
					type="file"
					accept="image/png, image/jpeg, image/jpg"
					placeholder="TAttach your business logo"
					{...register("logo")} 
					required
				/>
				{errors.logo?.message ? (
					<ErrorMessage message={typeof errors.logo.message === "string" ? errors.logo.message : "Something went wrong"} />
				) : (
					<p className="font-mono mt-2 text-sm text-gray-500">
						Logo must be in 1:1 &#40;square&#41; aspect ratio
					</p>
				)}
			</div>
		</motion.div>
	)
}

// function Step4() {
// 	return (
// 		<h1>Done!!</h1>
// 	)
// }

function ErrorMessage({ message }: { message: string }) {
	return (
		<p className="font-mono mt-1 text-sm text-red-400">
			{message}
		</p>
	)
}

function Navigation({
	next,
	prev,
	currentStep
}: {
	next: () => Promise<void>,
	prev: () => void,
	currentStep: number
}) {
	return (
			<div className='flex justify-end gap-4'>
				{currentStep > 0 && 
					<Button
						type="button"
						onClick={prev}
						disabled={currentStep === 0}
						variant={"outline"}
					>
						Back
					</Button>
				}
				{currentStep <= steps.length - 1 &&
					<Button
						type={currentStep === steps.length - 1 ? "submit" : "button"}
						onClick={next}
					>
						{currentStep === steps.length - 1 
							? "Register business" 
							: "Next"
						}
					</Button>
				}
			</div>
	)
}