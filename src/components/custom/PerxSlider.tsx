'use client';

import * as Slider from '@radix-ui/react-slider';

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
        className="relative flex w-full touch-none items-center select-none"
        min={min}
        max={max}
        step={step}
        value={[Math.min(inputMin, inputMax), Math.max(inputMin, inputMax)]} // only clamp for slider visual
        onValueChange={onValueChange}
      >
        <Slider.Track className="relative h-2 w-full grow rounded-full bg-gray-200">
          <Slider.Range className="absolute h-full rounded-full bg-blue-500" />
        </Slider.Track>
        <Slider.Thumb className="block h-4 w-4 rounded-full border border-blue-500 bg-white shadow" />
        <Slider.Thumb className="block h-4 w-4 rounded-full border border-blue-500 bg-white shadow" />
      </Slider.Root>

      <div className="flex gap-2">
        <input
          type="number"
          value={inputMin}
          onChange={(e) => {
            const newMin = Number(e.target.value);
            onValueChange([newMin, inputMax]);
          }}
          className="focus-within:border-perx-blue h-8 rounded-lg border-2 p-2 text-xs transition-all outline-none"
        />
        <input
          type="number"
          value={inputMax}
          onChange={(e) => {
            const newMax = Number(e.target.value);
            onValueChange([inputMin, newMax]);
          }}
          className="focus-within:border-perx-blue h-8 rounded-lg border-2 p-2 text-xs transition-all outline-none"
        />
      </div>
    </div>
  );
}
