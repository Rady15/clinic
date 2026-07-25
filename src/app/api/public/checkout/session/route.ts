import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { items, customerEmail, customerName, customerPhone } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'sar',
        product_data: {
          name: item.nameEn || item.nameAr || 'Service',
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: customerEmail,
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout/cancel`,
      metadata: {
        type: 'order',
        customerName: customerName || '',
        customerPhone: customerPhone || '',
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        items: JSON.stringify(items),
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (e) {
    console.error('Checkout session error:', e);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
