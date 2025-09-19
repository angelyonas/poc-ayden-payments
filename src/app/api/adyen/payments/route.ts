import { NextRequest, NextResponse } from 'next/server';
import { getAydenClient, Types } from '@/app/lib';


const { checkoutApi } = getAydenClient();

export async function POST(request: NextRequest) {
  try {
      const { stateData, countryCode, locale, amount, reference } = await request.json();

      // Validate required fields
      if (!amount || !stateData || !countryCode || !locale || !reference) {
      return NextResponse.json(
        { error: 'Missing required fields: paymentMethod, amount, reference, stateData' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.ADYEN_API_KEY || !process.env.ADYEN_MERCHANT_ACCOUNT) {
      return NextResponse.json(
        { error: 'Missing required environment variables. Please check ADYEN_API_KEY and ADYEN_MERCHANT_ACCOUNT' },
        { status: 500 }
      );
    }

    const _amount: Types.checkout.Amount = {
        currency: amount.currency || 'MXN',
        value: amount.value,
    }

    const { paymentMethod } = stateData;

    const cardDetails: Types.checkout.CardDetails = {
        encryptedCardNumber: paymentMethod.encryptedCardNumber,
        encryptedExpiryMonth: paymentMethod.encryptedExpiryMonth,
        encryptedExpiryYear: paymentMethod.encryptedExpiryYear,
        encryptedSecurityCode: paymentMethod.encryptedSecurityCode,
        type: Types.checkout.CardDetails.TypeEnum.Scheme
    };

    const paymentRequest: Types.checkout.PaymentRequest = {
      reference: reference,
      amount: _amount,
      paymentMethod: cardDetails,
      merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT!,
      returnUrl: `https://admission-craft-prepared-span.trycloudflare.com/payment-test?payment=${reference}`,
    };

    // Call Adyen API to process payment
    const response = await checkoutApi.PaymentsApi.payments(paymentRequest, { idempotencyKey: reference });
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error occurred" },
      { status: 500 }
    );
  }
} 
