"use client";

import { ChatWindow } from "@/components/ChatWindow";
import { useState } from "react";

export default function GeneratePage() {
  const [embeddingModel, setEmbeddingModel] = useState("text-embedding-ada-002");
  const [chatModel, setChatModel] = useState("anthropic");

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
      <h1 className="text-3xl md:text-4xl mb-4">Generate Meeting Ideas</h1>
      <p>
        Welcome to the Meeting Generation tool. Get creative ideas for new meetings based on your goals and past meeting data.
      </p>
      <br />
      <h2>How it works:</h2>
      <ol className="list-decimal list-inside">
        <li>Describe your objectives or challenges you want to address.</li>
        <li>Our AI analyzes your input and past meeting patterns.</li>
        <li>Receive innovative meeting ideas with suggested formats, topics, and participants.</li>
      </ol>
      <br />
      <p>
        Start by describing what you want to achieve, e.g., "I need to brainstorm new product features for our tech-savvy users."
      </p>
      <p className="mt-4 text-sm text-gray-400">
        Created by Thierry Damiba
      </p>
    </div>
  );

  return (
    <ChatWindow
      endpoint={`api/chat/generate?embeddingModel=${embeddingModel}&chatModel=${chatModel}`}
      emptyStateComponent={InfoCard}
      showIntermediateStepsToggle={false}
      placeholder={"Describe your meeting objectives, e.g., 'Generate ideas for a team-building workshop to improve collaboration.'"}
      emoji="💡"
      formatResult={formatAIResponse}
    />
  );
}