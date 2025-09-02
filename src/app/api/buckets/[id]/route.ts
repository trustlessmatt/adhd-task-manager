import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getBucketById, updateBucket, deleteBucket } from '@/lib/db/queries';
import { isInboxBucket } from '@/lib/utils/inbox-bucket';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id);
    const bucket = await getBucketById(id, userId);
    
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
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id);
    const body = await request.json();
    const bucket = await updateBucket(id, userId, body);
    
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
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id);
    
    // First, get the bucket to check if it's the Inbox
    const bucket = await getBucketById(id, userId);
    if (!bucket) {
      return NextResponse.json(
        { error: 'Bucket not found' },
        { status: 404 }
      );
    }
    
    // Prevent deletion of Inbox bucket
    if (isInboxBucket(bucket.name)) {
      return NextResponse.json(
        { error: 'Cannot delete the Inbox bucket' },
        { status: 400 }
      );
    }
    
    const success = await deleteBucket(id, userId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete bucket' },
        { status: 500 }
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