import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-5xl font-bold mb-8 text-center">
          Chat with Your Zoom Meetings
        </h1>
        <p className="text-2xl mb-8 text-center">
          A Qdrant app using Next.js and LangChain
        </p>
        <div className="flex justify-center space-x-4 mb-8">
          <Link
            href="/search"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Search Meetings
          </Link>
          <Link
            href="/recommend"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Recommend Meetings
          </Link>
          <Link
            href="/generate"
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Generate Meetings
          </Link>
        </div>
        <p className="text-center text-gray-500">
          Created by Thierry Damiba
        </p>
      </div>
    </main>
  );
}
