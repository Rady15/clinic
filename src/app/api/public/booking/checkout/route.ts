import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key === 'sk_test_your_stripe_secret_key' || !key.startsWith('sk_')) {
      return NextResponse.json({ error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' }, { status: 503 });
    }

    const stripe = new Stripe(key, { apiVersion: '2025-04-30.basil' });

    const { name, phone, email, department, doctorId, date, time, notes, amount } = await request.json();

    if (!name || !phone || !department) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'sar',
            product_data: {
              name: `Booking: ${department}${doctorId ? ' - Doctor Appointment' : ''}`,
            },
            unit_amount: Math.round((amount || 0) * 100),
          },
          quantity: 1,
        },
      ],
      ...(email ? { customer_email: email } : {}),
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout/cancel`,
      metadata: {
        type: 'booking',
        name,
        phone,
        email: email || '',
        department,
        doctorId: doctorId || '',
        date: date || '',
        time: time || '',
        notes: notes || '',
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (e) {
    console.error('Booking checkout error:', e);
    const message = e instanceof Error ? e.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
