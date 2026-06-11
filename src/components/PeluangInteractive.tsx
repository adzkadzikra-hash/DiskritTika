import React, { useState } from 'react';
import { HelpCircle, Sparkles, Binary, CheckCircle2, ChevronRight } from 'lucide-react';

export default function PeluangInteractive() {
  const [numN, setNumN] = useState<number>(6);
  const [numR, setNumR] = useState<number>(3);
  const [scrambleWord, setScrambleWord] = useState<string>("BOSAN");

  // Factorial calculator with safety limits
  const factorial = (num: number): number => {
    if (num < 0) return 0;
    if (num <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    return result;
  };

  // Safe n and r bounds changes
  const handleNChange = (val: number) => {
    const nextN = Math.max(1, Math.min(12, val));
    setNumN(nextN);
    if (numR > nextN) {
      setNumR(nextN);
    }
  };

  const handleRChange = (val: number) => {
    const nextR = Math.max(0, Math.min(numN, val));
    setNumR(nextR);
  };

  // Calculations
  const factN = factorial(numN);
  const factR = factorial(numR);
  const factNminusR = factorial(numN - numR);
  
  const permutationVal = factNminusR > 0 ? factN / factNminusR : 1;
  const combinationVal = (factR * factNminusR) > 0 ? factN / (factR * factNminusR) : 1;

  // Combination with repetition: C_ulang(n, r) = C(n+r-1, r)
  const repN = numN + numR - 1;
  const factRepN = factorial(repN);
  const factRepNminusR = factorial(repN - numR);
  const combinationRepVal = (factR * factRepNminusR) > 0 ? factRepN / (factR * factRepNminusR) : 1;

  // Word unique permutation calculation
  const getUniqueLetters = (word: string) => {
    const chars = word.trim().toUpperCase().split('');
    const freq: Record<string, number> = {};
    chars.forEach(c => { freq[c] = (freq[c] || 0) + 1; });
    return { chars, freq };
  };

  const calculateWordPermutation = (word: string) => {
    if (!word) return 0;
    const { chars, freq } = getUniqueLetters(word);
    const totalFact = factorial(chars.length);
    let denominator = 1;
    Object.values(freq).forEach(count => {
      denominator *= factorial(count);
    });
    return Math.floor(totalFact / denominator);
  };

  const wordPermutationsCount = calculateWordPermutation(scrambleWord);
  const uniqueCount = new Set(scrambleWord.toUpperCase().split('')).size;

  return (
    <div className="space-y-8" id="probability-sec">
      {/* COMPARATIVE TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-4 inline-block">
          Analisis Konsep #1
        </span>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Membedakan Permutasi vs Kombinasi</h3>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Sering bingung menentukan rumus? Kunci utamanya terletak pada <strong className="text-blue-600">Urutan Objek</strong>. Gunakan tabel komparatif berikut untuk memudahkan klasifikasi permasalahan praktis.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-indigo-100 rounded-lg p-5 bg-gradient-to-br from-indigo-50/50 to-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 bg-blue-600 text-white rounded font-bold text-xs">P</span>
              <h4 className="text-base font-bold text-gray-900">Permutasi (Urutan Penting)</h4>
            </div>
            <p className="text-xs text-gray-500 mb-3 block">
              Digunakan ketika menyusun objek di mana posisi <strong className="font-semibold text-gray-800">AB &ne; BA</strong> (struktur berbeda).
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                <span>Urutan posisi dianggap unik (misalnya: Juara I, II, III)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                <span>Kata Kunci: Menyusun, Merangkai, Antrean, Jadwal, Kode PIN</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                <span className="font-mono bg-blue-50 px-1 py-0.5 rounded text-blue-800">P(n,r) = n! / (n-r)!</span>
              </li>
            </ul>
          </div>

          <div className="border border-emerald-100 rounded-lg p-5 bg-gradient-to-br from-emerald-50/50 to-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 bg-emerald-600 text-white rounded font-bold text-xs">C</span>
              <h4 className="text-base font-bold text-gray-900">Kombinasi (Urutan Diabaikan)</h4>
            </div>
            <p className="text-xs text-gray-500 mb-3 block">
              Digunakan ketika mengelompokkan objek di mana posisi <strong className="font-semibold text-gray-800">AB = BA</strong> (struktur setara).
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span>Hanya mementingkan keanggotaan (misalnya: Mengambil bola)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span>Kata Kunci: Memilih, Mengambil acak, Membentuk tim, Jabat tangan</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span className="font-mono bg-emerald-50 px-1 py-0.5 rounded text-emerald-800">C(n,r) = n! / (r!(n-r)!)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CALCULATOR INTERACTIVE */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-4 inline-block">
          Kalkulator & Formula Interaktif #2
        </span>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Simulasi Nilai Permutasi, Kombinasi, & Faktorial</h3>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Atur parameter <strong className="text-indigo-600">n (Semua Objek)</strong> dan <strong className="text-indigo-600">r (Objek yang Dipilih)</strong> menggunakan tombol kontrol di bawah. Amati langkah perhitungan substitusi secara real-time.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel buttons controls */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Nilai n (Jumlah Total Objek)
                </label>
                <span className="text-lg font-bold text-blue-600 font-mono">{numN}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleNChange(numN - 1)}
                  className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold py-1.5 rounded text-sm transition"
                >
                  - Decrement
                </button>
                <button 
                  onClick={() => handleNChange(numN + 1)}
                  className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold py-1.5 rounded text-sm transition"
                >
                  + Increment
                </button>
              </div>
              <span className="text-[10px] text-gray-500 mt-1 block">Batas simulasi: 1 &le; n &le; 12</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Nilai r (Objek yang Dipilih)
                </label>
                <span className="text-lg font-bold text-blue-600 font-mono">{numR}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleRChange(numR - 1)}
                  className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold py-1.5 rounded text-sm transition"
                  disabled={numR <= 0}
                >
                  - Decrement
                </button>
                <button 
                  onClick={() => handleRChange(numR + 1)}
                  className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold py-1.5 rounded text-sm transition"
                  disabled={numR >= numN}
                >
                  + Increment
                </button>
              </div>
              <span className="text-[10px] text-gray-500 mt-1 block">Batas: 0 &le; r &le; n</span>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <span className="text-xs font-bold text-gray-600 block mb-1">Faktorial Tersedia:</span>
              <div className="grid grid-cols-3 gap-2 font-mono text-center">
                <div className="bg-white p-2 rounded border border-gray-200 text-xs">
                  <div className="text-gray-400">n! ({numN}!)</div>
                  <div className="font-bold text-indigo-900">{factN.toLocaleString()}</div>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200 text-xs">
                  <div className="text-gray-400">r! ({numR}!)</div>
                  <div className="font-bold text-indigo-900">{factR.toLocaleString()}</div>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200 text-xs">
                  <div className="text-gray-400">(n-r)! ({numN - numR}!)</div>
                  <div className="font-bold text-indigo-900">{factNminusR.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel Equations with numbers substituted */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Permutasi Box */}
            <div className="border border-gray-200 rounded-lg p-4 bg-white hover:border-blue-300 transition">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full font-mono uppercase">
                  Permutasi P({numN}, {numR})
                </span>
                <span className="text-lg font-mono font-bold text-gray-900">{permutationVal.toLocaleString()}</span>
              </div>
              <div className="text-sm font-mono text-gray-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                P({numN}, {numR}) = &frac12; {numN}! / ({numN} - {numR})!
                <div className="text-xs text-gray-400 mt-1">
                  = {factN.toLocaleString()} / {factNminusR.toLocaleString()}
                </div>
              </div>
              <span className="text-[11px] text-gray-500 mt-2 block leading-relaxed">
                Menyatakan {permutationVal.toLocaleString()} susunan berbeda mengambil {numR} unsur pilihan dari wadah {numN} unsur keseluruhan.
              </span>
            </div>

            {/* Kombinasi Box */}
            <div className="border border-gray-200 rounded-lg p-4 bg-white hover:border-emerald-300 transition">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-mono uppercase">
                  Kombinasi C({numN}, {numR})
                </span>
                <span className="text-lg font-mono font-bold text-gray-900">{combinationVal.toLocaleString()}</span>
              </div>
              <div className="text-sm font-mono text-gray-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                C({numN}, {numR}) = {numN}! / ({numR}! &times; ({numN} - {numR})!)
                <div className="text-xs text-gray-400 mt-1">
                  = {factN.toLocaleString()} / ({factR.toLocaleString()} &times; {factNminusR.toLocaleString()})
                </div>
              </div>
              <span className="text-[11px] text-gray-500 mt-2 block leading-relaxed">
                Menyatakan {combinationVal.toLocaleString()} kumpulan unik kelompok {numR} orang terpilih tanpa memedulikan urutan mereka.
              </span>
            </div>

            {/* Kombinasi Berulang Box */}
            <div className="border border-gray-200 rounded-lg p-4 bg-white hover:border-purple-300 transition">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full font-mono uppercase">
                  Kombinasi Pengulangan (Multiset)
                </span>
                <span className="text-lg font-mono font-bold text-gray-900">{combinationRepVal.toLocaleString()}</span>
              </div>
              <div className="text-sm font-mono text-gray-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                C_ulang({numN}, {numR}) = C({numN} + {numR} - 1, {numR})
                <div className="text-xs text-gray-400 mt-1">
                  = C({repN}, {numR}) = {factRepN.toLocaleString()} / ({factR.toLocaleString()} &times; {factRepNminusR.toLocaleString()})
                </div>
              </div>
              <span className="text-[11px] text-gray-500 mt-2 block leading-relaxed">
                Menyatakan banyak cara membagikan {numR} objek identik ke dalam {numN} wadah berbeda di mana wadah dapat menampung lebih dari 1 objek.
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* WORD SCRAMBLER SANDBOX */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-4 inline-block">
          Sandbox Interaktif #3
        </span>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Simulasi Permutasi Huruf dari Kata Kustom</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Masukkan kata apa saja di kolom bawah. Program akan menghitung jumlah total susunan huruf unik berdasarkan rumus permutasi elemen dengan pengulangan jika terdapat kecocokan abjad.
        </p>

        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-5">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Masukkan Kata:</label>
              <input 
                type="text" 
                value={scrambleWord} 
                onChange={(e) => setScrambleWord(e.target.value.replace(/[^A-Za-z]/g, '').slice(0, 8))}
                className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm font-mono font-bold uppercase text-gray-800 tracking-wider focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="MISAL: BOSAN"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Batas: Maksimal 8 huruf alfabet</span>
            </div>

            <div className="w-full sm:w-auto bg-white border border-gray-200 p-3 rounded flex items-center justify-around gap-5 text-center min-w-[200px]">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Total Huruf (n)</span>
                <span className="text-lg font-mono font-bold text-gray-800">{scrambleWord.length}</span>
              </div>
              <div className="border-l border-gray-200 h-8"></div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Huruf Unik</span>
                <span className="text-lg font-mono font-bold text-gray-800">{uniqueCount}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-900 uppercase block">Rumus Permutasi Kata:</span>
              <div className="text-sm font-mono text-indigo-700 mt-1">
                Laju Susunan = {scrambleWord.length}! / (Frekuensi Suku Berulang!)
              </div>
            </div>
            
            <div className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-right w-full sm:w-auto">
              <span className="text-[10px] uppercase font-semibold text-indigo-200 block">Banyak Kemungkinan Susunan</span>
              <span className="text-xl font-mono font-bold">{wordPermutationsCount.toLocaleString()}</span>
            </div>
          </div>

          {/* Letter tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {scrambleWord.toUpperCase().split('').map((char, index) => (
              <span key={index} className="bg-white border border-gray-300 text-gray-700 rounded-md font-mono font-bold text-sm h-8 w-8 inline-flex items-center justify-center shadow-sm">
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
