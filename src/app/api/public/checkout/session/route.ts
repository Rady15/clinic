import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key === 'sk_test_your_stripe_secret_key' || !key.startsWith('sk_')) {
      return NextResponse.json({ error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' }, { status: 503 });
    }

    const stripe = new Stripe(key, { apiVersion: '2025-04-30.basil' });

    const { items, customerEmail, customerName, customerPhone } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

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

    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * (item.quantity || 1), 0);
    const tax = Math.round(subtotal * 0.15 * 100) / 100;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout/cancel`,
      metadata: {
        type: 'order',
        customerName: customerName || '',
        customerPhone: customerPhone || '',
        items: JSON.stringify(items),
        subtotal: subtotal.toString(),
        tax: tax.toString(),
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (e) {
    console.error('Checkout session error:', e);
    const message = e instanceof Error ? e.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
