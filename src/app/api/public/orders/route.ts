import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id');
    const bookingId = request.nextUrl.searchParams.get('booking_id');

    if (sessionId) {
      const order = await db.order.findUnique({
        where: { stripeSessionId: sessionId },
        include: { items: true },
      });
      if (order) return NextResponse.json(order);
    }

    if (bookingId) {
      const booking = await db.booking.findUnique({
        where: { id: bookingId },
      });
      if (booking) return NextResponse.json(booking);
    }

    return NextResponse.json({}, { status: 404 });
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}
