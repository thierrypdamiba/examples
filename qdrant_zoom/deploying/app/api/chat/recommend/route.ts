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
      max_tokens: 500,
      temperature: 0.7,
      system: "You are an expert meeting planner. Based on the user's role and goal, recommend a meeting with a title, topics, attendees, and date. Use the provided meeting data for context, but feel free to suggest new ideas that align with the user's needs. Format your response clearly with sections for Title, Topics, Attendees, and Date.",
      messages: [
        {
          role: "user",
          content: `Based on this role and goal: '${query}', and considering the following meeting data for context, recommend a meeting. Include a title, topics to discuss, potential attendees, and a suggested date.\n\nMeeting Data:\n${JSON.stringify(formattedResults, null, 2)}`
        }
      ],
    });

    const answer = anthropicResponse.content[0].text;

    // Return the answer without additional formatting
    return NextResponse.json(answer);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json('An error occurred while processing your request.', { status: 500 });
  }
}