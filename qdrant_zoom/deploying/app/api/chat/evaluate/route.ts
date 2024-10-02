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
      max_tokens: 300,
      temperature: 0,
      system: "You are an expert business analyst providing insights on corporate meeting data. Offer a concise, professional analysis. Use actual line breaks to separate sections. Do not mention AI or search results.",
      messages: [
        {
          role: "user",
          content: `Based on the following meeting data, provide a brief analysis in response to this query: '${query}'\n\nMeeting Data:\n${JSON.stringify(formattedResults, null, 2)}\n\nSynthesize the information to directly answer the query. If the information is insufficient, briefly state what's missing. Use actual line breaks to separate main points or sections.`
        }
      ],
    });

    const answer = anthropicResponse.content[0].text;

    // Format the answer with actual line breaks
    const formattedAnswer = answer.split('\n').join('\n\n');

    // Return the formatted answer
    return NextResponse.json(formattedAnswer);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json('An error occurred while processing your request.', { status: 500 });
  }
}