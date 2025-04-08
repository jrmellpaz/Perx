'use client';

import Countdown, { CountdownRendererFn } from 'react-countdown';

export default function CountdownTimer({ validTo }: { validTo: string }) {
  // Convert the validTo date string to a Date object
  const validToDate = new Date(validTo);

  // Custom renderer for the countdown
  const renderer: CountdownRendererFn = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }) => {
    if (completed) {
      // Render when the countdown is complete
      return <span className="font-bold text-red-500">Expired</span>;
    } else {
      // Render the countdown
      return (
        <div className="flex gap-2 font-mono text-sm">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{days}</span>
            <span>Days</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{hours}</span>
            <span>Hours</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{minutes}</span>
            <span>Minutes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{seconds}</span>
            <span>Seconds</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="countdown-timer">
      <Countdown date={validToDate} renderer={renderer} />
    </div>
  );
}
