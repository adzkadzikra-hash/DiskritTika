import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { HelpCircle, CheckCircle, XCircle, ChevronRight, Award, RotateCcw } from 'lucide-react';

interface QuizPlatformProps {
  quizId: string;
  questions: QuizQuestion[];
  onQuizComplete: (score: number) => void;
}

export default function QuizPlatform({ quizId, questions, onQuizComplete }: QuizPlatformProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [answersStatus, setAnswersStatus] = useState<{ questionIndex: number; isCorrect: boolean }[]>([]);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const activeQuestion = questions[currentQuestionIndex];

  // Submit current answer
  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null || hasSubmitted) return;
    
    const isCorrect = selectedOptionIndex === activeQuestion.correctAnswer;
    setAnswersStatus(prev => [
      ...prev,
      { questionIndex: currentQuestionIndex, isCorrect }
    ]);
    setHasSubmitted(true);
  };

  // Move to next question or show summary
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setHasSubmitted(false);
    } else {
      setShowSummary(true);
      const correctAnswersCount = answersStatus.filter(a => a.isCorrect).length;
      onQuizComplete(correctAnswersCount);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setHasSubmitted(false);
    setAnswersStatus([]);
    setShowSummary(false);
  };

  // Final metrics
  const correctCount = answersStatus.filter(a => a.isCorrect).length;
  const scorePercent = Math.round((correctCount / questions.length) * 100);

  if (showSummary) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center max-w-xl mx-auto my-6 animate-fade">
        <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-200 text-yellow-500">
          <Award size={36} className="animate-pulse" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-1">Kuis Selesai!</h3>
        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold font-mono">Modul: {quizId.toUpperCase()}</p>

        {/* Big Score Bubble */}
        <div className="my-6">
          <div className="inline-block bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4">
            <span className="text-xs text-gray-400 font-semibold block uppercase">Nilai Akurasi</span>
            <span className={`text-4xl font-extrabold font-mono ${scorePercent >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
              {scorePercent}%
            </span>
            <span className="text-xs text-gray-500 block mt-1">
              ({correctCount} benar dari {questions.length} soal)
            </span>
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          {scorePercent >= 100 ? (
            <span className="font-medium text-green-700">Luar biasa! Pemahaman teori Anda sempurna. Semua soal dijawab dengan benar dengan logika analitik yang rapi.</span>
          ) : scorePercent >= 70 ? (
            <span className="font-medium text-emerald-700">Hasil yang bagus! Anda sudah memahami sebagian besar konsep inti dan siap melanjutkan materi berikutnya.</span>
          ) : (
            <span className="font-medium text-amber-700">Silakan pelajari kembali glosarium rumus di modul belajar untuk menyempurnakan ketelitian logika Anda.</span>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleResetQuiz}
            className="px-4 py-2.5 text-xs font-semibold border border-gray-300 rounded hover:bg-gray-50 text-gray-700 flex items-center gap-1.5 transition"
          >
            <RotateCcw size={14} /> Ulangi Kuis
          </button>
        </div>
      </div>
    );
  }

  // Active quiz render
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      {/* Progress header bar */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">
            KUIS LATIHAN INTERAKTIF
          </span>
          <h4 className="text-base font-semibold text-gray-900 mt-0.5">Pertanyaan {currentQuestionIndex + 1} dari {questions.length}</h4>
        </div>

        {/* Small math-style fraction indicator */}
        <div className="text-xs font-mono font-bold bg-slate-100 text-gray-700 px-2.5 py-1 rounded">
          {currentQuestionIndex + 1} / {questions.length} Soal
        </div>
      </div>

      {/* Progress micro-bar */}
      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-6">
        <div 
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question prompt */}
      <div className="text-base font-medium text-gray-900 mb-6 bg-slate-50/50 p-4 rounded-lg border border-slate-100 leading-relaxed flex gap-2">
        <HelpCircle size={18} className="text-blue-600 shrink-0 mt-1" />
        <div>{activeQuestion.question}</div>
      </div>

      {/* Options column list */}
      <div className="space-y-2.5">
        {activeQuestion.options.map((option, idx) => {
          const isSelected = selectedOptionIndex === idx;
          const isCorrectAnswer = idx === activeQuestion.correctAnswer;
          
          let optionStyle = "border-gray-200 hover:border-blue-300 hover:bg-blue-50/10";
          if (isSelected) optionStyle = "border-blue-600 bg-blue-50/30 text-blue-900 font-medium";
          
          if (hasSubmitted) {
            if (isCorrectAnswer) {
              optionStyle = "border-green-600 bg-green-50 text-green-900 font-medium";
            } else if (isSelected && !isCorrectAnswer) {
              optionStyle = "border-red-600 bg-red-50 text-red-900 font-medium";
            } else {
              optionStyle = "border-gray-100 opacity-60 cursor-not-allowed";
            }
          }

          return (
            <button
              key={idx}
              disabled={hasSubmitted}
              onClick={() => setSelectedOptionIndex(idx)}
              className={`w-full text-left p-4 rounded-lg border text-sm transition flex items-center justify-between ${optionStyle}`}
            >
              <div className="flex gap-3 items-center">
                <span className={`w-6 h-6 rounded-full font-mono font-semibold text-xs flex items-center justify-center shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-gray-600'}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{option}</span>
              </div>

              {/* Icon badges for answered states */}
              {hasSubmitted && (
                <div>
                  {isCorrectAnswer && <CheckCircle size={18} className="text-green-600 shrink-0" />}
                  {isSelected && !isCorrectAnswer && <XCircle size={18} className="text-red-500 shrink-0" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Action panel underneath answers */}
      <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-end">
        {!hasSubmitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedOptionIndex === null}
            className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm transition disabled:opacity-45 disabled:cursor-not-allowed"
          >
            Kirim Jawaban
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow-sm transition flex items-center gap-1"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Pertanyaan Berikutnya' : 'Selesaikan Kuis'} 
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* EXPLANATION BOX */}
      {hasSubmitted && (
        <div className={`mt-6 p-4 rounded-lg border text-xs leading-relaxed animate-fade ${selectedOptionIndex === activeQuestion.correctAnswer ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
          <div className="font-bold flex items-center gap-1.5 mb-1 text-sm uppercase tracking-wider">
            {selectedOptionIndex === activeQuestion.correctAnswer ? '🎉 Benar!' : '❌ Ops, Kurang Tepat!'}
          </div>
          <div className="font-medium text-gray-700 mt-1">Pembahasan & Logika:</div>
          <p className="text-gray-600 mt-0.5 leading-relaxed font-sans">{activeQuestion.explanation}</p>
        </div>
      )}
    </div>
  );
}
