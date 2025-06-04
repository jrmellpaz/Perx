// import { NextResponse } from 'next/server';

// const PAYPAL_API_URL =
//   process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
// const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
// const PAYPAL_APP_SECRET = process.env.PAYPAL_APP_SECRET;

// interface PaymentData {
//   title: string;
//   amount: string;
//   orderId: string;
// }

// const getPayPalAccessToken = async (): Promise<string> => {
//   interface PayPalAccessTokenResponseJSON {
//     scope: string;
//     access_token: string;
//     token_type: string;
//     app_id: string;
//     expires_in: number;
//     nonce: string;
//   }

//   try {
//     const auth = Buffer.from(
//       `${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`
//     ).toString('base64');

//     const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         Authorization: `Basic ${auth}`,
//       },
//       body: 'grant_type=client_credentials',
//     });

//     const data: PayPalAccessTokenResponseJSON = await response.json();
//     return data.access_token;
//   } catch (error) {
//     console.error('Error getting PayPal access token:', error);
//     throw error;
//   }
// };

// const capturePayPalOrder = async (orderId: string, accessToken: string) => {
//   try {
//     console.log(
//       `Capturing order ${orderId} with token ${accessToken.substring(0, 10)}...`
//     );

//     const response = await fetch(
//       `${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
//       {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({}),
//       }
//     );

//     const data = await response.json();
//     console.log('Capture response:', data);
//     return data;
//   } catch (error) {
//     console.error('Error capturing PayPal order:', error);
//     throw error;
//   }
// };

// export async function POST(request: Request) {
//   try {
//     const data: PaymentData = await request.json();

//     // Validate incoming payment data
//     if (!data.title || !data.amount || !data.orderId) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     // Get PayPal access token
//     const accessToken = await getPayPalAccessToken();
//     console.log('Got Paypal access token');

//     // Capture payment
//     const captureData = await capturePayPalOrder(data.orderId, accessToken);
//     console.log('PayPal capture resppnse: ', captureData);

//     // Check if the payment capture was successful
//     if (captureData.status === 'COMPLETED') {
//       console.log(`Invalid capture status: ${captureData.status}`);

//       return NextResponse.json(
//         { error: `Payment capture failed with status: ${captureData.status}` },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: 'Payment captured successfully',
//         data: {
//           title: data.title,
//           amount: data.amount,
//           orderId: data.orderId,
//           captureId: captureData.id,
//           status: captureData.status,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Payment processing error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   return NextResponse.json(
//     { message: 'Payment API endpoint' },
//     { status: 200 }
//   );
// }
