import React, { useState } from 'react';
import { Network, Info, ArrowRight, ArrowLeft, RefreshCw, Layers } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface Edge {
  source: string;
  target: string;
}

export default function GrafInteractive() {
  const [activeTab, setActiveTab] = useState<'explorer' | 'planar' | 'dual'>('explorer');

  // Interactive node explorer state
  const [selectedNode, setSelectedNode] = useState<string | null>('v1');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Stepper for Dual Graph Construction
  const [dualStep, setDualStep] = useState<number>(1);

  // Selector for Planar structures
  const [selectedGraphClass, setSelectedGraphClass] = useState<'planar' | 'k5' | 'k33'>('planar');

  // Node locations for Explorer Graph
  const explorerNodes: Node[] = [
    { id: 'v1', label: 'V1', x: 120, y: 70 },
    { id: 'v2', label: 'V2', x: 260, y: 50 },
    { id: 'v3', label: 'V3', x: 300, y: 170 },
    { id: 'v4', label: 'V4', x: 180, y: 190 },
    { id: 'v5', label: 'V5', x: 60, y: 150 },
  ];

  const explorerEdges: Edge[] = [
    { source: 'v1', target: 'v2' },
    { source: 'v2', target: 'v3' },
    { source: 'v3', target: 'v4' },
    { source: 'v4', target: 'v5' },
    { source: 'v5', target: 'v1' },
    { source: 'v1', target: 'v4' },
    { source: 'v2', target: 'v4' },
  ];

  // Helper metrics for Explorer Graph
  const getNodeDegree = (nodeId: string) => {
    return explorerEdges.filter(e => e.source === nodeId || e.target === nodeId).length;
  };

  const getNodeNeighbors = (nodeId: string) => {
    const neighbors: string[] = [];
    explorerEdges.forEach(e => {
      if (e.source === nodeId) neighbors.push(e.target);
      if (e.target === nodeId) neighbors.push(e.source);
    });
    return neighbors.map(n => n.toUpperCase()).sort();
  };

  // Predefined Planar / Non planar graphs data
  const getGraphMetrics = () => {
    switch (selectedGraphClass) {
      case 'planar':
        return {
          name: 'Graf Planar Sederhana (K4 Terpelajar)',
          V: 4, E: 6, F: 4,
          formulaCheck: '6 \u2264 3(4) - 6 \u21D2 6 \u2264 6',
          isPlanar: true,
          explanation: 'Graf Planar karena dapat digambar tanpa ada sisi yang saling menyilang di bidang datar. Semua sisi membagi bidang menjadi 4 muka terpisah (termasuk muka luar). Memenuhi Rumus Euler V - E + F = 4 - 6 + 4 = 2.'
        };
      case 'k5':
        return {
          name: 'Graf Lengkap K\u2085 (Teorema Kuratowski)',
          V: 5, E: 10, F: 'Tidak terdefinisi',
          formulaCheck: '10 \u2264 3(5) - 6 \u21D2 10 \u2264 9',
          isPlanar: false,
          explanation: 'Melanggar batas maksimal sisi graf planar (E \u2264 3V - 6). Maka graf K\u2085 mustahil digambar di bidang datar tanpa ada minimal dua sisi yang saling berpotongan/menyilang.'
        };
      case 'k33':
        return {
          name: 'Graf Bipartit Lengkap K\u2083,\u2083 (Graf Utilitas)',
          V: 6, E: 9, F: 'Tidak terdefinisi',
          formulaCheck: '9 \u2264 2(6) - 4 \u21D2 9 \u2264 8',
          isPlanar: false,
          explanation: 'Graf bipartit planar harus memenuhi syarat sisi yang lebih ketat karena tidak mengandung sirkuit dengan panjang ganjil (E \u2264 2V - 4). Karena 9 > 8, maka K\u2083,\u2083 bersifat non-planar.'
        };
    }
  };

  const metrics = getGraphMetrics();

  // Graph Dual Stepper Steps definition
  const dualSteppingText = [
    {
      title: "1. Gambar Graf Primal (Planar)",
      desc: "Kita mulai dengan sebuah graf planar primal (warna hitam) yang digambar pada bidang dua dimensi tanpa ada sisi yang berpotongan satu sama lain."
    },
    {
      title: "2. Identifikasi Seluruh Muka (Face)",
      desc: "Graf primal kita membagi bidang menjadi 3 muka (F1, F2 di bagian dalam, dan F3 sebagai kawasan luar tak terhingga)."
    },
    {
      title: "3. Tempatkan Simpul G* di Tengah Muka",
      desc: "Simpul dual baru (X1, X2, X3 - warna ungu) diletakkan tepat di tengah-tengah setiap wilayah muka yang telah diidentifikasi pada langkah 2."
    },
    {
      title: "4. Hubungkan Simpul Dual Melalui Sisi Primal",
      desc: "Tarik garis penghubung dual (warna ungu putus-putus) jika dua buah muka yang bersesuaian dipisahkan oleh satu sisi batas pada graf hitam primal."
    },
    {
      title: "5. Selesai! Graf G* Dual Sempurna Terbentuk",
      desc: "Selamat! Seluruh sisi primal hitam telah dikonversi menjadi relasi dual ungu. Graf dual G* (ungu) resmi terbentuk secara struktural."
    }
  ];

  return (
    <div className="space-y-8" id="graph-sec">
      {/* SECTION NAVIGASI */}
      <div className="flex border-b border-gray-200 bg-white p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('explorer')}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-md transition ${activeTab === 'explorer' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
        >
          1. Node Degree Explorer
        </button>
        <button
          onClick={() => setActiveTab('planar')}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-md transition ${activeTab === 'planar' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
        >
          2. Planar & Kuratowski Rule
        </button>
        <button
          onClick={() => setActiveTab('dual')}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-md transition ${activeTab === 'dual' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
        >
          3. Stepper Graf Dual
        </button>
      </div>

      {/* VIEW 1: NODE DEGREE EXPLORER */}
      {activeTab === 'explorer' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-4 inline-block">
            Modul Interaktif #1
          </span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Pemeriksa Derajat (Degree) & Ketetanggaan Simpul</h3>
          <p className="text-sm text-gray-600 mb-6">
            Klik simpul (<strong className="font-semibold">V</strong>) pada kanvas graf berkilau di bawah untuk melihat jumlah derajat hubungannya serta unsur-unsur matrik ketetanggaannya.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Interactive SVG Canvas */}
            <div className="md:col-span-7 bg-[#F8FAFC] border border-gray-200 rounded-lg p-4 flex justify-center items-center">
              <svg className="w-full max-w-[360px] h-[260px]" viewBox="0 0 360 260">
                {/* Draw Edges */}
                {explorerEdges.map((edge, idx) => {
                  const sourceNode = explorerNodes.find(n => n.id === edge.source)!;
                  const targetNode = explorerNodes.find(n => n.id === edge.target)!;
                  const isActiveEdge = selectedNode === edge.source || selectedNode === edge.target;
                  return (
                    <line
                      key={idx}
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={isActiveEdge ? '#3B82F6' : '#94A3B8'}
                      strokeWidth={isActiveEdge ? 3.5 : 2}
                      className={isActiveEdge ? 'transition-all animate-pulse' : 'transition-all'}
                    />
                  );
                })}

                {/* Draw Nodes */}
                {explorerNodes.map((node) => {
                  const isSelected = selectedNode === node.id;
                  const isHovered = hoveredNode === node.id;
                  const degree = getNodeDegree(node.id);
                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedNode(node.id)}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      {/* Outer Glow for selection */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelected ? 24 : isHovered ? 20 : 16}
                        fill={isSelected ? '#DBEAFE' : 'transparent'}
                        className="transition-all duration-300"
                      />
                      {/* Main Circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={16}
                        fill={isSelected ? '#0056D2' : '#FFFFFF'}
                        stroke={isSelected ? '#004BB5' : '#475569'}
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />
                      {/* Node Text Label */}
                      <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill={isSelected ? '#FFFFFF' : '#475569'}
                        className="pointer-events-none select-none font-mono"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Live Metrics card */}
            <div className="md:col-span-5 space-y-4">
              {selectedNode ? (
                <div className="border border-blue-100 rounded-lg p-5 bg-blue-50/40">
                  <span className="text-[10px] uppercase font-bold text-blue-600 font-mono tracking-wide">
                    Simpul Terpilih
                  </span>
                  <h4 className="text-2xl font-bold font-mono text-gray-900 mt-0.5">{selectedNode.toUpperCase()}</h4>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex border-b border-gray-200 pb-2 justify-between">
                      <span className="text-xs text-gray-500">Derajat Simpul (d({selectedNode}))</span>
                      <span className="text-xs font-bold text-gray-800 font-mono">
                        {getNodeDegree(selectedNode)} Hubungan
                      </span>
                    </div>

                    <div className="flex border-b border-gray-200 pb-2 justify-between">
                      <span className="text-xs text-gray-500">Sifat Derajat</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${getNodeDegree(selectedNode) % 2 === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {getNodeDegree(selectedNode) % 2 === 0 ? 'Genap (Even)' : 'Ganjil (Odd)'}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-gray-500 block mb-1">Tetangga Terkait:</span>
                      <div className="flex flex-wrap gap-1">
                        {getNodeNeighbors(selectedNode).map((neigh, i) => (
                          <span key={i} className="bg-white border border-gray-200 text-xs text-gray-700 font-mono font-bold px-2 py-0.5 rounded">
                            {neigh}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-xs text-gray-500">
                  Pilihlah salah satu simpul (vertex) di kanvas kiri untuk membongkar sifat graf.
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs text-slate-600 leading-relaxed flex gap-2">
                <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Handshaking Lemma:</strong> Jumlah seluruh derajat simpul setara dengan 2 kali lipat jumlah sisi. Pada graf ini, total derajat adalah 14, yang setara dengan 2 &times; {explorerEdges.length} sisi.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PLANAR & KURATOWSKI */}
      {activeTab === 'planar' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-4 inline-block">
            Modul Interaktif #2
          </span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Penilai Sifat Planar & Syarat Teorema Kuratowski</h3>
          <p className="text-sm text-gray-600 mb-6">
            Pilih klasifikasi graf di bawah ini untuk melihat uji planaritas secara matematis menggunakan rumus ketidaksamaan batas maks sisi.
          </p>

          <div className="flex bg-slate-100 rounded p-1 mb-6 gap-2 max-w-lg">
            <button
              onClick={() => setSelectedGraphClass('planar')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition ${selectedGraphClass === 'planar' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Primal Planar (K4)
            </button>
            <button
              onClick={() => setSelectedGraphClass('k5')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition ${selectedGraphClass === 'k5' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Non-Planar K5
            </button>
            <button
              onClick={() => setSelectedGraphClass('k33')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition ${selectedGraphClass === 'k33' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Non-Planar K3,3
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Graph Display Layout */}
            <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-center items-center h-[260px] relative">
              <span className="absolute top-2 left-2 text-[10px] uppercase font-bold text-gray-400">Layout Struktur</span>
              
              {selectedGraphClass === 'planar' && (
                <svg className="w-full max-w-[200px] h-[180px]" viewBox="0 0 200 180">
                  {/* Edges planar */}
                  <line x1="30" y1="150" x2="170" y2="150" stroke="#0056D2" strokeWidth="2.5" />
                  <line x1="30" y1="150" x2="100" y2="30" stroke="#0056D2" strokeWidth="2.5" />
                  <line x1="170" y1="150" x2="100" y2="30" stroke="#0056D2" strokeWidth="2.5" />
                  {/* Inner node connection */}
                  <line x1="100" y1="110" x2="30" y2="150" stroke="#0056D2" strokeWidth="2" />
                  <line x1="100" y1="110" x2="170" y2="150" stroke="#0056D2" strokeWidth="2" />
                  <line x1="100" y1="110" x2="100" y2="30" stroke="#0056D2" strokeWidth="2" />

                  {/* Vertices */}
                  <circle cx="30" cy="150" r="8" fill="#FFFFFF" stroke="#0056D2" strokeWidth="2" />
                  <circle cx="170" cy="150" r="8" fill="#FFFFFF" stroke="#0056D2" strokeWidth="2" />
                  <circle cx="100" cy="30" r="8" fill="#FFFFFF" stroke="#0056D2" strokeWidth="2" />
                  <circle cx="100" cy="110" r="8" fill="#FFFFFF" stroke="#0056D2" strokeWidth="2" />
                </svg>
              )}

              {selectedGraphClass === 'k5' && (
                <svg className="w-full max-w-[200px] h-[180px]" viewBox="0 0 200 180">
                  {/* Pentagram edges showing full crossover intersections */}
                  <line x1="100" y1="20" x2="40" y2="70" stroke="#EF4444" strokeWidth="2" />
                  <line x1="100" y1="20" x2="60" y2="150" stroke="#EF4444" strokeWidth="2" />
                  <line x1="100" y1="20" x2="140" y2="150" stroke="#EF4444" strokeWidth="2" />
                  <line x1="100" y1="20" x2="160" y2="70" stroke="#EF4444" strokeWidth="2" />

                  <line x1="40" y1="70" x2="160" y2="70" stroke="#EF4444" strokeWidth="2" />
                  <line x1="40" y1="70" x2="140" y2="150" stroke="#EF4444" strokeWidth="1.5" />
                  <line x1="40" y1="70" x2="60" y2="150" stroke="#EF4444" strokeWidth="2" />

                  <line x1="160" y1="70" x2="60" y2="150" stroke="#EF4444" strokeWidth="2" />
                  <line x1="160" y1="70" x2="140" y2="150" stroke="#EF4444" strokeWidth="2" />

                  <line x1="60" y1="150" x2="140" y2="150" stroke="#EF4444" strokeWidth="2" />

                  {/* Highlights of intersection */}
                  <circle cx="100" cy="90" r="5" fill="#EF4444" className="animate-ping" />
                  
                  {/* Vertices */}
                  <circle cx="100" cy="20" r="7" fill="#FFFFFF" stroke="#EF4444" strokeWidth="2" />
                  <circle cx="40" cy="70" r="7" fill="#FFFFFF" stroke="#EF4444" strokeWidth="2" />
                  <circle cx="160" cy="70" r="7" fill="#FFFFFF" stroke="#EF4444" strokeWidth="2" />
                  <circle cx="60" cy="150" r="7" fill="#FFFFFF" stroke="#EF4444" strokeWidth="2" />
                  <circle cx="140" cy="150" r="7" fill="#FFFFFF" stroke="#EF4444" strokeWidth="2" />
                </svg>
              )}

              {selectedGraphClass === 'k33' && (
                <svg className="w-full max-w-[200px] h-[180px]" viewBox="0 0 200 180">
                  {/* Setup Bipartite Left vs Right columns */}
                  {/* Top Set (V1, V2, V3) at Y=40. Bottom Set (U1, U2, U3) at Y=140 */}
                  <line x1="40" y1="40" x2="40" y2="140" stroke="#EF4444" strokeWidth="1.5" />
                  <line x1="40" y1="40" x2="100" y2="140" stroke="#EF4444" strokeWidth="1.5" />
                  <line x1="40" y1="40" x2="160" y2="140" stroke="#EF4444" strokeWidth="1.5" />

                  <line x1="100" y1="40" x2="40" y2="140" stroke="#EF4444" strokeWidth="1.5" />
                  <line x1="100" y1="40" x2="100" y2="140" stroke="#EF4444" strokeWidth="1.5" />
                  <line x1="100" y1="40" x2="160" y2="140" stroke="#EF4444" strokeWidth="1.5" />

                  <line x1="160" y1="40" x2="40" y2="140" stroke="#EF4444" strokeWidth="1.5" />
                  <line x1="160" y1="40" x2="100" y2="140" stroke="#EF4444" strokeWidth="1.5" />
                  <line x1="160" y1="40" x2="160" y2="140" stroke="#EF4444" strokeWidth="1.5" />

                  {/* Intersections */}
                  <circle cx="115" cy="90" r="5" fill="#EF4444" />
                  <circle cx="85" cy="90" r="5" fill="#EF4444" />

                  {/* Vertices */}
                  <circle cx="40" cy="40" r="6" fill="#FFFFFF" stroke="#EF4444" strokeWidth="2" />
                  <circle cx="100" cy="40" r="6" fill="#FFFFFF" stroke="#EF4444" strokeWidth="2" />
                  <circle cx="160" cy="40" r="6" fill="#FFFFFF" stroke="#EF4444" strokeWidth="2" />

                  <circle cx="40" cy="140" r="6" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2" />
                  <circle cx="100" cy="140" r="6" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2" />
                  <circle cx="160" cy="140" r="6" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2" />
                </svg>
              )}
            </div>

            {/* Right side check formula calculations */}
            <div className="md:col-span-7 space-y-4">
              <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-gray-900">{metrics?.name}</h4>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${metrics?.isPlanar ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {metrics?.isPlanar ? '✅ PLANAR' : '❌ NON-PLANAR'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-center pt-2">
                  <div className="bg-slate-50 p-2.5 rounded border border-gray-200 text-xs">
                    <span className="text-gray-400 block uppercase font-sans">Simpul (V)</span>
                    <span className="font-bold text-gray-800 text-base">{metrics?.V}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-gray-200 text-xs">
                    <span className="text-gray-400 block uppercase font-sans">Sisi (E)</span>
                    <span className="font-bold text-gray-800 text-base">{metrics?.E}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-gray-200 text-xs">
                    <span className="text-gray-400 block uppercase font-sans">Muka (F)</span>
                    <span className="font-bold text-blue-700 text-base">{metrics?.F}</span>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded text-slate-800 text-xs leading-relaxed space-y-1">
                  <div className="font-semibold text-indigo-900">Uji Batas Maksimum Sisi Planar:</div>
                  <div className="font-mono text-sm leading-6">{metrics?.formulaCheck}</div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed pt-1">
                  {metrics?.explanation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: DUAL GRAPH STEPPER */}
      {activeTab === 'dual' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-4 inline-block">
            Modul Interaktif #3
          </span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Simulasi Step-by-Step Cara Membentuk Graf Dual</h3>
          <p className="text-sm text-gray-600 mb-6">
            Gunakan tombol panah di bawah peta visual ini untuk melihat proses pengerjaan pembuatan Graf Dual (<strong className="text-indigo-600">G<sup>*</sup></strong>) dari sebuah Graf Primal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Visual Canvas containing stepping overlays */}
            <div className="md:col-span-7 bg-[#FAF9FF] border border-indigo-100 rounded-lg p-5 flex flex-col justify-center items-center h-[280px] relative overflow-hidden">
              <span className="absolute top-2 left-2 text-[10px] font-bold text-purple-400 uppercase tracking-wider font-mono">
                Kanvas Visual Dualisasi (Tahap {dualStep}/5)
              </span>

              <svg className="w-full max-w-[280px] h-[220px]" viewBox="0 0 280 220">
                {/* 1. Primal Planar Graph (Active in all steps) */}
                <g opacity={dualStep >= 1 ? 1 : 0.2} className="transition-all duration-300">
                  {/* Primal Triangle + center nodes */}
                  <line x1="40" y1="180" x2="240" y2="180" stroke="#1E293B" strokeWidth="2.5" />
                  <line x1="40" y1="180" x2="140" y2="30" stroke="#1E293B" strokeWidth="2.5" />
                  <line x1="240" y1="180" x2="140" y2="30" stroke="#1E293B" strokeWidth="2.5" />
                  
                  <line x1="140" y1="120" x2="40" y2="180" stroke="#1E293B" strokeWidth="2" />
                  <line x1="140" y1="120" x2="240" y2="180" stroke="#1E293B" strokeWidth="2" />
                  <line x1="140" y1="120" x2="140" y2="30" stroke="#1E293B" strokeWidth="2" />

                  {/* Primal Vertices */}
                  <circle cx="40" cy="180" r="6" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                  <circle cx="240" cy="180" r="6" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                  <circle cx="140" cy="30" r="6" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                  <circle cx="140" cy="120" r="6" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                </g>

                {/* 2. Face labels */}
                {dualStep >= 2 && (
                  <g className="animate-fade">
                    <text x="90" y="110" fill="#2563EB" fontSize="12" fontWeight="bold">F1</text>
                    <text x="180" y="110" fill="#2563EB" fontSize="12" fontWeight="bold">F2</text>
                    <text x="135" y="195" fill="#2563EB" fontSize="12" fontWeight="bold">F3</text>
                    <text x="20" y="40" fill="#2563EB" fontSize="11" fontWeight="bold">F4 (Luar)</text>
                  </g>
                )}

                {/* 3. Dual vertices nodes placement */}
                {dualStep >= 3 && (
                  <g className="animate-bounce">
                    {/* Centroid dual X1 for F1 */}
                    <circle cx="106" cy="110" r="8" fill="#A855F7" stroke="#7E22CE" strokeWidth="2" />
                    <text x="106" y="114" textAnchor="middle" fontSize="9" fill="#FFFFFF" fontWeight="bold">X1</text>

                    {/* Centroid dual X2 for F2 */}
                    <circle cx="174" cy="110" r="8" fill="#A855F7" stroke="#7E22CE" strokeWidth="2" />
                    <text x="174" y="114" textAnchor="middle" fontSize="9" fill="#FFFFFF" fontWeight="bold">X2</text>

                    {/* Centroid dual X3 for F3 */}
                    <circle cx="140" cy="160" r="8" fill="#A855F7" stroke="#7E22CE" strokeWidth="2" />
                    <text x="140" y="164" textAnchor="middle" fontSize="9" fill="#FFFFFF" fontWeight="bold">X3</text>

                    {/* Centroid dual X4 representing Outer infinite Face */}
                    <circle cx="20" cy="50" r="8" fill="#A855F7" stroke="#7E22CE" strokeWidth="2" />
                    <text x="20" y="54" textAnchor="middle" fontSize="9" fill="#FFFFFF" fontWeight="bold">X4</text>
                  </g>
                )}

                {/* 4. Dual relations Edges */}
                {dualStep >= 4 && (
                  <g opacity={dualStep === 4 ? 0.7 : 1} className="transition-all">
                    {/* X1 to X2 through vertical central line */}
                    <path d="M 114,110 Q 140,110 166,110" fill="none" stroke="#7E22CE" strokeWidth="2" strokeDasharray="4,4" />
                    
                    {/* X1 to X3 */}
                    <path d="M 106,118 Q 115,140 132,156" fill="none" stroke="#7E22CE" strokeWidth="2" strokeDasharray="4,4" />

                    {/* X2 to X3 */}
                    <path d="M 174,118 Q 165,140 148,156" fill="none" stroke="#7E22CE" strokeWidth="2" strokeDasharray="4,4" />

                    {/* Connections to outer infinite X4 */}
                    {/* X1 to X4 */}
                    <path d="M 98,110 Q 50,60 28,54" fill="none" stroke="#7E22CE" strokeWidth="1.5" strokeDasharray="4,4" />

                    {/* X2 to X4 */}
                    <path d="M 174,102 Q 150,0 20,42" fill="none" stroke="#7E22CE" strokeWidth="1.5" strokeDasharray="4,4" />

                    {/* X3 to X4 */}
                    <path d="M 132,160 Q 0,220 18,58" fill="none" stroke="#7E22CE" strokeWidth="1.5" strokeDasharray="4,4" />
                  </g>
                )}
              </svg>
            </div>

            {/* Explanations block with Stepper Controller */}
            <div className="md:col-span-5 flex flex-col justify-between h-[280px]">
              <div className="space-y-3">
                <h4 className="text-base font-bold text-gray-900 border-l-4 border-indigo-500 pl-2">
                  {dualSteppingText[dualStep - 1].title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {dualSteppingText[dualStep - 1].desc}
                </p>
              </div>

              {/* Steps control buttons row */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setDualStep(prev => Math.max(1, prev - 1))}
                  disabled={dualStep <= 1}
                  className="px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowLeft size={14} /> Back
                </button>

                <div className="text-xs font-mono font-bold text-gray-400">
                  {dualStep} / 5
                </div>

                <button
                  onClick={() => setDualStep(prev => Math.min(5, prev + 1))}
                  disabled={dualStep >= 5}
                  className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1 shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
