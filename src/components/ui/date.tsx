import React from 'react';

const TodayDate: React.FC = () => {
  const today = new Date();

  const day = today.getDate();
  const month = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  const weekday = today
    .toLocaleString('default', { weekday: 'long' })
    .toUpperCase();

  // const formattedDate = `${day} ${month} ${year}, ${weekday}`;

  return (
    <div
      style={{
        fontFamily: 'Manrope, sans-serif',
        fontWeight: '500',
        backgroundColor: '#F7F6F5',
        padding: '10px 15px',
        borderRadius: '8px',
        display: 'inline-block',
        fontSize: '14px',
        color: 'perx-canopy',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      }}
    >
      {`${day} ${month} ${year}, `}
      <span style={{ color: '#9B0032' }}>{weekday}</span>
    </div>
  );
};

export default TodayDate;
