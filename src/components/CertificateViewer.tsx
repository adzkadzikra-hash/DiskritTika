import React, { useState } from 'react';
import { Award, Download, Printer, User, Sparkles, CheckCircle2 } from 'lucide-react';

interface CertificateViewerProps {
  completedModulesCount: number;
}

export default function CertificateViewer({ completedModulesCount }: CertificateViewerProps) {
  const [userName, setUserName] = useState<string>('Budi Santoso');
  const serialNumber = 'DT-M820-2026';

  const handlePrint = () => {
    window.print();
  };

  const isEligible = completedModulesCount >= 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6 max-w-4xl mx-auto" id="certificate-sec">
      <div className="border-b border-gray-100 pb-4">
        <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-full uppercase tracking-wider">
          Sertifikat Akademik
        </span>
        <h3 className="text-xl font-semibold text-gray-900 mt-2">Klaim Sertifikat Penyelesaian</h3>
        <p className="text-sm text-gray-600 mt-1">
          Sertifikat digital diberikan secara resmi setelah menyelesaikan minimal <strong className="font-semibold text-blue-600">1 Modul Latihan</strong>. Masukkan nama lengkap Anda untuk mencantumkannya secara interaktif.
        </p>
      </div>

      {!isEligible ? (
        <div className="p-10 border border-dashed border-gray-200 rounded-lg text-center bg-slate-50 space-y-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <Award size={24} />
          </div>
          <h4 className="text-base font-semibold text-gray-800">Sertifikat Belum Terbuka</h4>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Selesaikan minimal 1 modul kuis dengan nilai kelulusan apa saja di menu materi untuk membuka klaim sertifikat verifikasi digital Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Certificate customizer form */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-4">
            <h4 className="text-sm font-semibold text-gray-700">Personalisasi Pemilik Sertifikat</h4>
            
            <div className="space-y-1">
              <label className="text-xs text-gray-500 block">Nama Lengkap Mahasiswa:</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value.slice(0, 32))}
                  className="w-full bg-white border border-gray-300 rounded pl-9 pr-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
                  placeholder="Contoh: Budi Santoso"
                />
                <User size={14} className="absolute left-3 top-3 text-gray-400" />
              </div>
              <span className="text-[10px] text-gray-400 block">Maksimal 32 karakter standar akademik</span>
            </div>

            <div className="bg-blue-50 text-blue-800 p-3.5 rounded border border-blue-100 text-xs leading-relaxed space-y-1">
              <div className="font-semibold flex items-center gap-1">
                <CheckCircle2 size={13} /> Sertifikat Siap Diklaim!
              </div>
              <span>Nama yang dimasukkan akan dilaunching langsung pada berkas credential sertifikat kelulusan formal Anda.</span>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handlePrint}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded transition flex items-center justify-center gap-1 shadow-sm"
              >
                <Printer size={13} /> Cetak / PDF
              </button>
            </div>
          </div>

          {/* Certificate Certificate visual simulation */}
          <div className="lg:col-span-8 overflow-x-auto p-1 bg-slate-100 rounded-lg border border-slate-200 flex justify-center">
            {/* Real standard looking A4 proportions certificate print container */}
            <div className="bg-white border-8 border-double border-slate-300 p-8 w-[640px] h-[450px] relative flex flex-col justify-between text-center shadow-lg shrink-0 print-sertif">
              
              {/* Corner Ornaments */}
              <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-slate-400"></div>
              <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-slate-400"></div>
              <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-slate-400"></div>
              <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-slate-400"></div>

              {/* Watermark in background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <Award size={260} />
              </div>

              {/* Header */}
              <div className="space-y-1 select-none">
                <span className="font-mono text-[10px] tracking-[0.2em] font-bold text-gray-400 uppercase">SERTIFIKAT KELULUSAN</span>
                <h1 className="text-2xl font-serif tracking-wide text-slate-800 font-bold">DiskritTika Academia</h1>
                <div className="w-16 h-[1.5px] bg-amber-500 mx-auto my-1"></div>
                <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider font-mono">ID Sertifikat: {serialNumber}</p>
              </div>

              {/* Main Credential Statement */}
              <div className="space-y-4">
                <p className="italic text-xs text-gray-500 font-serif">Sertifikat ini dianugerahkan dengan hormat kepada:</p>
                
                {/* Dynamically styled student name */}
                <div>
                  <h2 className="text-2xl font-semibold font-serif text-slate-900 tracking-wide border-b border-gray-200 inline-block px-10 pb-1 italic">
                    {userName || 'Nama Siswa'}
                  </h2>
                </div>

                <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                  Menyatakan kelulusan dan penguasaan kompetensi akademik pada kurikulum <strong className="font-semibold text-slate-800">Matematika Diskrit Komparatif</strong> yang meliputi Aljabar Boolean, Peluang Kombinatorika, dan Algoritma Teori Graf secara interaktif.
                </p>
              </div>

              {/* Bottom Authority Signs */}
              <div className="flex justify-between items-end pt-5 px-6 select-none relative z-10">
                
                {/* Authority Left */}
                <div className="text-left">
                  <div className="text-[10px] text-gray-500 font-serif">Tanggal Kelulusan:</div>
                  <div className="text-xs font-mono font-semibold text-gray-800">11 Juni 2026</div>
                  <div className="w-24 h-[1px] bg-gray-200 my-1"></div>
                  <div className="text-[8px] text-gray-400 uppercase tracking-widest block font-bold">VERIFIKASI DIGITAL</div>
                </div>

                {/* Stamp visual symbol */}
                <div className="absolute left-[45%] bottom-1 flex flex-col items-center justify-center opacity-85">
                  <div className="w-14 h-14 rounded-full border-2 border-double border-blue-600/60 flex flex-col items-center justify-center text-blue-600/70 font-bold rotate-12 bg-white">
                    <span className="text-[7px] tracking-widest font-mono">LULUS</span>
                    <Award size={14} className="my-[2px]" />
                    <span className="text-[6px] tracking-wider">VALIDATED</span>
                  </div>
                </div>

                {/* Signee Right */}
                <div className="text-right">
                  <div className="italic text-[10px] font-serif text-slate-800 underline decor-slate-300 font-semibold">Prof. Dr. Ir. Adzka Dzikra, M.T.</div>
                  <div className="text-[8px] text-gray-500 uppercase tracking-wider block font-bold font-mono">Kepala Kurikulum DiskritTika</div>
                  <div className="text-[7px] text-gray-400 mt-0.5">Sains Komputasional Indonesia</div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
