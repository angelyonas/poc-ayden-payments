"use client";

import { useState, useRef } from "react";
import { AdyenCheckout, Dropin, Card } from "@adyen/adyen-web";
import { useAdyenCheckout } from "@/hooks/use-adyen-checkout";
import { ButtonPrimary } from "@/components/button-primary";

interface PaymentConfig {
  amount: number;
  currency: string;
  countryCode: string;
  shopperLocale: string;
  reference: string;
}

export default function PaymentTest() {
  const [config, setConfig] = useState<PaymentConfig>({
    amount: 1000,
    currency: "MXN",
    countryCode: "MX",
    shopperLocale: "es-MX",
    reference: `payment-${Date.now()}`,

  });
  const [loading, setLoading] = useState(false);
  const [flowSelected, setFlowSelected] = useState<"sessions" | "advanced">(
    "sessions"
  );
  const dropinRef = useRef<HTMLDivElement>(null);
  const {
    initializeCheckout,
    createDropin,
    paymentResult,
    clearResults,
    sessionData,
    paymentMethods,
    paymentDetails
  } = useAdyenCheckout();

  const updateConfig = (key: keyof PaymentConfig, value: string | number) => {
    setConfig((prev) => ({
      ...prev,
      [key]: key === "amount" ? Number(value) : value,
      reference:
        key === "amount" || key === "currency"
          ? `payment-${Date.now()}`
          : prev.reference,
    }));
  };

  const handleClickPayment = async () => {
    setLoading(true);
    initializeCheckout({
      amount: { value: config.amount, currency: config.currency },
      countryCode: config.countryCode,
      shopperLocale: config.shopperLocale,
      reference: config.reference,
      flowType: flowSelected,
    })
      .then((checkout) => {
        if (dropinRef.current) {
          createDropin(checkout, dropinRef.current);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const handleClickFlow = (flow: "sessions" | "advanced") => {
    setFlowSelected(flow);
    clearResults();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-center">
        {/* Payment flow options */}
        <div className="lg:w-1/2 w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Adyen Payment Test
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Test your Adyen payment integration with server-side API
            </p>
          </div>

          <p className="text-md font-bold">Tipo de de flujo de pago</p>
          <div className="flex justify-center gap-2">
            <ButtonPrimary
              onClick={() => handleClickFlow("sessions")}
              selected={flowSelected === "sessions"}
            >
              Sessions Flow
            </ButtonPrimary>
            <ButtonPrimary
              onClick={() => handleClickFlow("advanced")}
              selected={flowSelected === "advanced"}
            >
              Advanced Flow
            </ButtonPrimary>
          </div>
        </div>

        {/* Test Cards Section */}
        <div className="lg:w-1/2 w-full">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold mb-3 text-green-900 dark:text-green-100">
              Test Cards (for testing environment)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="mb-2">
                  <strong>Visa:</strong> 4111 1111 4555 1142
                </div>
                <div className="mb-2">
                  <strong>Mastercard:</strong> 2222 4000 7000 0005
                </div>
                <div className="mb-2">
                  <strong>American Express:</strong> 3700 0000 0000 002
                </div>
              </div>
              <div>
                <div className="mb-2">
                  <strong>CVC:</strong> 737 (7373 for Amex)
                </div>
                <div className="mb-2">
                  <strong>Expiry:</strong> 03/2030
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-300 dark:border-gray-600" />

      <div className="flex justify-center mt-5 flex-wrap">
        {/* Configuration Section */}
        <div className="lg:w-1/2 w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 m-3">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Payment Configuration ({flowSelected} Flow)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={config.amount}
                  onChange={(e) => updateConfig("amount", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Currency
                </label>
                <select
                  id="currency"
                  value={config.currency}
                  onChange={(e) => updateConfig("currency", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="MXN">MXN</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="countryCode"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Country Code
                </label>
                <input
                  type="text"
                  id="countryCode"
                  value={config.countryCode}
                  onChange={(e) => updateConfig("countryCode", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="reference"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Payment Reference
                </label>
                <input
                  type="text"
                  id="reference"
                  value={config.reference}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <ButtonPrimary onClick={handleClickPayment} disabled={loading}>
              {loading ? "Initializing..." : "Initialize Payment"}
            </ButtonPrimary>
          </div>
        </div>

        {/* Payment Section */}
        <div className="lg:w-1/2 w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 m-3">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Payment
            </h2>
            <div
              ref={dropinRef}
              id="dropin-container"
              className="payment-container min-h-[300px]"
            ></div>
          </div>
        </div>
      </div>

      <div>
        <p className="my-5 text-xl font-semibold">Log payment Information</p>

        {flowSelected === "advanced" && paymentMethods && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
              Payment Methods Response
            </h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(paymentMethods, null, 2)}
            </pre>
          </div>
        )}

        {/* Session Data Section */}
        {flowSelected === "sessions" && sessionData && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
              Session Data
            </h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(sessionData, null, 2)}
            </pre>
          </div>
        )}

        {/* Result Section */}
        {paymentResult && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Payment Result
              </h2>
              <button
                onClick={clearResults}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-1 px-3 rounded-md text-sm transition-colors"
              >
                Clear
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(paymentResult, null, 2)}
            </pre>
          </div>
        )}

        {paymentDetails && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Payment Details
            </h2>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(paymentDetails, null, 2)}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
}
