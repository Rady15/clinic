import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // التأكد من أن الاتصال بقاعدة البيانات يعمل
    if (!db) {
      console.error('Database connection is not available');
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    
    const items = await db.beforeAfterCase.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    
    // التأكد من أن البيانات تم جلبها بنجاح
    if (!items || items.length === 0) {
      console.log('No before and after cases found in the database');
    } else {
      console.log(`Successfully fetched ${items.length} before and after cases`);
    }
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching before and after cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch before and after cases', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

