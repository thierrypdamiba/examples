"use client";

import { ChatWindow } from "@/components/ChatWindow";
import { useState } from "react";

export default function AgentsPage() {
  const [embeddingModel, setEmbeddingModel] = useState("text-embedding-ada-002");
  const [chatModel, setChatModel] = useState("openai");

  function handleModdelChange(e: string) {
    setChatModel(e);
  }

  // Updated formatAIResponse function
  function formatAIResponse(response: string) {
    return (
      <div>
        <p className="whitespace-pre-wrap">{response}</p>
      </div>
    );
  }

  const InfoCard = (
    <div className="rounded bg-[#25252d] w-full max-h-[85%] margin-auto">
      <h1 className="text-3xl md:text-4xl mb-4">Chat with Your Zoom Meetings</h1>
      <p>
        Welcome to this Qdrant-powered application built with Next.js and LangChain. 
        Interact with your Zoom meeting transcripts using advanced language models.
      </p>
      <br />
      <h2>How it works:</h2>
      <ol className="list-decimal list-inside">
        <li>Your Zoom meeting transcripts are processed and stored using Qdrant vector database.</li>
        <li>LangChain is used to create a powerful natural language interface.</li>
        <li>Choose a chat model below to process your queries.</li>
        <li>Ask questions about your meetings or search for specific information in the chat window.</li>
      </ol>
      <br />
      <h2>Choose A Chat Model</h2>
      <select
        name="chatModel"
        id="chatModel"
        onChange={(e) => handleModdelChange(e.target.value)}
        className="bg-black"
      >
        <option value="openai">OpenAI</option>
        <option value="anthropic">Anthropic</option>
      </select>
      <br />
      <br />
      <p>
        Start by asking questions about your Zoom meetings, such as "What were the key points discussed in yesterday's marketing meeting?"
      </p>
      <p className="mt-4 text-sm text-gray-400">
        Created by Thierry Damiba
      </p>
    </div>
  );

  return (
    <ChatWindow
      endpoint={`api/chat/evaluate?embeddingModel=${embeddingModel}&chatModel=${chatModel}`}
      emptyStateComponent={InfoCard}
      showIntermediateStepsToggle={true}
      placeholder={"Ask about recent meetings, e.g., 'What was discussed in the last marketing meeting?'"}
      emoji="📅"
      formatResult={formatAIResponse} // New prop to format the result
    />
  );
}
