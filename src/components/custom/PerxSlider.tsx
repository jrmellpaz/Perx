'use client';

import * as Slider from '@radix-ui/react-slider';
import { useState } from 'react';

type RangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
};

export default function RangeSlider({
  min,
  max,
  step = 50,
  value,
  onValueChange,
}: RangeSliderProps) {
  const [inputMin, inputMax] = value;

  return (
    <div className="flex flex-col gap-2">
      <Slider.Root
        className="relative flex w-full touch-none select-none items-center"
        min={min}
        max={max}
        step={step}
        value={[
          Math.min(inputMin, inputMax),
          Math.max(inputMin, inputMax),
        ]} // only clamp for slider visual
        onValueChange={onValueChange}
      >
        <Slider.Track className="relative h-2 w-full grow rounded-full bg-gray-200">
          <Slider.Range className="absolute h-full rounded-full bg-blue-500" />
        </Slider.Track>
        <Slider.Thumb className="block h-4 w-4 rounded-full bg-white border border-blue-500 shadow" />
        <Slider.Thumb className="block h-4 w-4 rounded-full bg-white border border-blue-500 shadow" />
      </Slider.Root>

      <div className="flex justify-between gap-2">
        <input
          type="number"
          value={inputMin}
          onChange={(e) => {
            const newMin = Number(e.target.value);
            onValueChange([newMin, inputMax]);
          }}
          className="w-full rounded border p-1 text-xs"
        />
        <input
          type="number"
          value={inputMax}
          onChange={(e) => {
            const newMax = Number(e.target.value);
            onValueChange([inputMin, newMax]);
          }}
          className="w-full rounded border p-1 text-xs"
        />
      </div>
    </div>
  );
}
