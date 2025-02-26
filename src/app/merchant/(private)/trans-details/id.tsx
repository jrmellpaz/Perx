import { useRouter } from 'next/router';
import React from 'react';

const TransactionDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  // Fetch transaction details based on the id
  // For now, we'll just display the id
  return (
    <div>
      <h1>Transaction Details</h1>
      <p>Transaction ID: {id}</p>
    </div>
  );
};

export default TransactionDetails;