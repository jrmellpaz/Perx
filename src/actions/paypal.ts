'use server';

const real_base = process.env.PAYPAL_API_URL;
const real_clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const real_appSecret = process.env.PAYPAL_APP_SECRET;

const sandbox_base = process.env.SANDBOX_PAYPAL_API_URL;
const sandbox_clientId = process.env.NEXT_PUBLIC_SANDBOX_PAYPAL_CLIENT_ID;
const sandbox_appSecret = process.env.SANDBOX_PAYPAL_APP_SECRET;

const MODE =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

let base: string;
let clientId: string;
let appSecret: string;

if (MODE === 'production') {
  base = real_base || 'https://api.paypal.com';
  clientId = real_clientId!;
  appSecret = real_appSecret!;
} else {
  base = sandbox_base || 'https://api-m.sandbox.paypal.com';
  clientId = sandbox_clientId!;
  appSecret = sandbox_appSecret!;
}

interface OrderData {
  id: string;
  details?: Array<{
    issue: string;
    description: string;
  }>;
  debug_id?: string;
}

export const createOrder = async (price: number): Promise<OrderData> => {
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
            currency_code: 'PHP',
            value: price,
          },
        },
      ],
    }),
  });

  return handleResponse(response);
};

export const createPayment = async (orderId: string) => {
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
