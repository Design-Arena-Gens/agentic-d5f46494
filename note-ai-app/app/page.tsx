'use client';

import { useState } from 'react';
import { Note } from '@/types/note';
import NoteEditor from '@/components/NoteEditor';
import NoteList from '@/components/NoteList';
import AIPanel from '@/components/AIPanel';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showAI, setShowAI] = useState(false);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
    if (selectedNote?.id === id) {
      setSelectedNote({ ...selectedNote, ...updates, updatedAt: new Date() });
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">NoteAI</h1>
          <button
            onClick={createNote}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + New Note
          </button>
        </div>
        <NoteList
          notes={notes}
          selectedNote={selectedNote}
          onSelectNote={setSelectedNote}
          onDeleteNote={deleteNote}
        />
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Last updated: {selectedNote.updatedAt.toLocaleString()}
              </div>
              <button
                onClick={() => setShowAI(!showAI)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                {showAI ? 'Hide AI' : 'AI Assistant'}
              </button>
            </div>
            <div className="flex-1 flex overflow-hidden">
              <NoteEditor
                note={selectedNote}
                onUpdate={(updates) => updateNote(selectedNote.id, updates)}
              />
              {showAI && (
                <AIPanel
                  note={selectedNote}
                  onInsertText={(text) => {
                    updateNote(selectedNote.id, {
                      content: selectedNote.content + '\n\n' + text
                    });
                  }}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl">Select a note or create a new one to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
