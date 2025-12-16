'use client';

import { Note } from '@/types/note';

interface NoteListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

export default function NoteList({
  notes,
  selectedNote,
  onSelectNote,
  onDeleteNote,
}: NoteListProps) {
  return (
    <div className="flex-1 overflow-auto">
      {notes.length === 0 ? (
        <div className="p-4 text-center text-gray-400">
          No notes yet. Create one to get started!
        </div>
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedNote?.id === note.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
            }`}
            onClick={() => onSelectNote(note)}
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold text-gray-800 truncate flex-1">
                {note.title || 'Untitled'}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Delete this note?')) {
                    onDeleteNote(note.id);
                  }
                }}
                className="text-red-500 hover:text-red-700 ml-2 text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-500 truncate">
              {note.content || 'No content'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {note.updatedAt.toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
