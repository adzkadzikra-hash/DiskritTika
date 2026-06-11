/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Cpu, 
  Calculator, 
  GitBranch, 
  BarChart3, 
  BookMarked, 
  Trophy, 
  ArrowRight, 
  CheckCircle, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown, 
  Menu, 
  X, 
  Award, 
  MessageSquare, 
  ArrowUpRight,
  Sparkles,
  Play
} from 'lucide-react';
import { INITIAL_MODULES, QUIZZES_DATA, INITIAL_DISCUSSIONS } from './data/coursesData';
import { UserState, Module, Lesson } from './types';

// Importing our custom interactive sandboxes
import BooleanInteractive from './components/BooleanInteractive';
import PeluangInteractive from './components/PeluangInteractive';
import GrafInteractive from './components/GrafInteractive';
import QuizPlatform from './components/QuizPlatform';
import CertificateViewer from './components/CertificateViewer';
import NotesAndComments from './components/NotesAndComments';

export default function App() {
  // Application routing and user state
  const [userState, setUserState] = useState<UserState>({
    currentView: 'landing',
    activeModuleSlug: 'aljabar-boolean',
    activeLessonSlug: 'definisi-dan-pengantar',
    viewingCertificate: false,
    completedLessons: ['m1-l1'], // Start with 1 completed lesson for realistic progress feel
    quizScores: {},
    notes: {},
    sidebarOpen: false
  });

  // Dynamic modules list to track lesson completion & module percentages
  const [modules, setModules] = useState<Module[]>(() => {
    // Recalculate initial progress based on completedLessons
    return INITIAL_MODULES.map(m => {
      const completedCount = m.lessons.filter(l => userState.completedLessons.includes(l.id)).length;
      const progress = Math.round((completedCount / m.lessons.length) * 100);
      return { ...m, progress };
    });
  });

  // Dynamic comments state
  const [allComments, setAllComments] = useState<Record<string, any[]>>(INITIAL_DISCUSSIONS);

  // Sleek alert/toast notifications state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Sleep achievement modal trigger
  const [achievementModal, setAchievementModal] = useState<{
    show: boolean;
    title: string;
    desc: string;
  } | null>(null);

  // Helper trigger to show toast message
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Find active module & lesson objects based on state slugs
  const activeModule = modules.find(m => m.slug === userState.activeModuleSlug) || modules[0];
  const activeLesson = activeModule.lessons.find(l => l.slug === userState.activeLessonSlug) || activeModule.lessons[0];

  // Total course completion calculations
  const totalLessonsCount = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalCompletedCount = userState.completedLessons.length;
  const courseProgressPercent = Math.round((totalCompletedCount / totalLessonsCount) * 100);

  // Handle marking a lesson completed
  const handleMarkLessonCompleted = (lessonId: string) => {
    if (userState.completedLessons.includes(lessonId)) {
      triggerToast("Materi ini sudah pernah diselesaikan.");
      return;
    }

    const updatedCompleted = [...userState.completedLessons, lessonId];
    
    // Update local modules structural progress
    const updatedModules = modules.map(m => {
      const completedCount = m.lessons.filter(l => updatedCompleted.includes(l.id) || l.id === lessonId).length;
      const progress = Math.round((completedCount / m.lessons.length) * 100);
      
      // If module reaches 100% completion first time, launch achievement popup!
      if (progress === 100 && m.progress < 100) {
        setAchievementModal({
          show: true,
          title: `Selamat! Modul ${m.title} Selesai 🎉`,
          desc: `Anda sukses menyempurnakan seluruh materi pembelajaran, kuis, serta glosarium pembuktian pada topik kognitif ${m.title}! Jaga konsistensi belajar Anda.`
        });
      }

      return { ...m, progress };
    });

    setUserState(prev => ({
      ...prev,
      completedLessons: updatedCompleted
    }));
    setModules(updatedModules);
    triggerToast("Materi berhasil diselesaikan! +15XP");
  };

  // Handle saving lesson notepad entries
  const handleSaveNotes = (lessonId: string, noteText: string) => {
    setUserState(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [lessonId]: noteText
      }
    }));
  };

  // Handle posting a comment dynamically
  const handleAddComment = (commentText: string) => {
    const fresh: any = {
      id: `d-${Date.now()}`,
      author: "Anda (Mahasiswa)",
      avatar: "AM",
      role: "Pembelajar Aktif",
      content: commentText,
      timestamp: "Baru saja",
      likes: 0
    };

    setAllComments(prev => ({
      ...prev,
      [userState.activeModuleSlug]: [fresh, ...(prev[userState.activeModuleSlug] || [])]
    }));
    triggerToast("Pertanyaan berhasil diposting di forum.");
  };

  // Navigator handles
  const handleNextLesson = () => {
    // Find current index
    const activeModuleIdx = modules.findIndex(m => m.slug === userState.activeModuleSlug);
    const activeLessonIdx = activeModule.lessons.findIndex(l => l.slug === userState.activeLessonSlug);

    if (activeLessonIdx < activeModule.lessons.length - 1) {
      // Jump to next lesson in same module
      const nextLesson = activeModule.lessons[activeLessonIdx + 1];
      setUserState(prev => ({
        ...prev,
        activeLessonSlug: nextLesson.slug,
        viewingCertificate: false
      }));
    } else if (activeModuleIdx < modules.length - 1) {
      // Jump to first lesson of next module
      const nextMod = modules[activeModuleIdx + 1];
      setUserState(prev => ({
        ...prev,
        activeModuleSlug: nextMod.slug,
        activeLessonSlug: nextMod.lessons[0].slug,
        viewingCertificate: false
      }));
      triggerToast(`Melanjutkan ke modul: ${nextMod.title}`);
    } else {
      // Reached very end, prompt certificate opening
      setUserState(prev => ({
        ...prev,
        viewingCertificate: true
      }));
      triggerToast("Semua materi selesai! Klaim sertifikat Anda.");
    }
  };

  const handlePrevLesson = () => {
    const activeModuleIdx = modules.findIndex(m => m.slug === userState.activeModuleSlug);
    const activeLessonIdx = activeModule.lessons.findIndex(l => l.slug === userState.activeLessonSlug);

    if (activeLessonIdx > 0) {
      const prevLesson = activeModule.lessons[activeLessonIdx - 1];
      setUserState(prev => ({
        ...prev,
        activeLessonSlug: prevLesson.slug,
        viewingCertificate: false
      }));
    } else if (activeModuleIdx > 0) {
      const prevMod = modules[activeModuleIdx - 1];
      setUserState(prev => ({
        ...prev,
        activeModuleSlug: prevMod.slug,
        activeLessonSlug: prevMod.lessons[prevMod.lessons.length - 1].slug,
        viewingCertificate: false
      }));
    }
  };

  const jumpToLesson = (modSlug: string, lesSlug: string) => {
    setUserState(prev => ({
      ...prev,
      activeModuleSlug: modSlug,
      activeLessonSlug: lesSlug,
      viewingCertificate: false,
      sidebarOpen: false
    }));
  };

  const enterDashboard = (modSlug ?: string, lesSlug ?: string) => {
    setUserState(prev => ({
      ...prev,
      currentView: 'dashboard',
      viewingCertificate: false,
      activeModuleSlug: modSlug || prev.activeModuleSlug,
      activeLessonSlug: lesSlug || prev.activeLessonSlug
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] font-sans text-gray-100 selection:bg-purple-950 selection:text-purple-200">
      
      {/* GLOBAL TOAST BANNER */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1F1F1F] text-white px-5 py-3.5 rounded-lg border border-gray-700 shadow-xl flex items-center gap-3 animate-fade text-sm max-w-sm">
          <BookMarked className="text-blue-400 shrink-0" size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ACHIEVEMENT CARD MODAL OVERLAY */}
      {achievementModal?.show && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-gray-200 shadow-2xl text-center space-y-5 relative">
            <button 
              onClick={() => setAchievementModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto text-yellow-600 border border-yellow-200">
              <Trophy size={36} className="animate-bounce" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-gray-900">{achievementModal.title}</h3>
              <p className="text-xs text-yellow-600 font-bold uppercase tracking-wider font-mono">Modul Selesai Sempurna</p>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              {achievementModal.desc}
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  setAchievementModal(null);
                  setUserState(p => ({ ...p, viewingCertificate: true }));
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded transition uppercase tracking-wide"
              >
                Lihat Sertifikat Pembelajar
              </button>
            </div>
          </div>
        </div>
      )}


      {/* LANDING VIEW */}
      {userState.currentView === 'landing' ? (
        <div className="animate-fade">
          
          {/* NAVBAR */}
          <nav className="sticky top-0 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-850 z-30 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.reload()}>
                <div className="relative">
                  {/* Premium static outline wrapper */}
                  <div className="absolute -inset-0.5 bg-gradient-to-tr from-violet-600 to-fuchsia-500 rounded-xl opacity-40 transition duration-300 group-hover:opacity-100"></div>
                  
                  <div className="relative p-2.5 bg-slate-950 border border-violet-500/30 text-violet-400 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:border-violet-400 group-hover:text-white shadow-lg">
                    <GraduationCap size={20} className="relative z-10" />
                    <Cpu size={9} className="absolute bottom-1 right-1 text-fuchsia-400 font-bold" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-white tracking-wide leading-none font-sans">
                    DISKRI<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 font-extrabold">TIKA</span>
                  </span>
                  <span className="text-[8px] text-gray-400 font-mono tracking-widest uppercase mt-1">MATH ACADEMY</span>
                </div>
              </div>

              {/* Central navigation scroll menu */}
              <div className="hidden md:flex items-center gap-7 text-[13px] font-semibold text-gray-300">
                <a href="#hero" className="hover:text-violet-400 transition-colors duration-200">Home</a>
                <a href="#materi" className="hover:text-violet-400 transition-colors duration-200">Silabus</a>
                <a href="#fitur" className="hover:text-violet-400 transition-colors duration-200">Fitur Platform</a>
                <a href="#alur" className="hover:text-violet-400 transition-colors duration-200">Metode Belajar</a>
              </div>

              <div>
                <button
                  onClick={() => enterDashboard()}
                  className="relative group overflow-hidden px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-550 hover:to-indigo-550 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition duration-300 shadow-[0_4px_20px_-4px_rgba(139,92,246,0.3)] active:scale-95 cursor-pointer"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    Mulai Belajar <ArrowRight size={14} className="group-hover:translate-x-1 transition duration-300" />
                  </span>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 transition duration-500 ease-out z-0"></div>
                </button>
              </div>
            </div>
          </nav>

          <header id="hero" className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Written contents left */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-950/40 border border-violet-800/50 text-violet-300 text-xs font-semibold rounded-full uppercase tracking-wider">
                <Sparkles size={12} className="text-violet-400" /> Platform Belajar Matematika Diskrit Modern
              </span>

              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
                Belajar Matematika Diskrit Lebih Terstruktur, Interaktif, dan Mudah Dipahami
              </h1>

              <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-xl font-sans">
                Pelajari Aljabar Boolean, Peluang, Permutasi, Kombinasi, dan Teori Graf melalui materi yang rapi, visual interaktif sandbox, kuis uji pemahaman, serta pelacak progress belajar mandiri.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => enterDashboard()}
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold uppercase tracking-wider rounded-md transition duration-200 shadow-lg shadow-violet-600/25 flex items-center gap-1"
                >
                  Mulai Belajar Sekarang <ArrowRight size={14} />
                </button>
                <a
                  href="#materi"
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-gray-200 text-xs font-bold uppercase tracking-wider rounded-md transition duration-200 flex items-center gap-1"
                >
                  Lihat Kurikulum Materi
                </a>
              </div>
            </div>

            {/* Illustrative preview right */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden hidden sm:block">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-violet-600"></div>
              
              {/* Fake Top controls browser card */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                  <span className="text-[10px] text-gray-400 font-mono ml-2">diskritlearn-dashboard/node-explorer</span>
                </div>
                <span className="text-[10px] bg-emerald-950/50 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-900/50 font-semibold uppercase">
                  SIMULASI AKTIF
                </span>
              </div>

              {/* Fake visual elements */}
              <div className="space-y-4">
                {/* Visual node connection schema */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4 flex justify-around items-center h-32 relative">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                    <line x1="80" y1="30" x2="160" y2="30" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3,3" />
                    <line x1="160" y1="30" x2="240" y2="80" stroke="#10B981" strokeWidth="2.5" />
                    <line x1="80" y1="30" x2="80" y2="100" stroke="#8b5cf6" strokeWidth="2" />
                    <line x1="80" y1="100" x2="240" y2="80" stroke="#8b5cf6" strokeWidth="1.5" />
                  </svg>
                  
                  <div className="bg-slate-900 border border-violet-500/50 rounded-lg p-2 flex flex-col items-center shadow-xs z-10 w-16">
                    <span className="font-mono text-xs font-bold text-violet-400">v1</span>
                    <span className="text-[8px] text-gray-400">A = 1</span>
                  </div>

                  <div className="bg-slate-900 border border-emerald-500/50 rounded-lg p-2 flex flex-col items-center shadow-xs z-10 w-16">
                    <span className="font-mono text-xs font-bold text-emerald-400">v2</span>
                    <span className="text-[8px] text-gray-400">B = 0</span>
                  </div>

                  <div className="bg-violet-600 text-white rounded-lg p-2 flex flex-col items-center shadow-xs z-10 w-18">
                    <span className="font-mono text-xs font-bold">f(v1 &middot; v2)</span>
                    <span className="text-[8px] text-violet-200">AND GATE</span>
                  </div>
                </div>

                {/* Simulated lesson lists progress */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950/40 rounded-lg p-3 border border-slate-800/80 flex items-center gap-2">
                    <BookOpen size={16} className="text-violet-400" />
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block animate-pulse">Topik Teori</span>
                      <span className="text-xs font-bold text-gray-200 font-sans">Aljabar Boolean</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/40 rounded-lg p-3 border border-slate-800/80 flex items-center gap-2">
                    <GitBranch size={16} className="text-emerald-400" />
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Submateri</span>
                      <span className="text-xs font-bold text-gray-200 font-sans">Isomorfik & Planar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* STATS SECTION */}
          <section className="bg-slate-900/40 border-t border-b border-slate-800 py-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-1">
                <span className="text-3xl font-extrabold font-mono text-violet-400">3</span>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Topik Utama Berbasis Modul</p>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-extrabold font-mono text-violet-400">20+</span>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Syllabus Submateri Pendek</p>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-extrabold font-mono text-violet-400">A+</span>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Kuis & Pembahasan Detail</p>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-extrabold font-mono text-violet-400">100%</span>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Pelacak Progress Interaktif</p>
              </div>
            </div>
          </section>

          {/* COURSES CARD CURRICULUM SELECTOR */}
          <section id="materi" className="max-w-7xl mx-auto px-6 py-16 space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs text-violet-400 font-extrabold uppercase tracking-widest font-mono">
                SILLABUS DASAR KAMPUS
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                Materi Utama & Ruang Lingkup Kajian
              </h2>
              <p className="text-sm text-gray-400 max-w-xl mx-auto">
                Silakan pilih lingkup pembelajaran matematika diskrit yang Anda minati di bawah ini. Setiap bagian dirancang modular dan bebas diakses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {modules.map((m) => {
                // Determine icon or color style based on mod slug
                let headerColor = "bg-blue-600";
                let badgeTxt = "Logic & Digital System";
                let visualEl = null;

                if (m.slug === 'aljabar-boolean') {
                  headerColor = "from-blue-600 to-indigo-600";
                  badgeTxt = "Logic & Digital System";
                  visualEl = <Cpu size={24} className="text-blue-100" />;
                } else if (m.slug === 'peluang-dan-kombinatorika') {
                  headerColor = "from-emerald-600 to-teal-600";
                  badgeTxt = "Probability & Counting";
                  visualEl = <Calculator size={24} className="text-emerald-100" />;
                } else if (m.slug === 'teori-graf') {
                  headerColor = "from-purple-600 to-fuchsia-600";
                  badgeTxt = "Graph Theory";
                  visualEl = <GitBranch size={24} className="text-purple-100" />;
                }

                return (
                  <div key={m.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:shadow-xl hover:border-slate-700 transition-all duration-300 flex flex-col justify-between">
                    
                    {/* Header bar thumbnail card with abstract background */}
                    <div className={`p-6 bg-gradient-to-r ${headerColor} text-white space-y-3 relative overflow-hidden`}>
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-0.5 bg-white/20 text-white rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
                          {badgeTxt}
                        </span>
                        {visualEl}
                      </div>
                      <h3 className="text-lg font-bold leading-tight">{m.title}</h3>
                    </div>

                    {/* Description and syllabus lessons */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                      <div className="space-y-3">
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {m.slug === 'aljabar-boolean' 
                            ? "Belajar konsep dasar matematika aljabar Boolean, operator logika AND/OR, hukum De Morgan, bentuk kanonik, SOP/POS, gerbang dioda komputer, hingga penyederhanaan K-Map."
                            : m.slug === 'peluang-dan-kombinatorika'
                            ? "Mempelajari aturan kemungkinan pengisian tempat, permutasi siklik atau melingkar, kombinasi objek, hingga kombinasi dengan pengulangan (multiset)."
                            : "Menembus dasar teori graf isomorfik, penyusunan matriks ketetanggaan, uji planaritas rumus Euler, Teorema Kuratowski, hingga visual pembentukan graf dan kaitan di bidang pcb."
                          }
                        </p>

                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">Materi Tersedia:</span>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-300">
                            {m.lessons.slice(0, 4).map((les, idx) => (
                              <div key={les.id} className="flex items-center gap-1.5 truncate">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                                <span className="truncate">{les.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Course progress simulation bar */}
                      <div className="space-y-2 pt-3 border-t border-slate-800">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Estimasi: <strong className="text-gray-200">{m.lessons.length * 15} Menit</strong></span>
                          <span className="font-bold text-violet-400 font-mono">{m.progress}% Selesai</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                          <div className="bg-violet-600 h-full transition-all duration-300" style={{ width: `${m.progress}%` }}></div>
                        </div>
                      </div>

                      <button
                        onClick={() => enterDashboard(m.slug, m.lessons[0].slug)}
                        className="w-full py-2.5 bg-violet-600/10 hover:bg-violet-600 hover:text-white text-violet-450 text-xs font-bold uppercase tracking-wider rounded transition duration-200 block text-center border border-violet-800/30 hover:border-transparent"
                      >
                        Pelajari Modul
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* FEATURES SECTION */}
          <section id="fitur" className="bg-slate-900/10 border-t border-b border-slate-800/80 py-16">
            <div className="max-w-7xl mx-auto px-6 space-y-12">
              <div className="text-center space-y-2">
                <span className="text-xs text-violet-400 font-extrabold uppercase tracking-widest font-mono">FITUR UNGGULAN KELAS</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Kelebihan Mengapa Belajar Di Sini</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div id="fitur-boolean-sandbox" className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-violet-500/50 transition duration-300 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="w-10 h-10 rounded-lg bg-violet-950/80 text-violet-400 flex items-center justify-center font-bold">01</span>
                    <h3 className="text-base font-bold text-white">Sandbox Edukasi Kebenaran</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Tidak hanya teks bacaan. Dilengkapi dengan simulator Aljabar Boolean, penyederhanaan K-Map interaktif, serta simulator flow gerbang logika.
                    </p>
                  </div>
                  <div className="pt-5">
                    <button
                      onClick={() => enterDashboard('aljabar-boolean', 'definisi-dan-pengantar')}
                      className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold uppercase tracking-wider rounded transition duration-200 flex items-center justify-center gap-1.5 shadow-md shadow-violet-600/10 cursor-pointer"
                    >
                      Buka Simulator Boolean <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition duration-300 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="w-10 h-10 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center font-bold">02</span>
                    <h3 className="text-base font-bold text-white">Kalkulator Kombinatorik Live</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Tinggal masukkan variabel n dan r, lalu saksikan kalkulator memecah proses hitung dengan detail, memperjelas substitusi angka langsung ke rumus.
                    </p>
                  </div>
                  <div className="pt-5">
                    <button
                      onClick={() => enterDashboard('peluang-dan-kombinatorika', 'aturan-pengisian-tempat')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded transition duration-200 flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer"
                    >
                      Mulai Hitung Kombinatorik <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-fuchsia-500/50 transition duration-300 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="w-10 h-10 rounded-lg bg-fuchsia-950/80 text-fuchsia-400 flex items-center justify-center font-bold">03</span>
                    <h3 className="text-base font-bold text-white">Pembuktian Graf & Stepper Dual</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Tarik simpul untuk melihat visualisasi matriks, klik rumus planaritas, serta jalankan asisten animasi pembuatan graf dual tahap demi tahap.
                    </p>
                  </div>
                  <div className="pt-5">
                    <button
                      onClick={() => enterDashboard('teori-graf', 'pengantar-dan-isomorfik')}
                      className="w-full py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-bold uppercase tracking-wider rounded transition duration-200 flex items-center justify-center gap-1.5 shadow-md shadow-fuchsia-600/10 cursor-pointer"
                    >
                      Coba Simulator Graf <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* LEARNING FLOW SEC (ALUR BELAJAR) */}
          <section id="alur" className="max-w-7xl mx-auto px-6 py-16 space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs text-violet-400 font-extrabold uppercase tracking-widest font-mono">ALUR BELAJAR MANDIRI</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">4 Langkah Penguasaan Teori Konsep</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center space-y-3 relative z-10 hover:border-violet-500/30 transition duration-300">
                <span className="text-2xl font-bold text-violet-500/30 font-mono">01</span>
                <h4 className="text-sm font-bold text-white">Pilih Modul Pembelajaran</h4>
                <p className="text-xs text-gray-400">Mulai dari operator Boolean dasar, permutasi rumus kombinasi, atau dasar graf planar.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center space-y-3 relative z-10 hover:border-violet-500/30 transition duration-300">
                <span className="text-2xl font-bold text-violet-500/30 font-mono">02</span>
                <h4 className="text-sm font-bold text-white">Gunakan Sandbox Interaktif</h4>
                <p className="text-xs text-gray-400">Ubah input digital, gerakkan simpul edge, serta hitung permutasi kata kesukaan secara bebas.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center space-y-3 relative z-10 hover:border-violet-500/30 transition duration-300">
                <span className="text-2xl font-bold text-violet-500/30 font-mono">03</span>
                <h4 className="text-sm font-bold text-white">Evaluasi Dengan Kuis Pilihan</h4>
                <p className="text-xs text-gray-400">Latih ketelitian Anda dengan menjawab soal kuis pilihan ganda lengkap dibarengi pembahasan.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center space-y-3 relative z-10 hover:border-violet-500/30 transition duration-300">
                <span className="text-2xl font-bold text-violet-500/30 font-mono">04</span>
                <h4 className="text-sm font-bold text-white">Pantau Capaian & Klaim Sertif</h4>
                <p className="text-xs text-gray-400">Verifikasi progres ketelitian Anda, kumpulkan XP kelulusan, lalu klaim sertifikat verifikatif resmi.</p>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 text-xs leading-relaxed">
              <div className="md:col-span-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-[#0056D2] text-white rounded font-bold">DT</span>
                  <span className="font-bold text-lg text-white">DiskritTika</span>
                </div>
                <p className="max-w-xs text-slate-400 leading-6">
                  Situs pembelajaran interaktif matematika diskrit modern untuk menunjang kualitas riset saintek, informatika, dan teknik komputer digital di Indonesia.
                </p>
              </div>

              <div className="md:col-span-3 space-y-3">
                <h4 className="text-white font-bold uppercase tracking-wider">Akses Cepat</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#hero" className="hover:text-white text-xs transition">Halaman Awal</a></li>
                  <li><a href="#materi" className="hover:text-white text-xs transition">Kurikulum Kuliah</a></li>
                  <li><a href="#fitur" className="hover:text-white text-xs transition">Fitur Sandbox</a></li>
                </ul>
              </div>

              <div className="md:col-span-4 space-y-3">
                <h4 className="text-white font-bold uppercase tracking-wider">Submateri Matematika</h4>
                <div className="grid grid-cols-2 gap-2 text-slate-400 text-xs">
                  <button onClick={() => enterDashboard('aljabar-boolean', 'definisi-dan-pengantar')} className="hover:text-white text-left transition">Aljabar Boolean</button>
                  <button onClick={() => enterDashboard('peluang-dan-kombinatorika', 'aturan-pengisian-tempat')} className="hover:text-white text-left transition">Kombinatorika</button>
                  <button onClick={() => enterDashboard('teori-graf', 'pengantar-dan-isomorfik')} className="hover:text-white text-left transition">Teori Graf</button>
                  <button onClick={() => { setUserState(p => ({ ...p, viewingCertificate: true })); enterDashboard(); }} className="hover:text-white text-left transition text-amber-400 font-semibold">Sertifikasi</button>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-slate-800 text-center text-slate-500 text-xs flex flex-col sm:flex-row justify-between items-center gap-4">
              <span>&copy; 2026 DiskritTika Academia. All Rights Reserved.</span>
              <span>Didesain oleh Adzka Dzikra Fahma &bull; Indonesia</span>
            </div>
          </footer>

        </div>
      ) : (
        
        /* COURSE DASHBOARD / LEARNING PLATFORM VIEW */
        <div className="animate-fade flex flex-col min-h-screen">
          
          {/* TOP INSTRUMENTATION BAR */}
          <header className="sticky top-0 bg-white border-b border-[#D6DBDF] z-20 shadow-xs h-16 flex items-center px-6">
            <div className="w-full flex items-center justify-between">
              
              {/* Back button and title */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setUserState(prev => ({ ...prev, currentView: 'landing' }))}
                  className="px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded hover:bg-gray-50 transition text-gray-700 flex items-center gap-1"
                >
                  <ChevronLeft size={14} /> Kembali ke Landing Page
                </button>

                <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                  <span>Dashboard</span>
                  <ChevronRight size={12} />
                  <span>Matematika Diskrit</span>
                  <ChevronRight size={12} />
                  <span className="text-gray-700 font-medium">{activeModule.title}</span>
                </div>
              </div>

              {/* Course Progress metrics panel */}
              <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Kemajuan Belajar</span>
                  <span className="text-xs font-bold text-blue-600 font-mono">{courseProgressPercent}% Selesai ({totalCompletedCount}/{totalLessonsCount} Modul)</span>
                </div>
                <div className="hidden md:block w-32 bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-200">
                  <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${courseProgressPercent}%` }}></div>
                </div>

                {/* Mobile Hamburger menu */}
                <button 
                  onClick={() => setUserState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }))}
                  className="lg:hidden p-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                >
                  <Menu size={18} />
                </button>
              </div>

            </div>
          </header>

          {/* MAIN CORE BODY FLEX BOX */}
          <div className="flex-1 flex flex-col lg:flex-row relative">
            
            {/* LEFT COLLAPSIBLE NAVIGATION SIDEBAR */}
            <aside className={`w-[270px] bg-white border-r border-[#D6DBDF] flex flex-col justify-between shrink-0 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] z-10 transition-all duration-300 ${userState.sidebarOpen ? 'fixed top-16 bottom-0 left-0 shadow-2xl' : 'fixed top-16 bottom-0 -left-[270px] lg:left-0'}`}>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Daftar Modul Belajar</h3>
                  <div className="w-full bg-slate-100 h-[1.5px] mt-1.5"></div>
                </div>

                {/* Iterate over modules list */}
                <div className="space-y-4">
                  {modules.map((mod) => {
                    const isModActive = userState.activeModuleSlug === mod.slug;
                    return (
                      <div key={mod.id} className="space-y-1.5">
                        
                        {/* Collateral Module Header */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold font-sans text-gray-900 flex items-center gap-1">
                            <span className="w-1.5 h-3 bg-blue-600 rounded"></span>
                            {mod.title}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 font-mono">{mod.progress}%</span>
                        </div>
                        
                        {/* Lessons stack list */}
                        <div className="space-y-1 pl-2.5">
                          {mod.lessons.map((les) => {
                            const isLesActive = userState.activeLessonSlug === les.slug && userState.activeModuleSlug === mod.slug;
                            const isCompleted = userState.completedLessons.includes(les.id);

                            let btnStyle = "text-gray-600 hover:bg-slate-50";
                            if (isLesActive) btnStyle = "bg-blue-50 text-[#0056D2] font-semibold border-l-2 border-blue-600";
                            else if (isCompleted) btnStyle = "text-emerald-800 hover:bg-slate-50";

                            return (
                              <button
                                key={les.id}
                                onClick={() => jumpToLesson(mod.slug, les.slug)}
                                className={`w-full text-left px-2.5 py-1.5 rounded transition text-xs flex items-center justify-between ${btnStyle}`}
                              >
                                <span className="truncate flex items-center gap-1.5 font-sans leading-relaxed">
                                  {isCompleted ? (
                                    <CheckCircle size={12} className="text-emerald-600 shrink-0" />
                                  ) : isLesActive ? (
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 animate-ping"></span>
                                  ) : (
                                    <Circle size={10} className="text-gray-300 shrink-0" />
                                  )}
                                  <span className="truncate">{les.title}</span>
                                </span>
                              </button>
                            );
                          })}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom sidebar actions */}
              <div className="p-4 bg-slate-50 border-t border-gray-100 space-y-2">
                <button
                  onClick={() => setUserState(p => ({ ...p, viewingCertificate: true, sidebarOpen: false }))}
                  className={`w-full py-2 rounded text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 border transition ${userState.viewingCertificate ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                >
                  <Award size={14} className="text-amber-500" /> Klaim Sertifikat
                </button>
              </div>

            </aside>

            {/* MAIN CENTRAL WORKSPACE CONTAINER */}
            <main className="flex-1 bg-[#F5F7F9] p-6 lg:p-8 min-h-[calc(100vh-64px)] overflow-y-auto">
              <div className="max-w-[820px] mx-auto space-y-6">

                {/* SHOW CERTIFICATE DRAWER VIEW OR TEXTBOOK MATERIAL */}
                {userState.viewingCertificate ? (
                  <CertificateViewer completedModulesCount={totalCompletedCount} />
                ) : (
                  <div className="space-y-6 animate-fade">
                    
                    {/* BREADCRUMB HEADER CARD STYLE */}
                    <div className="bg-white border border-[#D6DBDF] rounded-xl p-6 shadow-sm space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-gray-400 font-medium">MODUL: <strong className="text-gray-700 uppercase font-mono">{activeModule.title}</strong></span>
                        <div className="flex gap-2">
                          <span className="px-2.5 py-0.5 bg-blue-50 text-[#0056D2] font-semibold rounded-full uppercase text-[10px]">
                            {activeLesson.level}
                          </span>
                          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 rounded-full text-[10px] font-semibold font-mono">
                            {activeLesson.duration} Estimasi
                          </span>
                        </div>
                      </div>

                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                        {activeLesson.title}
                      </h2>
                      
                      <p className="text-xs text-gray-500 font-sans leading-relaxed">
                        Topik ini membahas pembuktian logika analitis diskret dan cara menerapkannya demi keperluan rekayasa perangkat lunak serta komputasi numerikal dasar.
                      </p>
                    </div>

                    {/* TUJUAN PEMBELAJARAN CARD */}
                    <div className="bg-white border border-[#D6DBDF] rounded-xl p-5 shadow-sm space-y-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                        <BookMarked size={16} className="text-[#0056D2]" /> Tujuan Pembelajaran
                      </h4>
                      <ul className="text-xs text-[#5C5C5C] space-y-1.5 pl-5 list-disc leading-relaxed font-sans">
                        {activeModule.slug === 'aljabar-boolean' && (
                          <>
                            <li>Memahami definisi aksiomatis mengenai struktur Aljabar Boolean dan operator dasarnya.</li>
                            <li>Mengaplikasikan hukum-hukum distributif, De Morgan, dan komplemen untuk penyusunan fungsi.</li>
                            <li>Mengubah fungsi Boolean acak ke bentuk kanonik standar SOP (minterm) atau POS (maxterm).</li>
                            <li>Menyederhanakan rangkaian logika digital secara visual menggunakan grid Peta Karnaugh 2x4.</li>
                          </>
                        )}
                        {activeModule.slug === 'peluang-dan-kombinatorika' && (
                          <>
                            <li>Membedakan penggunaan antara metode susunan berarah Permutasi dengan Kombinasi tanpa memandang urutan.</li>
                            <li>Menggunakan aturan pengisian tempat bertingkat (perkalian faktorial) untuk permasalahan kata.</li>
                            <li>Mengidentifikasi nilai kombinasi dengan unsur berulang (multiset data).</li>
                          </>
                        )}
                        {activeModule.slug === 'teori-graf' && (
                          <>
                            <li>Menentukan syarat formal keidentikan struktural pada dua buah Graf Isomorfik.</li>
                            <li>Menguji syarat batas planaritas graf bidang menggunakan pertidaksamaan maksimal sisi dan Teorema Kuratowski.</li>
                            <li>Menghubungkan aplikasi teori relasi graf terhadap tatanan jaringan, pemetaan GIS, serta tatanan sirkuit PCB.</li>
                          </>
                        )}
                      </ul>
                    </div>

                    {/* CORE TEXTBOOK CONTENT SHEETS & INTERACTIVE SANDBOX PLACEMENT */}
                    
                    {/* TOPIC 1: ALJABAR BOOLEAN LESSONS */}
                    {activeModule.slug === 'aljabar-boolean' && (
                      <div className="space-y-6">
                        <div className="bg-white border border-[#D6DBDF] rounded-xl p-6 shadow-sm space-y-5 text-sm leading-relaxed text-[#1F1F1F]">
                          <h3 className="text-lg font-bold border-b border-gray-100 pb-2 text-slate-800">1. Konsep Dasar & Aksioma Boole</h3>
                          <p className="font-sans text-gray-600 leading-relaxed">
                            Aljabar Boolean adalah struktur matematika yang didefinisikan pada sebuah himpunan elemen B dengan menyediakan dua buah operator biner yaitu <strong className="font-semibold text-[#0056D2]">&middot; (AND)</strong> dan <strong className="font-semibold text-[#0056D2]">+ (OR)</strong>, serta satu operator uner yaitu <strong className="font-semibold text-[#0056D2]">' (NOT / Komplemen)</strong>.
                          </p>
                          
                          {/* Formula De Morgan Visual */}
                          <div className="p-4 bg-[#F8FAFC] border border-gray-200 rounded-lg space-y-2">
                            <span className="text-xs uppercase font-bold text-gray-400 block tracking-wider font-mono">Teorema Hukum De Morgan:</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center font-mono text-[#0056D2] font-bold text-sm">
                              <div className="bg-white p-3 rounded border border-gray-200 shadow-xs">
                                (a + b)' = a' &middot; b'
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200 shadow-xs">
                                (a &middot; b)' = a' + b'
                              </div>
                            </div>
                            <span className="text-[10px] text-gray-400 block text-center font-sans">
                              Hukum De Morgan menyatakan negasi penjumlahan biner setara dengan perkalian negasi anggotanya, dan sebaliknya.
                            </span>
                          </div>
                        </div>

                        {/* Mount Boolean live simulator component here */}
                        <BooleanInteractive />
                      </div>
                    )}

                    {/* TOPIC 2: COMBINATORICS LESSONS */}
                    {activeModule.slug === 'peluang-dan-kombinatorika' && (
                      <div className="space-y-6">
                        <div className="bg-white border border-[#D6DBDF] rounded-xl p-6 shadow-sm space-y-5 text-sm leading-relaxed text-[#1F1F1F]">
                          <h3 className="text-lg font-bold border-b border-gray-100 pb-2 text-slate-800">1. Aturan Pengisian Tempat & Faktorial</h3>
                          <p className="font-sans text-gray-600 leading-relaxed">
                            Bila suatu aktivitas pertama memiliki r<sub>1</sub> cara penyelesaian, aktivitas kedua memiliki r<sub>2</sub> cara, hingga aktivitas ke-n memiliki r<sub>n</sub> cara, maka perkalian total susunan merangkum aturan pengisian tempat dengan limitasi:
                          </p>

                          {/* Formula card representations */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                            <div className="bg-[#FAF8FF] border border-indigo-100 p-4 rounded-lg">
                              <span className="text-[10px] font-bold text-[#0056D2] block uppercase tracking-wider">Permutasi (P)</span>
                              <span className="text-xs font-mono block text-gray-500 mt-1">Urutan dipedulikan</span>
                              <div className="font-mono font-bold text-[#0056D2] text-sm mt-2">n! / (n - r)!</div>
                            </div>
                            <div className="bg-[#F6FFFA] border border-emerald-100 p-4 rounded-lg">
                              <span className="text-[10px] font-bold text-emerald-800 block uppercase tracking-wider">Kombinasi (C)</span>
                              <span className="text-xs font-mono block text-gray-500 mt-1">Urutan dibebaskan</span>
                              <div className="font-mono font-bold text-emerald-800 text-sm mt-2">n! / (r! &middot; (n-r)!)</div>
                            </div>
                            <div className="bg-[#FFFDF6] border border-amber-100 p-4 rounded-lg">
                              <span className="text-[10px] font-bold text-amber-800 block uppercase tracking-wider">Siklik (Melingkar)</span>
                              <span className="text-xs font-mono block text-gray-500 mt-1">Mengelilingi meja</span>
                              <div className="font-mono font-bold text-amber-800 text-sm mt-2">(n - 1)!</div>
                            </div>
                          </div>
                        </div>

                        {/* Mount comb/perm live calculator here */}
                        <PeluangInteractive />
                      </div>
                    )}

                    {/* TOPIC 3: GRAPH THEORY LESSONS */}
                    {activeModule.slug === 'teori-graf' && (
                      <div className="space-y-6">
                        <div className="bg-white border border-[#D6DBDF] rounded-xl p-6 shadow-sm space-y-5 text-sm leading-relaxed text-[#1F1F1F]">
                          <h3 className="text-lg font-bold border-b border-gray-100 pb-2 text-slate-800">1. Pengantar Teori Graf, Planar & Bidang</h3>
                          <p className="font-sans text-gray-600 leading-relaxed">
                            Graf dinyatakan planar jika dapat diletakkan pada permukaan kertas dua dimensi tanpa ada simpul edge yang saling memotong. Representasi visual planar yang dilukis sempurna disebut <strong className="font-medium text-blue-600">Graf Bidang (Plane Graph)</strong>.
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-2">
                              <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider font-mono">Rumus Euler (Planar Terhubung):</span>
                              <div className="font-mono text-lg font-bold text-blue-700 text-center py-2 bg-white rounded border">
                                V - E + F = 2
                              </div>
                              <span className="text-[10px] text-gray-400 block text-center leading-relaxed">
                                V: Verteks (Simpul), E: Edge (Sisi), F: Face (Jumlah muka bidang termasuk luar tak terhingga).
                              </span>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-2">
                              <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider font-mono">Batas Sisi Maks Planar:</span>
                              <div className="font-mono text-lg font-bold text-emerald-800 text-center py-2 bg-white rounded border">
                                E &le; 3V - 6
                              </div>
                              <span className="text-[10px] text-gray-400 block text-center leading-relaxed">
                                Jika sebuah graf melanggar batas ketidaksamaan di atas, maka graf tersebut divalidasi mutlak bersifat non-planar.
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Mount graph live visual sandbox here */}
                        <GrafInteractive />
                      </div>
                    )}


                    {/* TEST / EXERCISES KUIS PLATFORM LAUNCH CONTAINER */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <div className="p-1">
                        <h3 className="text-base font-bold text-slate-800 mb-2">Evaluas Pemahaman Melalui Kuis Pendek</h3>
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                          Uji ketangkasan logika Anda setelah menyerap materi di atas. Kumpulkan skor minimal untuk mengklaim tingkat penyelesaian sempurna.
                        </p>
                      </div>

                      <QuizPlatform 
                        quizId={activeModule.slug} 
                        questions={QUIZZES_DATA[activeModule.slug] || []}
                        onQuizComplete={(sc) => {
                          setUserState(prev => ({
                            ...prev,
                            quizScores: { ...prev.quizScores, [activeModule.slug]: sc }
                          }));
                          // Auto complete the lesson if quiz is done
                          handleMarkLessonCompleted(activeLesson.id);
                        }}
                      />
                    </div>


                    {/* BUTTON MARKS AS DONE & BACK NEXT FOOTER NAVIGATION */}
                    <div className="pt-8 border-t border-[#D6DBDF] flex flex-col sm:flex-row items-center justify-between gap-4">
                      
                      {/* Prev button */}
                      <button
                        onClick={handlePrevLesson}
                        className="w-full sm:w-auto px-4 py-2 text-xs font-semibold border border-gray-300 rounded hover:bg-gray-50 transition text-gray-700 flex items-center justify-center gap-1"
                      >
                        <ChevronLeft size={14} /> Kembali
                      </button>

                      {/* Complete Current Lesson CTA Indicator */}
                      <button
                        onClick={() => handleMarkLessonCompleted(activeLesson.id)}
                        disabled={userState.completedLessons.includes(activeLesson.id)}
                        className={`w-full sm:w-auto px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded transition flex items-center justify-center gap-1.5 shadow-sm ${userState.completedLessons.includes(activeLesson.id) ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                      >
                        <CheckCircle2 size={14} /> 
                        {userState.completedLessons.includes(activeLesson.id) ? 'Materi Selesai Dipelajari' : 'Tandai Selesai & Klaim XP'}
                      </button>

                      {/* Next button */}
                      <button
                        onClick={handleNextLesson}
                        className="w-full sm:w-auto px-4 py-2 text-xs font-semibold bg-[#0056D2] hover:bg-[#004BB5] text-white rounded transition flex items-center justify-center gap-1 shadow-sm"
                      >
                        Selanjutnya <ChevronRight size={14} />
                      </button>

                    </div>


                    {/* MOUNT NOTEPAD NOTES & DISCUSSIONS FORUM COMMENTS */}
                    <NotesAndComments 
                      lessonId={activeLesson.id}
                      topicId={activeModule.slug}
                      notesText={userState.notes[activeLesson.id] || ''}
                      onSaveNotes={(text) => handleSaveNotes(activeLesson.id, text)}
                      discussions={allComments[activeModule.slug] || []}
                      onAddComment={handleAddComment}
                    />

                  </div>
                )}

              </div>
            </main>

          </div>

          {/* Simple Dashboard Footer */}
          <footer className="bg-white border-t border-[#D6DBDF] py-4 text-center text-xs text-gray-400 select-none">
            <span>&copy; 2026 DiskritTika Platform &bull; Terhubung ke Instansi Pendidikan</span>
          </footer>

        </div>
      )}

    </div>
  );
}
