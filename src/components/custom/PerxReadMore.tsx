'use client';

import { useState } from 'react';

interface ReadMoreProps {
  id: string;
  text: string;
  accentColor?: string;
  amountOfWords?: number;
}

export const PerxReadMore = ({
  id,
  text,
  accentColor = 'perx-blue',
  amountOfWords = 36,
}: ReadMoreProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const splittedText = text.split(' ');
  const itCanOverflow = splittedText.length > amountOfWords;
  const beginText = itCanOverflow
    ? splittedText.slice(0, amountOfWords - 1).join(' ')
    : text;
  const endText = splittedText.slice(amountOfWords - 1).join(' ');

  const handleKeyboard = (e: React.KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <p id={id} className="text-sm tracking-tight">
      {beginText}
      {itCanOverflow && (
        <>
          {!isExpanded && <span>... </span>}
          <span
            className={`${!isExpanded && 'hidden'}`}
            aria-hidden={!isExpanded}
          >
            {endText}
          </span>
          <span
            className={`text-${accentColor} ml-2 cursor-pointer font-medium`}
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
            aria-controls={id}
            onKeyDown={handleKeyboard}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </span>
        </>
      )}
    </p>
  );
};
