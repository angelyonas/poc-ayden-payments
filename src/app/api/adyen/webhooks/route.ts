import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const notificationItems = JSON.parse(body);

    // Process notifications
    for (const notificationItem of notificationItems.notificationItems) {
      const notification = notificationItem.NotificationRequestItem;

      console.log('Webhook notification:', notification);

      // Handle different event types
      switch (notification.eventCode) {
        case 'AUTHORISATION':
          if (notification.success === 'true') {
            console.log(`Payment authorized: ${notification.pspReference}`);
            // Update your database/system with successful payment
          } else {
            console.log(`Payment failed: ${notification.pspReference}`);
            // Handle failed payment
          }
          break;
          
        case 'CAPTURE':
          console.log(`Payment captured: ${notification.pspReference}`);
          // Handle capture event
          break;
          
        case 'REFUND':
          console.log(`Payment refunded: ${notification.pspReference}`);
          // Handle refund event
          break;
          
        default:
          console.log(`Unhandled event: ${notification.eventCode}`);
      }
    }

    // Acknowledge receipt
    return NextResponse.json({ notificationResponse: '[accepted]' });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
