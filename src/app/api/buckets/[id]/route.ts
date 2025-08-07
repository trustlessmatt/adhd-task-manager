import { NextRequest, NextResponse } from 'next/server';
import { getBucketById, updateBucket, deleteBucket } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const bucket = await getBucketById(id);
    
    if (!bucket) {
      return NextResponse.json(
        { error: 'Bucket not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(bucket);
  } catch (error) {
    console.error('Error fetching bucket:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bucket' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const bucket = await updateBucket(id, body);
    
    if (!bucket) {
      return NextResponse.json(
        { error: 'Bucket not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(bucket);
  } catch (error) {
    console.error('Error updating bucket:', error);
    return NextResponse.json(
      { error: 'Failed to update bucket' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const success = await deleteBucket(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Bucket not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bucket:', error);
    return NextResponse.json(
      { error: 'Failed to delete bucket' },
      { status: 500 }
    );
  }
} 