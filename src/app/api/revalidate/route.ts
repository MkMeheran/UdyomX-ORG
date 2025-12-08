import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, type } = body;

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    // Revalidate the specific path
    revalidatePath(path);

    // Also revalidate listing pages
    if (type === 'post' || type === 'blog') {
      revalidatePath('/blog');
      revalidatePath('/'); // Homepage shows latest posts
    } else if (type === 'project') {
      revalidatePath('/projects');
      revalidatePath('/');
    } else if (type === 'service') {
      revalidatePath('/services');
      revalidatePath('/');
    }

    return NextResponse.json({ 
      revalidated: true, 
      message: `Revalidated ${path} and related pages`,
      now: Date.now() 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
