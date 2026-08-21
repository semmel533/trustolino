import { NextResponse } from 'next/server';
import { Client, Databases, ID, Query } from 'node-appwrite';

export async function POST(request: Request) {
    try {
        const { name, email, locale, privacyConsent } = await request.json();

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return NextResponse.json({ error: 'invalid_name' }, { status: 400 });
        }

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const normalizedEmail = email.trim().toLowerCase();
        if (!emailRegex.test(normalizedEmail)) {
            return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
        }

        if (privacyConsent !== true) {
            return NextResponse.json({ error: 'privacy_required' }, { status: 400 });
        }

        const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
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
        const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'pre-website';
        const collectionId = 'waitlist';

        const existingDocs = await databases.listDocuments(
            databaseId,
            collectionId,
            [Query.equal('email', normalizedEmail)]
        );

        if (existingDocs.total > 0) {
            return NextResponse.json({ error: 'duplicate' }, { status: 409 });
        }

        await databases.createDocument(
            databaseId,
            collectionId,
            ID.unique(),
            {
                name: name.trim(),
                email: normalizedEmail,
                locale: locale || 'de',
                createdAt: new Date().toISOString(),
                privacyConsent: true,
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
