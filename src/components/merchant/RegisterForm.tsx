"use client"

import { MerchantFormDataSchema } from "@/lib/merchantSchema"
import { useState } from "react"
import { z } from "zod"

type Inputs = z.infer<typeof MerchantFormDataSchema>

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
	},
	{
		id: "Step 4",
		name: "Review and submit",
	}
]

export default function MerchantRegisterForm() {
	const [previousSteps, setPreviousSteps] = useState(0)
	const [currentStep, setCurrentStep] = useState(0)
	const delta = currentStep - previousSteps

	return (
		<section>
			<Steps currentStep={currentStep} />
		</section>
	)
}

function Steps({ currentStep }: { currentStep: number }) {
	return (
		<nav aria-label="Progress">
			<ol role="list" className="space-y-4">
				{steps.map((step, index) => (
          <li key={step.name} className='md:flex-1'>
            {currentStep > index ? (
              <div className='group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                <span className='text-sm font-medium text-sky-600 transition-colors '>
                  {step.id}
                </span>
                <span className='text-sm font-medium'>{step.name}</span>
              </div>
            ) : currentStep === index ? (
              <div
                className='flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                aria-current='step'
              >
								<span className='text-sm font-medium text-sky-600'>
									{step.id}
								</span>
								<span className='text-sm font-medium'>{step.name}</span>
							</div>
						) : (
							<div className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
								<span className='text-sm font-medium text-gray-500 transition-colors'>
									{step.id}
								</span>
								<span className='text-sm font-medium'>{step.name}</span>
							</div>
						)}
					</li>
				))}
			</ol>
		</nav>
	)
}