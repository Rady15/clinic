import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature') || '';

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (e) {
      console.error('Webhook signature verification failed:', e);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
      const metadata = session.metadata || {};
      const type = metadata.type;

      if (type === 'order') {
        const items = JSON.parse(metadata.items || '[]');
        const subtotal = parseFloat(metadata.subtotal || '0') || (session.amount_total ? session.amount_total / 100 : 0);
        const tax = parseFloat(metadata.tax || '0');
        const total = subtotal + tax;

        const order = await db.order.create({
          data: {
            name: metadata.customerName || session.customer_details?.name || 'Guest',
            email: session.customer_email || '',
            phone: metadata.customerPhone || '',
            total,
            subtotal,
            tax,
            status: 'confirmed',
            paymentStatus: 'paid',
            paymentIntentId: session.payment_intent as string,
            stripeSessionId: session.id,
            items: {
              create: items.map((item: any) => ({
                serviceId: item.serviceId || null,
                nameAr: item.nameAr || 'Service',
                nameEn: item.nameEn || '',
                price: item.price,
                quantity: item.quantity || 1,
                image: item.image || '',
              })),
            },
          },
        });

        await db.payment.create({
          data: {
            amount: total,
            currency: 'SAR',
            status: 'succeeded',
            paymentIntentId: session.payment_intent as string,
            stripeSessionId: session.id,
            customerEmail: session.customer_email || '',
            customerName: metadata.customerName || session.customer_details?.name || 'Guest',
            orderId: order.id,
            paymentMethod: 'stripe',
          },
        });
      } else if (type === 'booking') {
        const booking = await db.booking.create({
          data: {
            name: metadata.name,
            phone: metadata.phone,
            email: metadata.email || '',
            department: metadata.department,
            doctorId: metadata.doctorId || '',
            date: metadata.date || '',
            time: metadata.time || '',
            notes: metadata.notes || '',
            amount: 0,
            paymentStatus: 'paid',
            stripeSessionId: session.id,
            status: 'pending',
          },
        });

        await db.payment.create({
          data: {
            amount: 0,
            currency: 'SAR',
            status: 'succeeded',
            paymentIntentId: session.payment_intent as string,
            stripeSessionId: session.id,
            customerEmail: metadata.email || '',
            customerName: metadata.name,
            bookingId: booking.id,
            paymentMethod: 'stripe',
          },
        });
      }
    } else if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
      const existingOrder = await db.order.findUnique({
        where: { stripeSessionId: session.id },
      });
      if (existingOrder) {
        await db.order.update({
          where: { id: existingOrder.id },
          data: { paymentStatus: 'failed', status: 'cancelled' },
        });
      }

      const existingBooking = await db.booking.findFirst({
        where: { stripeSessionId: session.id },
      });
      if (existingBooking) {
        await db.booking.update({
          where: { id: existingBooking.id },
          data: { paymentStatus: 'failed' },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error('Webhook error:', e);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
