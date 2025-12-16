'use client';

import { useState } from 'react';
import { Note } from '@/types/note';

interface AIPanelProps {
  note: Note;
  onInsertText: (text: string) => void;
}

export default function AIPanel({ note, onInsertText }: AIPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleAIRequest = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          noteContent: note.content,
        }),
      });

      if (!res.ok) {
        throw new Error('AI request failed');
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('AI error:', error);
      setResponse('Error: Failed to get AI response. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Expand Ideas', prompt: 'Expand on these ideas and suggest related concepts' },
    { label: 'Summarize', prompt: 'Summarize this note in a concise way' },
    { label: 'Action Items', prompt: 'Extract action items from this note' },
    { label: 'Brainstorm', prompt: 'Help me brainstorm new ideas related to this topic' },
  ];

  return (
    <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col">
      <div className="p-4 bg-purple-600 text-white">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
      </div>

      <div className="p-4 space-y-3">
        <div className="text-sm font-medium text-gray-700">Quick Actions</div>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                setPrompt(action.prompt);
              }}
              className="text-xs bg-white border border-gray-300 px-3 py-2 rounded hover:bg-gray-50 transition-colors text-gray-700"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask AI anything about your note..."
          className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={handleAIRequest}
          disabled={loading || !prompt.trim()}
          className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Thinking...' : 'Ask AI'}
        </button>

        {response && (
          <div className="mt-4 flex-1 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-gray-700">Response</div>
              <button
                onClick={() => {
                  onInsertText(response);
                  setResponse('');
                  setPrompt('');
                }}
                className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
              >
                Insert into Note
              </button>
            </div>
            <div className="flex-1 bg-white border border-gray-300 rounded-lg p-3 text-sm overflow-auto">
              <pre className="whitespace-pre-wrap font-sans text-gray-700">{response}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
