import { NextRequest, NextResponse } from 'next/server';
import { getAllBuckets, createBucket } from '@/lib/db/queries';

export async function GET() {
  try {
    const buckets = await getAllBuckets();
    return NextResponse.json(buckets);
  } catch (error) {
    console.error('Error fetching buckets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buckets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const bucket = await createBucket(body);
    return NextResponse.json(bucket, { status: 201 });
  } catch (error) {
    console.error('Error creating bucket:', error);
    return NextResponse.json(
      { error: 'Failed to create bucket' },
      { status: 500 }
    );
  }
} 