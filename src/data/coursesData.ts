import { Module, QuizQuestion } from '../types';

export const INITIAL_MODULES: Module[] = [
  {
    id: 'm1',
    title: 'Aljabar Boolean',
    slug: 'aljabar-boolean',
    progress: 0,
    lessons: [
      { id: 'm1-l1', title: 'Definisi & Pengantar Aljabar Boolean', slug: 'definisi-dan-pengantar', moduleSlug: 'aljabar-boolean', duration: '15 Menit', level: 'Dasar', isCompleted: false },
      { id: 'm1-l2', title: 'Hukum-Hukum Aljabar Boolean', slug: 'hukum-aljabar-boolean', moduleSlug: 'aljabar-boolean', duration: '20 Menit', level: 'Dasar', isCompleted: false },
      { id: 'm1-l3', title: 'Bentuk Kanonik SOP dan POS', slug: 'bentuk-kanonik', moduleSlug: 'aljabar-boolean', duration: '25 Menit', level: 'Menengah', isCompleted: false },
      { id: 'm1-l4', title: 'Gerbang Logika & Rangkaian Digital', slug: 'gerbang-logika', moduleSlug: 'aljabar-boolean', duration: '15 Menit', level: 'Dasar', isCompleted: false },
      { id: 'm1-l5', title: 'Penyederhanaan & Peta Karnaugh (K-Map)', slug: 'peta-karnaugh', moduleSlug: 'aljabar-boolean', duration: '30 Menit', level: 'Menengah', isCompleted: false }
    ]
  },
  {
    id: 'm2',
    title: 'Peluang & Kombinatorika',
    slug: 'peluang-dan-kombinatorika',
    progress: 0,
    lessons: [
      { id: 'm2-l1', title: 'Teori Kemungkinan & Aturan Pengisian Tempat', slug: 'aturan-pengisian-tempat', moduleSlug: 'peluang-dan-kombinatorika', duration: '15 Menit', level: 'Dasar', isCompleted: false },
      { id: 'm2-l2', title: 'Permutasi (Seluruh, Sebagian, & Melingkar)', slug: 'permutasi', moduleSlug: 'peluang-dan-kombinatorika', duration: '25 Menit', level: 'Menengah', isCompleted: false },
      { id: 'm2-l3', title: 'Kombinasi & Kombinasi dengan Pengulangan', slug: 'kombinasi', moduleSlug: 'peluang-dan-kombinatorika', duration: '25 Menit', level: 'Menengah', isCompleted: false }
    ]
  },
  {
    id: 'm3',
    title: 'Teori Graf',
    slug: 'teori-graf',
    progress: 0,
    lessons: [
      { id: 'm3-l1', title: 'Pengantar Graf & Graf Isomorfik', slug: 'pengantar-dan-isomorfik', moduleSlug: 'teori-graf', duration: '20 Menit', level: 'Dasar', isCompleted: false },
      { id: 'm3-l2', title: 'Graf Planar, Graf Bidang & Rumus Euler', slug: 'planar-dan-euler', moduleSlug: 'teori-graf', duration: '25 Menit', level: 'Menengah', isCompleted: false },
      { id: 'm3-l3', title: 'Graf Dual & Implementasi Teknologi', slug: 'graf-dual', moduleSlug: 'teori-graf', duration: '20 Menit', level: 'Lanjut', isCompleted: false }
    ]
  }
];

export const QUIZZES_DATA: Record<string, QuizQuestion[]> = {
  'aljabar-boolean': [
    {
      id: 'q-b1',
      question: "Apakah hasil penyederhanaan dari ekspresi Boolean berikut: f(a, b) = a'b + ab + ab' ?",
      options: [
        "a + b",
        "a' + b'",
        "ab",
        "1 (Selalu benar)"
      ],
      correctAnswer: 0,
      explanation: "f(a,b) = a'b + ab + ab' = (a' + a)b + ab' = 1·b + ab' = b + ab' = (b + a)(b + b') = (b + a)·1 = a + b. Dengan demikian hasil penyederhanaannya adalah a + b."
    },
    {
      id: 'q-b2',
      question: "Hukum De Morgan menyatakan bahwa bentuk komplemen dari penjumlahan variabel (a + b)' setara dengan...",
      options: [
        "a' + b'",
        "a'b'",
        "ab",
        "a + b"
      ],
      correctAnswer: 1,
      explanation: "Hukum De Morgan merumuskan: (a + b)' = a' · b' (negasi dari disjungsi adalah konjungsi negasi) dan (a · b)' = a' + b' (negasi dari konjungsi adalah disjungsi negasi)."
    },
    {
      id: 'q-b3',
      question: "Ekspresi bentuk SOP (Sum of Products) tersusun dari bentukan logika standar yang disebut...",
      options: [
        "Minterm (suku minimum)",
        "Maxterm (suku maksimum)",
        "Karnaugh term",
        "Boolean term"
      ],
      correctAnswer: 0,
      explanation: "SOP (Sum of Products) dibentuk dari penjumlahan dari minterm-minterm (AND term), sedangkan POS (Product of Sums) dibentuk dari perkalian dari maxterm-maxterm (OR term)."
    }
  ],
  'peluang-dan-kombinatorika': [
    {
      id: 'q-p1',
      question: "Jika terdapat kata 'BOSAN', berapa banyak susunan permutasi huruf berbeda yang dapat terbentuk dari kata tersebut?",
      options: [
        "24 susunan",
        "60 susunan",
        "120 susunan",
        "720 susunan"
      ],
      correctAnswer: 2,
      explanation: "Kata 'BOSAN' memiliki 5 huruf unik (B, O, S, A, N). Banyak susunan permutasi dari n objek berbeda tanpa pengulangan adalah n! = 5! = 5 × 4 × 3 × 2 × 1 = 120."
    },
    {
      id: 'q-p2',
      question: "Dalam sebuah kelompok belajar yang beranggotakan 6 mahasiswa, akan dipilih 3 orang perwakilan untuk mengikuti lomba matematika. Banyaknya kombinasi pemilihan perwakilan tersebut adalah...",
      options: [
        "20 cara",
        "120 cara",
        "720 cara",
        "18 cara"
      ],
      correctAnswer: 0,
      explanation: "Ini menggunakan kombinasi karena urutan tidak diperhatikan. C(6,3) = 6! / (3!(6-3)!) = (6 × 5 × 4) / (3 × 2 × 1) = 20 cara."
    },
    {
      id: 'q-p3',
      question: "Berapakah banyak cara mengatur 5 orang untuk duduk mengelilingi sebuah meja bundar (permutasi siklik/melingkar)?",
      options: [
        "120 cara",
        "24 cara",
        "60 cara",
        "5 cara"
      ],
      correctAnswer: 1,
      explanation: "Rumus permutasi melingkar untuk n unsur adalah P_siklik = (n - 1)! Maka untuk 5 orang, banyak caranya adalah (5 - 1)! = 4! = 4 × 3 × 2 × 1 = 24 cara."
    }
  ],
  'teori-graf': [
    {
      id: 'q-g1',
      question: "Rumus Euler menyatakan hubungan V (Verteks/Simpul), E (Edge/Sisi), dan F (Face/Muka) pada graf planar terhubung adalah...",
      options: [
        "V + E + F = 2",
        "V - E + F = 2",
        "V - E + F = 0",
        "V + E - F = 2"
      ],
      correctAnswer: 1,
      explanation: "Rumus Euler untuk graf bidang (planar terhubung) yang digambarkan tanpa ada sisi yang saling berpotongan adalah V - E + F = 2."
    },
    {
      id: 'q-g2',
      question: "Manakah pernyataan berikut yang merupakan syarat mutlak agar dua buah graf dinyatakan Isomorfik?",
      options: [
        "Memiliki jumlah simpul yang sama, jumlah sisi yang sama, dan derajat simpul yang bersesuaian sama.",
        "Kedua graf harus memiliki bentuk gambar atau layout yang persis sama.",
        "Kedua graf harus sama-sama merupakan graf planar.",
        "Memiliki matriks ketetanggaan yang bernilai nol semua."
      ],
      correctAnswer: 0,
      explanation: "Dua graf isomorfik secara struktural identik, artinya terdapat korespondensi satu-satu (pemetaan bijektif) simpul dan sisi yang menjaga hubungan ketetanggaan. Akibatnya, jumlah simpul, jumlah sisi, dan korespondensi derajat simpul harus serasi."
    },
    {
      id: 'q-g3',
      question: "Teorema Kuratowski menyebutkan bahwa suatu graf dinyatakan planar jika dan hanya jika ia tidak mengandung subgraf yang isomorfik dengan...",
      options: [
        "Graf kosong",
        "K5 (Graf lengkap 5 simpul) atau K3,3 (Graf bipartit lengkap 3-ke-3)",
        "Graf siklik C5",
        "Graf pohon biner"
      ],
      correctAnswer: 1,
      explanation: "Teorema Kuratowski membuktikan bahwa suatu graf bersifat planar jika ia tidak mengandung homeomorfik atau subgraf yang isomorfik dengan K5 (graf lengkap bersimpul 5) atau K3,3 (graf bipartit lengkap utilitas)."
    }
  ]
};

export const INITIAL_DISCUSSIONS: Record<string, any[]> = {
  'aljabar-boolean': [
    {
      id: 'd1',
      author: "Adzka Dzikra",
      avatar: "AD",
      role: "Mahasiswa Informatika",
      content: "Apakah Karnaugh Map lebih efektif dibandingkan aljabar Boolean biasa untuk menyederhanakan rangkaian digital dengan 4 variabel? Mengapa?",
      timestamp: "2 jam yang lalu",
      likes: 8
    },
    {
      id: 'd2',
      author: "Dr. Salwa Fadilah",
      avatar: "SF",
      role: "Dosen Pengampu",
      content: "Ya Adzka, untuk 3 hingga 5 variabel, K-Map jauh lebih efektif karena metode visualisasi polanya mengurangi risiko kesalahan hitung aljabar. Untuk >6 variabel, kita biasanya beralih ke algoritma Quine-McCluskey atau perangkat lunak CAD otomatis.",
      timestamp: "1 jam yang lalu",
      likes: 15
    }
  ],
  'peluang-dan-kombinatorika': [
    {
      id: 'd3',
      author: "Citra Lestari",
      avatar: "CL",
      role: "Mahasiswa Sistem Informasi",
      content: "Masih sering tertukar antara kapan menggunakan permutasi dan kombinasi. Adakah tips membedakan kata kuncinya?",
      timestamp: "1 hari yang lalu",
      likes: 12
    },
    {
      id: 'd4',
      author: "Aditya Pratama",
      avatar: "AP",
      role: "Asisten Dosen",
      content: "Halo Citra! Kuncinya adalah URUTAN. Jika urutan diperhatikan (misal: juara 1,2,3; susunan huruf; nomor plat; rute perjalanan), pakai Permutasi. Jika urutan TIDAK diperhatikan (misal: memilih delegasi; mengambil bola dari kantong; memilih kartu), pakai Kombinasi.",
      timestamp: "18 jam yang lalu",
      likes: 24
    }
  ],
  'teori-graf': [
    {
      id: 'd5',
      author: "Farhan Maulana",
      avatar: "FM",
      role: "Mahasiswa Sains Data",
      content: "Wah, menarik sekali bagian graf dual ini! Berarti sirkuit cetak (PCB) memang harus didesain planar agar jalurnya tidak berpotongan ya?",
      timestamp: "3 hari yang lalu",
      likes: 5
    }
  ]
};
