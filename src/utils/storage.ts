import { Candidate } from '../types';

export const STORAGE_KEY = 'checklist_bakal_suami_v1';

export const INITIAL_SAMPLE_CANDIDATE: Candidate = {
  id: 'cand_sample_1',
  name: 'Ahmad Farhan',
  age: 35,
  status: 'duda_beranak',
  occupation: 'Pengurus Operasi Logistik',
  location: 'Shah Alam, Selangor',
  notes: 'Dikenalkan melalui ta\'aruf keluarga. Mempunyai seorang anak berusia 5 tahun di bawah jagaan bekas isteri.',
  createdAt: '2026-10-01T10:00:00.000Z',
  checklist: {
    1: { rating: 'green', notes: 'Sentiasa berhenti di masjid untuk solat berjemaah ketika dalam perjalanan.', updatedAt: '2026-10-02' },
    2: { rating: 'green', notes: 'Sangat tenang ketika terperangkap dalam kesesakan trafik 2 jam.', updatedAt: '2026-10-03' },
    3: { rating: 'green', notes: 'Menunjukkan sijil perakuan cerai rasmi dari Mahkamah Rendah Syariah Shah Alam tanpa diminta.', updatedAt: '2026-10-03' },
    4: { rating: 'green', notes: 'Bahasa perbualan sopan, tidak pernah menggunakan lawak lucah atau topik sensitif.', updatedAt: '2026-10-04' },
    5: { rating: 'green', notes: 'Bercakap secara objektif mengenai penceraian lalu, mengakui kekurangan sendiri dan mendoakan kebaikan bekas isteri.', updatedAt: '2026-10-05' },
    6: { rating: 'green', notes: 'Pernah terlewat 10 minit dan memohon maaf secara ikhlas serta memaklumkan awal.', updatedAt: '2026-10-06' },
    7: { rating: 'green', notes: 'Tiada tanda memanipulasi perasaan atau membuatkan saya berasa bersalah.', updatedAt: '2026-10-07' },
    8: { rating: 'green', notes: 'Bekerja tetap di syarikat logistik antarabangsa lebih 7 tahun.', updatedAt: '2026-10-08' },
    9: { rating: 'green', notes: 'Menyatakan dengan jelas bahawa nafkah rumah dan belanja dapur tanggungjawabnya.', updatedAt: '2026-10-09' },
    10: { rating: 'green', notes: 'Sudah menyewa sebuah kondominium sendiri dan tidak berniat menumpang mertua.', updatedAt: '2026-10-10' },
    11: { rating: 'green', notes: 'Bebas dari sebarang pinjaman mencurigakan, rekod CCRIS bersih.', updatedAt: '2026-10-10' },
    12: { rating: 'unrated', notes: 'Masih dalam pemerhatian tabiat berbelanja.', updatedAt: '2026-10-11' },
    13: { rating: 'green', notes: 'Suka bersedekah di tabung surau dan tidak berkira belanja makan asas.', updatedAt: '2026-10-11' },
    14: { rating: 'green', notes: 'Sangat mesra dan menghormati kehadiran anak saya, membawa hadiah buku aktiviti.', updatedAt: '2026-10-08' },
    15: { rating: 'green', notes: 'Sabar melayan anak yang menangis ketika tersandung tanpa rasa rimas.', updatedAt: '2026-10-08' },
    16: { rating: 'green', notes: 'Menunjukkan resit pemindahan nafkah anak kandung secara berkala setiap 28 haribulan.', updatedAt: '2026-10-09' },
    17: { rating: 'green', notes: 'Menyatakan kesediaan untuk datang menghadap ayah saya hujung bulan ini.', updatedAt: '2026-10-10' },
    18: { rating: 'green', notes: 'Ibu bapanya sudah maklum mengenai perkenalan kami dan menyambut baik.', updatedAt: '2026-10-11' },
    19: { rating: 'unrated', notes: 'Perlu kenal lebih rapat dengan keluarganya.', updatedAt: '2026-10-11' },
    20: { rating: 'green', notes: 'Mendengar pandangan saya tentang pendidikan anak dengan minat yang tinggi.', updatedAt: '2026-10-09' },
    21: { rating: 'green', notes: 'Sentiasa sampai 10 minit sebelum masa temu janji.', updatedAt: '2026-10-07' },
    22: { rating: 'green', notes: 'Menghormati masa privasi dan tidak mendesak balas mesej segera.', updatedAt: '2026-10-06' },
    23: { rating: 'green', notes: 'Bersetuju menyertai kursus pasca-perkahwinan anjuran JAIS bersama.', updatedAt: '2026-10-10' },
    24: { rating: 'green', notes: 'Menjaga pergaulan dengan rakan sekerja wanita secara profesional.', updatedAt: '2026-10-05' },
    25: { rating: 'green', notes: 'Mempunyai perancangan simpanan haji dan rumah keluarga 5 tahun ke depan.', updatedAt: '2026-10-11' },
  },
  dayProgress: {
    1: { completed: true, notes: 'Niat ta\'aruf telah dinyatakan dengan jelas. Matlamatnya serius mahu berkahwin dalam tempoh 6 bulan.', completedAt: '2026-10-02' },
    2: { completed: true, notes: 'Komunikasi dihadkan hanya waktu siang hingga 9.30 malam sahaja. Dia sangat menghormati peraturan ini.', completedAt: '2026-10-03' },
    3: { completed: true, notes: 'Dokumen cerai telah disahkan sah oleh peguam syarie kenalan.', completedAt: '2026-10-04' },
    4: { completed: true, notes: 'Terbukti menjaga solat lima waktu walaupun ketika dalam urusan mesyuarat luar.', completedAt: '2026-10-05' },
    5: { completed: true, notes: 'Dia menerima anak saya dengan hati terbuka dan faham komitmen seorang ibu.', completedAt: '2026-10-06' },
    6: { completed: true, notes: 'Tiada sebarang tabiat merokok atau vape. Gaya hidup sihat berbasikal.', completedAt: '2026-10-07' },
    7: { completed: true, notes: 'Rumusan Minggu 1: Sangat konsisten dan tenang.', completedAt: '2026-10-08' },
  },
  journal: [
    {
      id: 'j1',
      candidateId: 'cand_sample_1',
      date: '2026-10-04',
      title: 'Pertemuan Pertama Berteman di Kafe Terbuka',
      category: 'Komunikasi & Ketepatan Masa',
      spokenPromise: 'Dia berjanji akan tiba tepat jam 2.30 petang bersama adik perempuannya.',
      actualAction: 'Dia tiba jam 2.20 petang bersama adik perempuannya dengan pakaian kemas dan sopan.',
      status: 'konsisten',
      impressionScore: 5,
      notes: 'Sangat menghormati batas ikhtilat dan adab pertemuan keluarga.',
      createdAt: '2026-10-04T15:00:00.000Z',
    },
    {
      id: 'j2',
      candidateId: 'cand_sample_1',
      date: '2026-10-08',
      title: 'Interaksi Pertama Bersama Anak Kecil di Taman',
      category: 'Keluarga & Anak',
      spokenPromise: 'Menyatakan dirinya suka kanak-kanak dan pandai melayan.',
      actualAction: 'Membeli ais krim dan sabar bermain buaian bersama anak selama 40 minit tanpa melihat telefon sesekali.',
      status: 'konsisten',
      impressionScore: 5,
      notes: 'Anak berasa sangat selesa dan gembira berbual dengannya.',
      createdAt: '2026-10-08T17:30:00.000Z',
    },
  ],
};

export interface AppStorageState {
  candidates: Candidate[];
  activeCandidateId: string;
}

export function loadAppState(): AppStorageState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        candidates: [INITIAL_SAMPLE_CANDIDATE],
        activeCandidateId: INITIAL_SAMPLE_CANDIDATE.id,
      };
    }
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.candidates) && parsed.candidates.length > 0) {
      return {
        candidates: parsed.candidates,
        activeCandidateId: parsed.activeCandidateId || parsed.candidates[0].id,
      };
    }
  } catch (err) {
    console.error('Failed to parse stored app state:', err);
  }
  return {
    candidates: [INITIAL_SAMPLE_CANDIDATE],
    activeCandidateId: INITIAL_SAMPLE_CANDIDATE.id,
  };
}

export function saveAppState(state: AppStorageState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save app state:', err);
  }
}
