import { NextRequest, NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { OpenAI } from "openai";
import { Anthropic } from "@anthropic-ai/sdk";

// Load environment variables
const qdrantUrl = process.env.QDRANT_URL;
const qdrantApiKey = process.env.QDRANT_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

// Initialize clients
const qdrantClient = new QdrantClient({ url: qdrantUrl, apiKey: qdrantApiKey });
const openai = new OpenAI({ apiKey: openaiApiKey });
const anthropic = new Anthropic({ apiKey: anthropicApiKey });

const COLLECTION_NAME = 'shake23';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const query = messages[messages.length - 1].content;

    // Get embedding from OpenAI
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query,
    });
    const queryVector = embeddingResponse.data[0].embedding;

    // Search Qdrant
    const searchResults = await qdrantClient.search(COLLECTION_NAME, {
      vector: queryVector,
      limit: 5,
    });

    // Format search results
    const formattedResults = searchResults.map(hit => ({
      Score: hit.score,
      Topic: hit.payload?.topic || 'N/A',
      "Start Time": hit.payload?.start_time || 'N/A',
      Duration: hit.payload?.duration || 'N/A',
      Summary: hit.payload?.summary || 'N/A',
    }));

    // Get response from Anthropic
    const anthropicResponse = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      temperature: 0.5,
      system: "You are an expert meeting analyst. Based on the user's current interest or need, suggest relevant past meetings. Format your response as a JSON array of meeting objects, each containing title, date, attendees, topics, and a brief explanation of its relevance.",
      messages: [
        {
          role: "user",
          content: `Based on this current interest or need: '${query}', and considering the following meeting data, suggest up to 3 relevant past meetings. Format your response as a JSON array of meeting objects.\n\nMeeting Data:\n${JSON.stringify(formattedResults, null, 2)}`
        }
      ],
    });

    const answer = anthropicResponse.content[0].text;

    // Parse the JSON response and return it
    try {
      const parsedAnswer = JSON.parse(answer);
      return NextResponse.json(parsedAnswer);
    } catch (parseError) {
      console.error('Error parsing Anthropic response:', parseError);
      return NextResponse.json({ error: 'Invalid response format from AI model' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request', details: error.message }, { status: 500 });
  }
}