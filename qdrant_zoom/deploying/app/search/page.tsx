"use client";

import { ChatWindow } from "@/components/ChatWindow";
import { useState } from "react";

export default function SearchPage() {
  const [embeddingModel, setEmbeddingModel] = useState("text-embedding-ada-002");
  const [chatModel, setChatModel] = useState("openai");

  function handleModelChange(e: string) {
    setChatModel(e);
  }

  function formatAIResponse(response: string) {
    return (
      <div>
        <p className="whitespace-pre-wrap">{response}</p>
      </div>
    );
  }

  const InfoCard = (
    <div className="rounded bg-[#25252d] w-full max-h-[85%] margin-auto">
      <h1 className="text-3xl md:text-4xl mb-4">Search Your Zoom Meetings</h1>
      <p>
        Welcome to the Zoom Meeting Search tool. Find specific information from your past meetings quickly and easily.
      </p>
      <br />
      <h2>How it works:</h2>
      <ol className="list-decimal list-inside">
        <li>Your Zoom meeting transcripts are indexed in the Qdrant vector database.</li>
        <li>Use natural language to search through your meeting content.</li>
        <li>Choose a chat model below to process your queries.</li>
        <li>Ask specific questions or search for topics discussed in your meetings.</li>
      </ol>
      <br />
      <h2>Choose A Chat Model</h2>
      <select
        name="chatModel"
        id="chatModel"
        onChange={(e) => handleModelChange(e.target.value)}
        className="bg-black"
      >
        <option value="openai">OpenAI</option>
        <option value="anthropic">Anthropic</option>
      </select>
      <br />
      <br />
      <p>
        Start by asking questions like "What were the action items from last week's team meeting?" or "Find discussions about the new product launch."
      </p>
      <p className="mt-4 text-sm text-gray-400">
        Created by Thierry Damiba
      </p>
    </div>
  );

  return (
    <ChatWindow
      endpoint={`api/chat/search?embeddingModel=${embeddingModel}&chatModel=${chatModel}`}
      emptyStateComponent={InfoCard}
      showIntermediateStepsToggle={true}
      placeholder={"Search your meetings, e.g., 'What were the key decisions made in the last project review?'"}
      emoji="🔍"
      formatResult={formatAIResponse}
    />
  );
}