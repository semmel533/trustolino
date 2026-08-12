import { NextResponse } from 'next/server';
import { Client, Databases, ID, Query } from 'node-appwrite';

export async function POST(request: Request) {
    try {
        const { email, locale } = await request.json();

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
        const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
        const apiKey = process.env.APPWRITE_API_KEY;

        if (!projectId || !apiKey) {
            console.error('Missing Appwrite configuration');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const client = new Client()
            .setEndpoint(endpoint)
            .setProject(projectId)
            .setKey(apiKey);

        const databases = new Databases(client);
        const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'trustolino_db';
        const collectionId = 'waitlist';

        const existingDocs = await databases.listDocuments(
            databaseId,
            collectionId,
            [Query.equal('email', email)]
        );

        if (existingDocs.total > 0) {
            return NextResponse.json({ error: 'duplicate' }, { status: 409 });
        }

        await databases.createDocument(
            databaseId,
            collectionId,
            ID.unique(),
            {
                email,
                locale: locale || 'de',
                createdAt: new Date().toISOString(),
            }
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Waitlist submission error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
