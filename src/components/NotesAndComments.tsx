import React, { useState } from 'react';
import { DiscussionComment } from '../types';
import { MessageSquare, Heart, Send, FileText, CheckCircle2 } from 'lucide-react';

interface NotesAndCommentsProps {
  lessonId: string;
  topicId: string;
  notesText: string;
  onSaveNotes: (text: string) => void;
  discussions: DiscussionComment[];
  onAddComment: (commentText: string) => void;
}

export default function NotesAndComments({ 
  lessonId, 
  topicId, 
  notesText, 
  onSaveNotes, 
  discussions, 
  onAddComment 
}: NotesAndCommentsProps) {
  const [currentNote, setCurrentNote] = useState<string>(notesText);
  const [newComment, setNewComment] = useState<string>('');
  const [localDiscussions, setLocalDiscussions] = useState<DiscussionComment[]>(discussions);
  const [saveStatus, setSaveStatus] = useState<boolean>(false);

  // Sync state if lessonId changes
  React.useEffect(() => {
    setCurrentNote(notesText);
    setSaveStatus(false);
  }, [lessonId, notesText]);

  // Sync discussions database when topicId modifies
  React.useEffect(() => {
    setLocalDiscussions(discussions);
  }, [topicId, discussions]);

  const handleSaveNotesPress = () => {
    onSaveNotes(currentNote);
    setSaveStatus(true);
    setTimeout(() => {
      setSaveStatus(false);
    }, 2000);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddComment(newComment.trim());
    
    // Add locally for instant UI update
    const newlyCreated: DiscussionComment = {
      id: `d-${Date.now()}`,
      author: "Anda (Mahasiswa)",
      avatar: "AM",
      role: "Pembelajar Aktif",
      content: newComment.trim(),
      timestamp: "Baru saja",
      likes: 0
    };
    setLocalDiscussions(prev => [newlyCreated, ...prev]);
    setNewComment('');
  };

  const handleToggleLike = (commId: string) => {
    const updated = localDiscussions.map(c => {
      if (c.id === commId) {
        const isLiked = c.likedByUser;
        return {
          ...c,
          likes: isLiked ? c.likes - 1 : c.likes + 1,
          likedByUser: !isLiked
        };
      }
      return c;
    });
    setLocalDiscussions(updated);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-200">
      {/* 1. STUDENT INDIVIDUAL NOTEPAD */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800">
            <FileText size={18} className="text-blue-600" />
            <h4 className="text-base font-semibold">Buku Catatan Belajar Pribadi</h4>
          </div>
          
          {saveStatus && (
            <span className="text-xs text-green-600 font-medium flex items-center gap-1 animate-fade">
              <CheckCircle2 size={13} /> Tersimpan
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
          Tulis rangkuman rumus, teori, atau coretan logika pribadi Anda di sini. Catatan Anda akan tetap terjaga selama sesi belajar aktif ini berlangsung.
        </p>

        <div className="space-y-3">
          <textarea
            value={currentNote}
            onChange={(e) => {
              setCurrentNote(e.target.value);
              setSaveStatus(false);
            }}
            placeholder="Tulis teorema penting atau rumus saku Anda di sini... (Contoh: Hukum De Morgan (a+b)' = a'b')"
            className="w-full h-44 bg-slate-50 border border-gray-300 rounded-lg p-3 text-sm text-gray-800 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
          />

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">
              {currentNote.length} karakter ditulis
            </span>
            <button
              onClick={handleSaveNotesPress}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded shadow-sm transition"
            >
              Simpan Catatan
            </button>
          </div>
        </div>
      </div>

      {/* 2. TOPIC QUESTIONS AND DISCUSSIONS FORUM */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-800">
          <MessageSquare size={18} className="text-blue-600" />
          <h4 className="text-base font-semibold">Forum Tanya Jawab & Diskusi Modul</h4>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
          Punya pertanyaan tentang materi di atas? Diskusikan kesulitan logika atau teorema bersama dosen pengampu dan rekan mahasiswa lainnya secara akademik.
        </p>

        {/* Post Comment Input Form */}
        <form onSubmit={handlePostComment} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Tanyakan perihal rumus atau hukum logika..."
            className="flex-1 bg-slate-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition shadow-sm"
          >
            <Send size={14} />
          </button>
        </form>

        {/* Dynamic comments render list */}
        <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
          {localDiscussions.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded">
              Belum ada diskusi di topik ini. Jadilah yang pertama bertanya!
            </div>
          ) : (
            localDiscussions.map((comm) => (
              <div key={comm.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex gap-3 text-xs leading-relaxed">
                {/* Avatar Icon */}
                <span className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                  {comm.avatar}
                </span>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900 block sm:inline mr-1">{comm.author}</span>
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-1 py-0.2 rounded font-medium">{comm.role}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">{comm.timestamp}</span>
                  </div>
                  
                  <p className="text-gray-700 font-sans">{comm.content}</p>
                  
                  {/* Actions buttons */}
                  <div className="pt-1.5 flex items-center gap-3">
                    <button 
                      onClick={() => handleToggleLike(comm.id)}
                      className={`flex items-center gap-1.5 font-medium transition ${comm.likedByUser ? 'text-red-600Scale' : 'text-gray-400 hover:text-red-500'}`}
                    >
                      <Heart size={12} fill={comm.likedByUser ? '#DC2626' : 'transparent'} className={comm.likedByUser ? 'text-red-600' : ''} /> 
                      <span className="text-[10px]">{comm.likes} Suka</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
