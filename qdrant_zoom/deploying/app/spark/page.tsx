"use client";

import { ChatWindow } from "@/components/ChatWindow";
import { useState } from "react";

export default function SparkPage() {
  const [embeddingModel, setEmbeddingModel] = useState("text-embedding-ada-002");
  const [chatModel, setChatModel] = useState("openai");

  function handleModelChange(e: string) {
    setChatModel(e);
  }

  function formatAIResponse(response: string) {
    const meetings = JSON.parse(response);
    return (
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Relevant Past Meetings</h2>
        {meetings.map((meeting: any, index: number) => (
          <div key={index} className="mb-6 border-b pb-4">
            <h3 className="text-xl font-semibold mb-2">{meeting.title}</h3>
            <p><strong>Date:</strong> {meeting.date}</p>
            <p><strong>Attendees:</strong> {meeting.attendees.join(", ")}</p>
            <p><strong>Topics:</strong> {meeting.topics.join(", ")}</p>
            <p className="mt-2"><strong>Relevance:</strong> {meeting.relevance}</p>
          </div>
        ))}
      </div>
    );
  }

  const InfoCard = (
    <div className="rounded bg-[#25252d] w-full max-h-[85%] margin-auto">
      <h1 className="text-3xl md:text-4xl mb-4">Meeting Spark</h1>
      <p>
        This tool suggests relevant past meetings based on your current interests or needs.
      </p>
      <br />
      <h2>How to use:</h2>
      <ol className="list-decimal list-inside">
        <li>The embedding model is set to OpenAI's text-embedding-ada-002 for optimal performance.</li>
        <li>Choose a chat model below to process your queries.</li>
        <li>Enter your current interest, project, or need to find relevant past meetings.</li>
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
        Start by entering your current interest or need to discover relevant past meetings!
      </p>
    </div>
  );

  return (
    <ChatWindow
      endpoint={`api/chat/spark?embeddingModel=${embeddingModel}&chatModel=${chatModel}`}
      emptyStateComponent={InfoCard}
      showIntermediateStepsToggle={false}
      placeholder={"Enter your current interest or need, e.g., 'I'm working on a new marketing campaign for our product launch.'"}
      emoji="⚡"
      formatResult={formatAIResponse}
    />
  );
}