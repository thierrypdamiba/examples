"use client";

import { useEffect, useState } from "react";
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetch('/api/chat/analytics')
      .then(response => response.json())
      .then(data => setAnalyticsData(data))
      .catch(error => console.error('Error fetching analytics:', error));
  }, []);

  if (!analyticsData) {
    return <div className="text-gray-800">Loading analytics...</div>;
  }

  const participantData = {
    labels: analyticsData.mostFrequentParticipants.map(p => p.name),
    datasets: [{
      data: analyticsData.mostFrequentParticipants.map(p => p.count),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
      ],
    }]
  };

  const meetingLengthsData = {
    labels: analyticsData.meetingLengths.map(l => l.range),
    datasets: [{
      label: 'Number of Meetings',
      data: analyticsData.meetingLengths.map(l => l.count),
      backgroundColor: '#36A2EB',
    }]
  };

  return (
    <div className="p-8 bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Meeting Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Most Frequent Participants</h2>
          <Pie data={participantData} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Meeting Lengths</h2>
          <Bar data={meetingLengthsData} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Most Frequent Words</h2>
          <ul className="list-disc pl-5">
            {analyticsData.wordFrequency.slice(0, 20).map((word, index) => (
              <li key={index} className="text-gray-700">{word.word}: {word.count}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">General Statistics</h2>
        <p className="text-gray-700">Total Meetings: {analyticsData.totalMeetings}</p>
        <p className="text-gray-700">Average Duration: {analyticsData.averageDuration.toFixed(2)} minutes</p>
      </div>
    </div>
  );
}