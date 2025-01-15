import { ReactElement, useState } from 'react';

export function useMultistepForm(steps: ReactElement[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const next = () => {
    setCurrentStepIndex((index) => {
      if (index >= steps.length - 1) {
        return index;
      }

      return index + 1;
    });
  };

  const back = () => {
    setCurrentStepIndex((index) => {
      if (index <= 0) {
        return index;
      }

      return index - 1;
    });
  };

  const goTo = (index: number) => {
    setCurrentStepIndex(index);
  };

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    goTo,
    next,
    back,
  };
}
