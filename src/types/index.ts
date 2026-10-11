export type CriteriaCategory = 'sahsiah' | 'kewangan' | 'keluarga' | 'komunikasi';

export type CriterionRating = 'unrated' | 'green' | 'red';

export interface Criterion {
  id: number;
  category: CriteriaCategory;
  categoryLabel: string;
  title: string;
  description: string;
  whyImportant: string;
  actionEvidencePrompt: string;
  isCritical: boolean;
}

export interface CriterionUserRecord {
  rating: CriterionRating;
  notes: string;
  updatedAt?: string;
}

export interface DayGuide {
  day: number;
  phaseId: number;
  phaseName: string;
  title: string;
  actionItem: string;
  taarufQuestion: string;
  redFlagWarning: string;
  wiseQuote: string;
}

export interface DayUserRecord {
  completed: boolean;
  rating?: CriterionRating; // 'unrated' | 'green' | 'red'
  notes: string;
  completedAt?: string;
}

export interface JournalEntry {
  id: string;
  candidateId: string;
  date: string;
  title: string;
  category: string;
  spokenPromise: string;
  actualAction: string;
  status: 'konsisten' | 'tidak_konsisten';
  impressionScore: number; // 1 to 5
  notes?: string;
  createdAt: string;
}

export interface TaarufQuestionItem {
  id: string;
  questionNumber: number;
  category: string;
  categoryLabel: string;
  question: string;
  purpose: string;
  greenFlagAnswer: string;
  redFlagAnswer: string;
  proTip: string;
}

export interface Candidate {
  id: string;
  name: string;
  age: number;
  status: 'bujang' | 'duda_beranak' | 'duda_tanpa_anak' | 'lain_lain';
  occupation: string;
  location: string;
  notes?: string;
  createdAt: string;
  checklist: Record<number, CriterionUserRecord>;
  dayProgress: Record<number, DayUserRecord>;
  journal: JournalEntry[];
}

export type ActiveTab = 'checklist' | 'guide30' | 'analysis' | 'journal' | 'questions';
