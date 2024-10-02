import { NextRequest, NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";

const qdrantUrl = process.env.QDRANT_URL;
const qdrantApiKey = process.env.QDRANT_API_KEY;

const qdrantClient = new QdrantClient({ url: qdrantUrl, apiKey: qdrantApiKey });

const COLLECTION_NAME = 'shake23';

export async function GET(req: NextRequest) {
  try {
    // Fetch a random sample of meetings (let's say 50)
    const searchResults = await qdrantClient.scroll(COLLECTION_NAME, {
      limit: 50,
      with_payload: true,
    });

    // Process the results to extract relevant data
    const meetingsData = searchResults.points.map(point => ({
      topic: point.payload?.topic || 'N/A',
      startTime: point.payload?.start_time || 'N/A',
      duration: point.payload?.duration || 'N/A',
      participants: point.payload?.participants || [],
      transcript: point.payload?.transcript || '',
    }));

    // Perform analytics on the data
    const analytics = {
      totalMeetings: meetingsData.length,
      averageDuration: calculateAverageDuration(meetingsData),
      mostFrequentParticipants: getMostFrequentParticipants(meetingsData),
      meetingLengths: getMeetingLengths(meetingsData),
      wordFrequency: getWordFrequency(meetingsData),
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}

function calculateAverageDuration(meetings) {
  const totalDuration = meetings.reduce((sum, meeting) => sum + parseFloat(meeting.duration), 0);
  return totalDuration / meetings.length;
}

function getMostFrequentParticipants(meetings) {
  const participantCounts = {};
  meetings.forEach(meeting => {
    meeting.participants.forEach(participant => {
      participantCounts[participant] = (participantCounts[participant] || 0) + 1;
    });
  });
  return Object.entries(participantCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));
}

function getMeetingLengths(meetings) {
  const lengthRanges = {
    '0-15 min': 0,
    '16-30 min': 0,
    '31-60 min': 0,
    '61-90 min': 0,
    '90+ min': 0
  };

  meetings.forEach(meeting => {
    const duration = parseFloat(meeting.duration);
    if (duration <= 15) lengthRanges['0-15 min']++;
    else if (duration <= 30) lengthRanges['16-30 min']++;
    else if (duration <= 60) lengthRanges['31-60 min']++;
    else if (duration <= 90) lengthRanges['61-90 min']++;
    else lengthRanges['90+ min']++;
  });

  return Object.entries(lengthRanges).map(([range, count]) => ({ range, count }));
}

function getWordFrequency(meetings) {
  const words = meetings.flatMap(meeting => meeting.transcript.toLowerCase().split(/\s+/));
  const wordCounts = {};
  words.forEach(word => {
    if (word.length > 3) {  // Ignore short words
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });
  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word, count]) => ({ word, count }));
}