import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: filePathArray } = await params;

    if (!filePathArray || filePathArray.length < 3) {
      return new NextResponse('Invalid path', { status: 400 });
    }

    const locale = filePathArray[0];
    const section = filePathArray[1];
    const slug = filePathArray[2];
    const imagePath = filePathArray.slice(3).join('/');

    // Prevent directory traversal
    if (imagePath.includes('..') || slug.includes('..') || locale.includes('..') || section.includes('..')) {
      return new NextResponse('Invalid path', { status: 403 });
    }

    const fullPath = path.join(process.cwd(), 'content', locale, section, slug, imagePath);

    if (!fs.existsSync(fullPath)) {
      return new NextResponse('Not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(fullPath);

    const ext = path.extname(fullPath).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.svg') contentType = 'image/svg+xml';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving content image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
