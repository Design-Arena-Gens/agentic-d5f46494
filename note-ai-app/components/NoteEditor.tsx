'use client';

import { Note } from '@/types/note';

interface NoteEditorProps {
  note: Note;
  onUpdate: (updates: Partial<Note>) => void;
}

export default function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  return (
    <div className="flex-1 flex flex-col bg-white p-8 overflow-auto">
      <input
        type="text"
        value={note.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        className="text-3xl font-bold mb-6 border-none outline-none text-gray-800 placeholder-gray-300"
        placeholder="Note title..."
      />
      <textarea
        value={note.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        className="flex-1 text-lg border-none outline-none resize-none text-gray-700 placeholder-gray-300 leading-relaxed"
        placeholder="Start writing..."
      />
    </div>
  );
}
