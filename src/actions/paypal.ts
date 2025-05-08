const base =
  process.env.NEXT_PUBLIC_PAYPAL_API_URL || 'http://api-m.sandbox.paypal.com';
const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const appSecret = process.env.NEXT_PUBLIC_PAYPAL_APP_SECRET;

interface OrderData {
  id: string;
  details?: Array<{
    issue: string;
    description: string;
  }>;
  debug_id?: string;
}

export const paypal = {
  createOrder: async (price: number): Promise<OrderData> => {
    const accessToken = await generateAccessToken();

    const response = await fetch(base + '/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: price,
            },
          },
        ],
      }),
    });

    return handleResponse(response);
  },
  createPayment: async (orderId: string) => {
    const accessToken = await generateAccessToken();

    const response = await fetch(
      `${base}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return handleResponse(response);
  },
};

const generateAccessToken = async () => {
  const auth = `${clientId}:${appSecret}`;
  const data = 'grant_type=client_credentials';

  const response = await fetch(base + '/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(auth).toString('base64')}`,
    },
    body: data,
  });

  const jsonData = await handleResponse(response);
  return jsonData.access_token;
};

const handleResponse = async (response: Response) => {
  if (response.ok) {
    return response.json();
  } else {
    const errorMessage = await response.text();
    throw new Error(`Error: ${response.status} - ${errorMessage}`);
  }
};
