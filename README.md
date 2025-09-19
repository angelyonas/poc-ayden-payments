# Adyen Payment Test UI - Next.js

A comprehensive Next.js application for testing Adyen payment integrations with both client-side Drop-in components and server-side API integration using the official Adyen libraries.

## Features

- 🎛️ Interactive payment configuration UI
- 💳 Adyen Drop-in payment component integration  
- 🖥️ Server-side API integration using `@adyen/api-library`
- 🧪 Test card numbers for development
- 📊 Real-time payment result display
- 🎨 Responsive Tailwind CSS design
- 🔧 Support for multiple currencies and environments
- 🪝 Webhook handling for payment notifications
- 🔒 TypeScript support for type safety

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Adyen test account with API credentials

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Configure your Adyen credentials in `.env.local`:
```env
ADYEN_API_KEY=your_api_key_from_customer_area
ADYEN_CLIENT_KEY=test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
ADYEN_MERCHANT_ACCOUNT=YourMerchantAccountName
ADYEN_ENVIRONMENT=TEST
ADYEN_HMAC_KEY=your_webhook_hmac_key_optional
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Getting Adyen Credentials

1. **API Key & Client Key**: 
   - Login to [Adyen Customer Area (Test)](https://ca-test.adyen.com)
   - Go to Developers → API credentials
   - Create or select credentials
   - Copy API key and Client key

2. **Merchant Account**: 
   - Found in Customer Area → Account → Merchant accounts

3. **HMAC Key** (Optional for webhooks):
   - Go to Developers → Webhooks
   - Create or edit webhook configuration
   - Generate HMAC key for signature validation

## Usage

1. Navigate to the Payment Test page (`/payment-test`)
2. Configure payment settings:
   - Amount (in cents/minor currency units)
   - Currency (USD, EUR, GBP, MXN)
   - Country code and locale
   - Payment reference
3. Click "Initialize Payment" to create a session
4. Use test card details to complete payments
5. View payment results and webhook data

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── adyen/
│   │       ├── sessions/
│   │       │   └── route.ts         # Payment session creation API
│   │       └── webhooks/
│   │           └── route.ts         # Webhook handling API
│   ├── payment-test/
│   │   └── page.tsx                # Main payment test interface
│   ├── components/
│   │   ├── PaymentForm.tsx         # Payment configuration form
│   │   ├── AdyenDropin.tsx         # Adyen Drop-in component wrapper
│   │   ├── PaymentResult.tsx       # Payment result display
│   │   └── TestCards.tsx           # Test card information component
│   ├── lib/
│   │   ├── adyen.ts                # Adyen client configuration
│   │   ├── utils.ts                # Utility functions
│   │   └── types.ts                # TypeScript type definitions
│   ├── styles/
│   │   └── adyen.css               # Adyen-specific styles
│   ├── globals.css                 # Global Tailwind CSS styles
│   ├── layout.tsx                  # Root layout component
│   └── page.tsx                    # Home page component
├── public/
│   ├── favicon.ico                 # Site favicon
│   └── images/                     # Static images
├── types/
│   ├── adyen.ts                    # Adyen-specific type definitions
│   └── payment.ts                  # Payment-related types
├── .env.example                    # Environment variables template
├── .env.local                      # Local environment variables (gitignored)
├── next.config.js                  # Next.js configuration
├── package.json                    # Project dependencies and scripts
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

## File Descriptions

### Core Application Files
- **`src/app/layout.tsx`**: Root layout with global providers and metadata
- **`src/app/page.tsx`**: Landing page with project overview and navigation
- **`src/app/payment-test/page.tsx`**: Main payment testing interface

### API Routes
- **`src/app/api/adyen/sessions/route.ts`**: Creates Adyen payment sessions
- **`src/app/api/adyen/webhooks/route.ts`**: Handles payment webhook notifications

### Components
- **`src/components/PaymentForm.tsx`**: Form for configuring payment parameters
- **`src/components/AdyenDropin.tsx`**: React wrapper for Adyen Drop-in component
- **`src/components/PaymentResult.tsx`**: Displays payment results and session data
- **`src/components/TestCards.tsx`**: Shows available test card numbers

### Utilities and Configuration
- **`src/lib/adyen.ts`**: Adyen API client initialization and configuration
- **`src/lib/utils.ts`**: Common utility functions (amount formatting, validation)
- **`src/lib/types.ts`**: Shared TypeScript interfaces and types

### Styling
- **`src/globals.css`**: Global styles and Tailwind CSS imports
- **`src/styles/adyen.css`**: Custom styles for Adyen components

## API Endpoints

### `POST /api/adyen/sessions`
Creates a payment session for the Drop-in component.

**Request Body:**
```json
{
  "amount": 1000,
  "currency": "USD",
  "countryCode": "US",
  "shopperLocale": "en-US",
  "reference": "payment-123"
}
```

**Response:**
```json
{
  "id": "session_id",
  "sessionData": "encrypted_session_data",
  "clientKey": "test_CLIENT_KEY",
  "environment": "TEST"
}
```

### `POST /api/adyen/webhooks`
Handles Adyen webhook notifications for payment events.

## Test Cards

Use these test cards in the test environment:

| Card Type | Number | CVC | Expiry | Result |
|-----------|--------|-----|--------|--------|
| Visa | 4111 1111 1111 1111 | Any 3 digits | Any future date | Success |
| Mastercard | 5555 5555 5555 4444 | Any 3 digits | Any future date | Success |
| American Express | 3700 0000 0000 002 | Any 4 digits | Any future date | Success |
| Visa (Declined) | 4000 0000 0000 0002 | Any 3 digits | Any future date | Declined |

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `ADYEN_API_KEY` | Server-side API key | `AQE1hmfx...` |
| `ADYEN_CLIENT_KEY` | Client-side key | `test_ABC...` |
| `ADYEN_MERCHANT_ACCOUNT` | Merchant account name | `YourCompany` |
| `ADYEN_ENVIRONMENT` | API environment | `TEST` or `LIVE` |
| `ADYEN_HMAC_KEY` | Webhook HMAC key (optional) | `ABC123...` |

## Development Tips

1. **Install Dependencies**: Make sure to run `npm install` after cloning
2. **Testing Webhooks Locally**: Use ngrok or similar tools to expose your local server
3. **Debug Mode**: Check browser console and server logs for detailed error information
4. **Session Management**: Each payment creates a new session with unique reference

## Built With

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [Adyen Web SDK](https://docs.adyen.com/online-payments/web-drop-in) - Client-side payment components
- [Adyen API Library](https://docs.adyen.com/development-resources/libraries#javascript) - Server-side API integration
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

## Resources

- [Adyen Documentation](https://docs.adyen.com)
- [Web Drop-in Integration](https://docs.adyen.com/online-payments/web-drop-in)
- [Sessions API Reference](https://docs.adyen.com/api-explorer/#/CheckoutService/v70/sessions)
- [Test Card Numbers](https://docs.adyen.com/development-resources/testing/test-card-numbers)
- [Webhook Notifications](https://docs.adyen.com/development-resources/webhooks)
- [Customer Area (Test)](https://ca-test.adyen.com)
