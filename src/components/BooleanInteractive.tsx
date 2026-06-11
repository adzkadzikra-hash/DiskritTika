import React, { useState } from 'react';
import { Play, RotateCcw, HelpCircle, Eye, Info } from 'lucide-react';

export default function BooleanInteractive() {
  // Truth table state
  const [inputA, setInputA] = useState<number>(0);
  const [inputB, setInputB] = useState<number>(0);

  // Logic Circuit inputs
  const [circuitA, setCircuitA] = useState<number>(1);
  const [circuitB, setCircuitB] = useState<number>(0);
  const [circuitGate, setCircuitGate] = useState<'AND' | 'OR' | 'XOR' | 'NAND'>('AND');

  // Karnaugh Map (2x4 grid representing variables A and BC)
  // Rows: A=0, A=1
  // Columns: BC=00, BC=01, BC=11, BC=10
  const [kmapGrid, setKmapGrid] = useState<number[][]>([
    [0, 1, 1, 0], // A=0: BC=00, 01, 11, 10
    [1, 0, 1, 0]  // A=1: BC=00, 01, 11, 10
  ]);

  const toggleKmapCell = (row: number, col: number) => {
    const updated = kmapGrid.map((r, rIdx) => 
      r.map((val, cIdx) => (rIdx === row && cIdx === col ? (val === 0 ? 1 : 0) : val))
    );
    setKmapGrid(updated);
  };

  const resetKmap = () => {
    setKmapGrid([
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
  };

  const fillRandomKmap = () => {
    setKmapGrid(
      kmapGrid.map(row => row.map(() => Math.round(Math.random())))
    );
  };

  // Logic operations
  const andOut = inputA & inputB;
  const orOut = inputA | inputB;
  const notA = inputA === 0 ? 1 : 0;
  const xorOut = inputA ^ inputB;

  // Circuit simulation
  const getCircuitOutput = () => {
    switch (circuitGate) {
      case 'AND': return circuitA & circuitB;
      case 'OR': return circuitA | circuitB;
      case 'XOR': return circuitA ^ circuitB;
      case 'NAND': return (circuitA & circuitB) === 1 ? 0 : 1;
    }
  };

  // Get Minterm list based on 1s in K-Map
  const getMinterms = () => {
    const minterms: string[] = [];
    const colLabels = ["00", "01", "11", "10"];
    
    kmapGrid.forEach((row, rIdx) => {
      row.forEach((val, cIdx) => {
        if (val === 1) {
          const a = rIdx === 1 ? "A" : "A'";
          const bLabel = colLabels[cIdx];
          const b = bLabel[0] === '1' ? "B" : "B'";
          const c = bLabel[1] === '1' ? "C" : "C'";
          minterms.push(`${a}${b}${c}`);
        }
      });
    });
    return minterms;
  };

  const activeMinterms = getMinterms();

  return (
    <div className="space-y-8" id="boolean-sec">
      {/* SECTION 1: Interaktif Operator & Tabel Kebenaran */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider">
            Sandbox Interaktif #1
          </span>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Info size={14} /> Klik input untuk mengubah nilai kebenaran secara langsung.
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">Tabel Kebenaran & Emulator Operator Digital</h3>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Ubah input binari kebenaran <strong className="font-medium text-blue-600">A</strong> dan <strong className="font-medium text-blue-600">B</strong> untuk melihat respons langsung dari operator dasar Aljabar Boolean.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Input Controller */}
          <div className="bg-[#F8FAFC] rounded-lg p-5 border border-gray-200 space-y-4">
            <h4 className="text-sm font-semibold text-gray-700">Atur Nilai Input Digital</h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Input A (p &bull; True/False)</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setInputA(1)} 
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition ${inputA === 1 ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                  >
                    1 (TRUE)
                  </button>
                  <button 
                    onClick={() => setInputA(0)} 
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition ${inputA === 0 ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                  >
                    0 (FALSE)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">Input B (q &bull; True/False)</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setInputB(1)} 
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition ${inputB === 1 ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                  >
                    1 (TRUE)
                  </button>
                  <button 
                    onClick={() => setInputB(0)} 
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition ${inputB === 0 ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                  >
                    0 (FALSE)
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-medium text-gray-500 block mb-2">Simulasi Keadaan:</span>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${inputA ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  A = {inputA} ({inputA ? 'Aktif' : 'Nonaktif'})
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${inputB ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  B = {inputB} ({inputB ? 'Aktif' : 'Nonaktif'})
                </span>
              </div>
            </div>
          </div>

          {/* Outputs Live List */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Hasil Output Operator Kebenaran</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col justify-between hover:border-blue-200 transition">
                <span className="text-xs font-semibold text-gray-500 uppercase">AND (a &middot; b)</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono text-xs text-gray-400">Konjungsi</span>
                  <span className={`text-xl font-bold font-mono ${andOut ? 'text-green-600' : 'text-gray-900'}`}>{andOut}</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col justify-between hover:border-blue-200 transition">
                <span className="text-xs font-semibold text-gray-500 uppercase">OR (a + b)</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono text-xs text-gray-400">Disjungsi</span>
                  <span className={`text-xl font-bold font-mono ${orOut ? 'text-green-600' : 'text-gray-900'}`}>{orOut}</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col justify-between hover:border-blue-200 transition">
                <span className="text-xs font-semibold text-gray-500 uppercase">NOT A (a')</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono text-xs text-gray-400">Inversi</span>
                  <span className={`text-xl font-bold font-mono ${notA ? 'text-green-600' : 'text-gray-900'}`}>{notA}</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col justify-between hover:border-blue-200 transition">
                <span className="text-xs font-semibold text-gray-500 uppercase">XOR (a &oplus; b)</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono text-xs text-gray-400">Exclusive OR</span>
                  <span className={`text-xl font-bold font-mono ${xorOut ? 'text-green-600' : 'text-gray-900'}`}>{xorOut}</span>
                </div>
              </div>
            </div>

            {/* Verification message */}
            <div className={`p-3 rounded border text-xs leading-relaxed ${andOut === 1 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-blue-50 text-blue-800 border-blue-200'}`}>
              {andOut === 1 
                ? "Keadaan Istimewa: AND bernilai 1 hanya ketika semua input adalah 1 (True)." 
                : "Ubah kedua input A dan B menjadi 1 untuk menyaksikan gerbang AND mengalirkan arus keluaran logika bernilai 1."
              }
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Interactive Logic Gate Circuit Visualizer */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-4 inline-block">
          Sandbox Interaktif #2
        </span>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Rangkaian Gerbang Logika & Ariran Arus Elektrik</h3>
        <p className="text-sm text-gray-600 mb-6">
          Klik input saklar untuk mengalirkan tegangan (<strong className="text-green-600 text-semibold">1</strong>) atau memadamkannya (<strong className="text-gray-400">0</strong>), serta pilih jenis gerbang untuk melihat keluaran.
        </p>

        <div className="bg-[#0F172A] text-slate-200 rounded-lg p-6 relative overflow-hidden">
          {/* Controls Top */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-4 z-10 relative">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Gerbang Logika:</span>
              <div className="inline-flex rounded-md bg-slate-800 p-0.5">
                {(['AND', 'OR', 'XOR', 'NAND'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => setCircuitGate(g)}
                    className={`px-3 py-1 text-xs rounded-md font-medium transition ${circuitGate === g ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs text-slate-400">
              Output Fungsi: <span className="font-mono text-yellow-400 font-bold">Y = {circuitGate}(A, B)</span>
            </div>
          </div>

          {/* Interactive Circuit Drawing */}
          <div className="flex items-center justify-around py-8 relative min-h-[180px]">
            {/* Input nodes */}
            <div className="flex flex-col gap-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCircuitA(circuitA === 1 ? 0 : 1)}
                  className={`w-10 h-10 rounded-full font-mono font-bold flex items-center justify-center transition-all ${circuitA === 1 ? 'bg-green-500 text-slate-900 ring-4 ring-green-500/20 shadow-lg shadow-green-500/40' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                >
                  {circuitA}
                </button>
                <span className="text-sm font-bold text-slate-300">Switch A</span>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCircuitB(circuitB === 1 ? 0 : 1)}
                  className={`w-10 h-10 rounded-full font-mono font-bold flex items-center justify-center transition-all ${circuitB === 1 ? 'bg-green-500 text-slate-900 ring-4 ring-green-500/20 shadow-lg shadow-green-500/40' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                >
                  {circuitB}
                </button>
                <span className="text-sm font-bold text-slate-300">Switch B</span>
              </div>
            </div>

            {/* Connecting lines via SVG */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Line from A to gate */}
                <path 
                  d="M 120,65 L 200,65 L 200,85" 
                  stroke={circuitA === 1 ? "#10B981" : "#475569"} 
                  strokeWidth="3" 
                  fill="none" 
                  className={circuitA === 1 ? "stroke-dash-active" : ""}
                />
                {/* Line from B to gate */}
                <path 
                  d="M 120,145 L 200,145 L 200,120" 
                  stroke={circuitB === 1 ? "#10B981" : "#475569"} 
                  strokeWidth="3" 
                  fill="none"
                />
                {/* Line to Output */}
                <path 
                  d="M 280,103 L 340,103" 
                  stroke={getCircuitOutput() === 1 ? "#10B981" : "#475569"} 
                  strokeWidth="3" 
                  fill="none"
                />
              </svg>
            </div>

            {/* Gate Symbol */}
            <div className="z-10 bg-slate-800 border-2 border-slate-700 rounded-lg px-6 py-4 flex flex-col items-center">
              <span className="text-sm font-bold font-mono tracking-wider text-blue-400">{circuitGate}</span>
              <div className="w-12 h-6 border-b border-r border-slate-500 rounded-br mt-1"></div>
            </div>

            {/* Output Node */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-mono font-bold transition-all duration-300 ${getCircuitOutput() === 1 ? 'bg-yellow-400 text-slate-900 shadow-xl ring-4 ring-yellow-400/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                <span className="text-lg">{getCircuitOutput()}</span>
                <span className="text-[9px] uppercase tracking-wider font-sans">Output</span>
              </div>
              <span className="text-xs font-medium text-slate-400">Lampu Y</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Karnaugh Map Sandbox */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full uppercase tracking-wider">
              Sandbox Interaktif #3
            </span>
            <h3 className="text-xl font-semibold text-gray-900 mt-2">Visualisasi & Penyederhanaan Peta Karnaugh</h3>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={fillRandomKmap}
              className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1 transition"
            >
              <Play size={12} /> Acak Nilai
            </button>
            <button 
              onClick={resetKmap}
              className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1 transition text-red-600"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Klik sel di dalam grid <strong className="font-medium text-purple-700">Peta Karnaugh 2x4</strong> untuk mengubah holds (0 atau 1) bagi fungsi 3 variabel <strong className="font-mono">F(A, B, C)</strong>. Sistem akan menjumlahkan minterm SOP secara langsung di bawah.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kmap grid representation */}
          <div className="lg:col-span-2 bg-[#FAF8FF] border border-purple-100 rounded-lg p-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
              
              {/* Table Column Labels */}
              <div className="grid grid-cols-5 text-center mb-1 text-xs font-semibold text-gray-500 font-mono">
                <div>A \ BC</div>
                <div>00</div>
                <div>01</div>
                <div>11</div>
                <div>10</div>
              </div>

              {/* Rows */}
              {kmapGrid.map((row, rIdx) => (
                <div key={rIdx} className="grid grid-cols-5 gap-2 items-center mb-2">
                  {/* Row Label */}
                  <div className="text-right pr-4 text-xs font-semibold text-gray-500 font-mono">
                    A = {rIdx}
                  </div>
                  
                  {/* Cells */}
                  {row.map((cellValue, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => toggleKmapCell(rIdx, cIdx)}
                      className={`h-16 rounded-md border flex flex-col items-center justify-center transition-all ${cellValue === 1 ? 'bg-purple-600 border-purple-700 text-white shadow font-bold scale-102 ring-2 ring-purple-100' : 'bg-white border-gray-200 text-gray-400 hover:border-purple-300 hover:text-gray-600'}`}
                    >
                      <span className="text-lg font-mono">{cellValue}</span>
                      <span className="text-[10px] font-sans font-normal opacity-85">
                        m{rIdx === 0 ? (cIdx === 3 ? 2 : cIdx === 2 ? 3 : cIdx) : (cIdx === 3 ? 6 : cIdx === 2 ? 7 : cIdx + 4)}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <span className="inline-block w-3 h-3 bg-purple-600 rounded"></span> Aktif (1)
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <span className="inline-block w-3 h-3 bg-white border border-gray-300 rounded"></span> Nonaktif (0)
              </span>
            </div>
          </div>

          {/* SOP Expression analysis */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2">Bentuk Kanonik SOP (Sum of Products)</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                SOP diperoleh dengan menjumlahkan semua minterm (suku perkalian) di mana fungsi bernilai kebenaran 1.
              </p>

              {activeMinterms.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded">
                  Tidak ada minterm aktif. Klik sel di peta Karnaugh untuk mengaktifkannya.
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-md font-mono text-sm text-indigo-900 break-words font-semibold leading-relaxed">
                  F(A,B,C) = {activeMinterms.join(' + ')}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-700 block mb-1">Minterm yang Menyusun f:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {activeMinterms.length === 0 ? (
                  <span className="text-xs text-gray-400">Kosong</span>
                ) : (
                  activeMinterms.map((m, idx) => (
                    <span key={idx} className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded border border-purple-100 font-mono">
                      {m}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
