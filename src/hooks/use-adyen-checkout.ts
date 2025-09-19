"use client";

import { useState, useCallback } from "react";
import { AdyenCheckout, Dropin, Card } from "@adyen/adyen-web";
import { Types } from "@adyen/api-library";
import { payment } from "@adyen/api-library/lib/src/typings";

interface PaymentConfig {
  amount: {
    value: number;
    currency: string;
  };
  countryCode: string;
  shopperLocale: string;
  reference: string;
}

interface PaymentSubmission {
  stateData: payment.PaymentRequest;
  countryCode: string;
  locale: string;
  amount: {
    value: number;
    currency: string;
  };
}

export const useAdyenCheckout = () => {
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [checkoutInstance, setCheckoutInstance] = useState<any>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const getSessionData = useCallback(
    async (config: PaymentConfig, amount: number) => {
      // create session
      const sessionResponse = await fetch("/api/adyen/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...config,
          amount: {
            value: amount,
            currency: config.amount.currency,
          },
        }),
      });

      if (!sessionResponse.ok) {
        const errorData = await sessionResponse.json();
        throw new Error(
          `Failed to create session: ${
            errorData.error || sessionResponse.statusText
          }`
        );
      }

      const session = await sessionResponse.json();
      setSessionData(session);
      return session;
    },
    [sessionData]
  );

  const getPaymentMethods = useCallback(
    async (config: PaymentConfig, amount: number) => {
      // fetch payment methods
      const paymentMethodsResponse = await fetch("/api/adyen/payment-methods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...config,
          amount: {
            value: amount,
            currency: config.amount.currency,
          },
        }),
      });

      if (!paymentMethodsResponse.ok) {
        const errorData = await paymentMethodsResponse.json();
        throw new Error(
          `Failed to fetch payment methods: ${
            errorData.error || paymentMethodsResponse.statusText
          }`
        );
      }

      const data = await paymentMethodsResponse.json();
      setPaymentMethods(data);
      return data;
    },
    [sessionData]
  );

  const getMinAmount = (amount: number) => Math.round(amount * 100);

  const initializeCheckout = async (
    config: Omit<
      Types.checkout.CreateCheckoutSessionRequest,
      "merchantAccount" | "returnUrl"
    > & { reference: string; flowType?: "sessions" | "advanced" }
  ) => {
    try {
      if (
        !config ||
        !config.amount ||
        !config.amount.currency ||
        !config.amount.value ||
        !config.reference
      ) {
        throw new Error("Invalid configuration for Adyen Checkout");
      }

      if (checkoutInstance) {
        return checkoutInstance;
      }

      // modify amount value to min unit
      const minAmount = getMinAmount(config.amount.value);

      const configuration: any = {
        amount: {
          value: minAmount,
          currency: config.amount.currency,
        },
        locale: config.shopperLocale,
        countryCode: config.countryCode,
        analytics: {
          enabled: true,
        },
        onPaymentCompleted: (result: any, component: any) => {
          setPaymentResult({
            type: "completed",
            data: result,
          });
          setCheckoutInstance(null); // Clear instance after payment completion
        },
        onPaymentFailed: (result: any, component: any) => {
          setPaymentResult({
            type: "failed",
            data: result,
          });
          setCheckoutInstance(null); // Clear instance after payment failure
        },
        onError: (error: any) => {
          setPaymentResult({
            type: "error",
            error: error.message || "Unknown error occurred",
          });
          setCheckoutInstance(null); // Clear instance after error
        },
      };

      if (config.flowType === "sessions") {
        const session = await getSessionData(
          {
            amount: config.amount,
            countryCode: config.countryCode || "MX",
            shopperLocale: config.shopperLocale || "es-MX",
            reference: config.reference,
          },
          minAmount
        );

        Object.assign(configuration, {
          session: {
            id: session.id,
            sessionData: session.sessionData,
          },
          clientKey: session.clientKey,
          environment: session.environment || "TEST",
        });
      }

      if (config.flowType === "advanced") {
        const paymentMethods = await getPaymentMethods(
          {
            amount: config.amount,
            countryCode: config.countryCode || "MX",
            shopperLocale: config.shopperLocale || "es-MX",
            reference: config.reference,
          },
          minAmount
        );

        Object.assign(configuration, {
          paymentMethodsResponse: paymentMethods.response,
          clientKey: paymentMethods.clientKey,
          environment: paymentMethods.environment || "TEST",
          onSubmit: async (state: any, component: any, actions: any) => {
            try {
              const response = await fetch("/api/adyen/payments", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  stateData: state.data,
                  countryCode: config.countryCode || "MX",
                  locale: config.shopperLocale || "es-MX",
                  amount: config.amount,
                  reference: config.reference,
                }),
              });

              if (!response.ok) {
                actions.reject();
                return;
              }

              const result = await response.json();
              setPaymentDetails(result);
              actions.resolve(result);
            } catch (error) {
              actions.reject();
            }
          },
        });
      }

      // Initialize Adyen Checkout
      const adyenCheckout = await AdyenCheckout(configuration);
      return adyenCheckout;
    } catch (error: any) {
      setPaymentResult({
        type: "error",
        error: error.message || "Unknown error occurred",
      });
    }
  };

  const createDropin = (checkout: any, container: HTMLElement) => {
    // Drop-in configuration.
    const dropInConfiguration = {
      paymentMethodComponents: [Card],
      onReady: () => {
        // Drop-in is ready
      },
      // Configuration for individual payment methods.
      paymentMethodsConfiguration: {
        card: {
          onError: () => {
            setPaymentResult({
              type: "error",
              error: "An error occurred in the card component",
            });
          },
        },
      },
    };

    const dropin = new Dropin(checkout, dropInConfiguration).mount(container);
    return dropin;
  };

  const clearResults = () => {
    setPaymentResult(null);
    setSessionData(null);
  };

  return {
    initializeCheckout,
    createDropin,
    paymentResult,
    clearResults,
    sessionData,
    paymentMethods,
    paymentDetails,
  };
};
