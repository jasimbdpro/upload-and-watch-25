import { NextResponse } from 'next/server';
import { connectToDb } from '../../../lib/mongodb';
import { Video } from '../../../models/video'; // Assuming you have a Video model


export async function GET() {
    try {
        await connectToDb();
        // Fetch all videos from MongoDB
        const videos = await Video.find({});

        // Return the video data as JSON
        return NextResponse.json(videos, { status: 200 });
    } catch (error) {
        console.error('Fetching videos error:', error);
        return NextResponse.json({ error: 'Error fetching videos' }, { status: 500 });
    }
}
