import { NextRequest, NextResponse } from 'next/server';
import { CheckoutAPI, Types } from '@adyen/api-library';
import { getAydenClient } from '@/app/lib';

const { checkoutApi } = getAydenClient();

export async function POST(request: NextRequest) {
  try {
    const { amount, countryCode, shopperLocale, reference } = await request.json();

    // Validate required fields
    if (!amount || !countryCode || !reference) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, countryCode, reference' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.ADYEN_API_KEY || !process.env.ADYEN_MERCHANT_ACCOUNT || !process.env.ADYEN_CLIENT_KEY) {
      return NextResponse.json(
        { error: 'Missing required environment variables. Please check ADYEN_API_KEY, ADYEN_MERCHANT_ACCOUNT, and ADYEN_CLIENT_KEY' },
        { status: 500 }
      );
    }

    // Create payment session
    const sessionRequest: Types.checkout.CreateCheckoutSessionRequest = {
      amount,
      countryCode: countryCode || "MX",
      merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT!,
      reference,
      returnUrl: `https://butler-sector-urgent-trim.trycloudflare.com/payment-test?session=${reference}`,
      shopperLocale: shopperLocale || "es-MX",
    };

    console.log('Creating session with request:', sessionRequest);
    const session = await checkoutApi.PaymentsApi.sessions(sessionRequest);

    return NextResponse.json({
      id: session.id,
      sessionData: session.sessionData,
      clientKey: process.env.ADYEN_CLIENT_KEY!,
      environment: process.env.ADYEN_ENVIRONMENT || 'TEST',
    });

  } catch (error: any) {
    console.error('Session creation error:', JSON.stringify(error, null, 2));
    
    return NextResponse.json(
      { 
        error: 'Failed to create payment session',
        details: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 500 }
    );
  }
}
