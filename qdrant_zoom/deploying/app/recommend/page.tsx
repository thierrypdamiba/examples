"use client";

import { ChatWindow } from "@/components/ChatWindow";
import { useState } from "react";

export default function RecommendPage() {
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
      <h1 className="text-3xl md:text-4xl mb-4">Get Meeting Recommendations</h1>
      <p>
        Welcome to the Meeting Recommendation tool. Get personalized meeting suggestions based on your role and goals.
      </p>
      <br />
      <h2>How it works:</h2>
      <ol className="list-decimal list-inside">
        <li>Provide your role and specific goal or challenge.</li>
        <li>Our AI analyzes your input and past meeting data.</li>
        <li>Receive a tailored meeting recommendation with title, topics, attendees, and date.</li>
      </ol>
      <br />
      <p>
        Start by describing your role and what you want to achieve, e.g., "As a product manager, I need to plan our next feature release."
      </p>
      <p className="mt-4 text-sm text-gray-400">
        Created by Thierry Damiba
      </p>
    </div>
  );

  return (
    <ChatWindow
      endpoint={`api/chat/recommend?embeddingModel=${embeddingModel}&chatModel=${chatModel}`}
      emptyStateComponent={InfoCard}
      showIntermediateStepsToggle={false}
      placeholder={"Describe your role and goal, e.g., 'As a marketing director, I need to plan our Q4 campaign strategy.'"}
      emoji="📅"
      formatResult={formatAIResponse}
    />
  );
}