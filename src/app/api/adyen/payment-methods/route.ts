import { NextRequest, NextResponse } from "next/server";
import { getAydenClient, Types } from "@/app/lib";


const { checkoutApi } = getAydenClient();

export async function POST(request: NextRequest) {
  try {

    const body = await request.json();

    const amount: Types.checkout.Amount = body.amount

    const paymentMethodsRequest: Types.checkout.PaymentMethodsRequest = {
      merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT!,
      amount,
      countryCode: body.countryCode || "MX",
      shopperLocale: body.shopperLocale || "es-MX",
    };

    console.log({paymentMethodsRequest});

    const response = await checkoutApi.PaymentsApi.paymentMethods(paymentMethodsRequest);
    
    return NextResponse.json({
      response,
      clientKey: process.env.ADYEN_CLIENT_KEY!,
      environment: process.env.ADYEN_ENVIRONMENT || 'TEST',
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch payment methods", details: error.message },
      { status: 200 }
    );
  }
}
