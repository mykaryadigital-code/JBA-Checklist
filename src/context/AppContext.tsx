import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Candidate, 
  ActiveTab, 
  CriterionRating, 
  JournalEntry,
} from '../types';
import { loadAppState, saveAppState, INITIAL_SAMPLE_CANDIDATE } from '../utils/storage';
import { CRITERIA_DATA } from '../data/criteriaData';
import { TAARUF_QUESTIONS_DATA } from '../data/taarufQuestionsData';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  candidates: Candidate[];
  activeCandidate: Candidate;
  activeCandidateId: string;
  setActiveCandidateId: (id: string) => void;
  addCandidate: (newCandidate: Omit<Candidate, 'id' | 'createdAt' | 'checklist' | 'dayProgress' | 'journal'>) => void;
  updateCandidateInfo: (id: string, updates: Partial<Pick<Candidate, 'name' | 'age' | 'status' | 'occupation' | 'location' | 'notes'>>) => void;
  deleteCandidate: (id: string) => void;
  rateCriterion: (criterionId: number, rating: CriterionRating, notes?: string) => void;
  updateCriterionNotes: (criterionId: number, notes: string) => void;
  toggleDayCompletion: (day: number, notes?: string) => void;
  rateDay: (day: number, rating: CriterionRating, notes?: string) => void;
  updateDayNotes: (day: number, notes: string) => void;
  rateQuestion: (questionId: string, rating: CriterionRating, notes?: string) => void;
  updateQuestionNotes: (questionId: string, notes: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'candidateId' | 'createdAt'>) => void;
  deleteJournalEntry: (id: string) => void;
  exportDataJson: () => string;
  importDataJson: (jsonString: string) => { success: boolean; error?: string };
  resetToSampleData: () => void;
  // Computed statistics
  stats: {
    totalCriteria: number;
    ratedCount: number;
    greenCount: number;
    redCount: number;
    unratedCount: number;
    scorePercentage: number;
    criticalRedFlags: number;
    categoryScores: Record<string, { total: number; green: number; red: number; percentage: number }>;
    completedDaysCount: number;
    dayGreenCount: number;
    dayRedCount: number;
    dayUnratedCount: number;
    questionTotalCount: number;
    questionRatedCount: number;
    questionGreenCount: number;
    questionRedCount: number;
    questionUnratedCount: number;
    journalCount: number;
    consistentJournalCount: number;
    consistencyRate: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('checklist');
  const [state, setState] = useState(() => loadAppState());

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  const activeCandidate = useMemo(() => {
    const found = state.candidates.find(c => c.id === state.activeCandidateId);
    return found || state.candidates[0] || INITIAL_SAMPLE_CANDIDATE;
  }, [state.candidates, state.activeCandidateId]);

  const setActiveCandidateId = (id: string) => {
    setState(prev => ({
      ...prev,
      activeCandidateId: id,
    }));
  };

  const addCandidate = (newCandidateData: Omit<Candidate, 'id' | 'createdAt' | 'checklist' | 'dayProgress' | 'journal'>) => {
    const newId = 'cand_' + Date.now();
    const newCand: Candidate = {
      ...newCandidateData,
      id: newId,
      createdAt: new Date().toISOString(),
      checklist: {},
      dayProgress: {},
      journal: [],
    };

    setState(prev => ({
      candidates: [...prev.candidates, newCand],
      activeCandidateId: newId,
    }));
  };

  const updateCandidateInfo = (id: string, updates: Partial<Pick<Candidate, 'name' | 'age' | 'status' | 'occupation' | 'location' | 'notes'>>) => {
    setState(prev => ({
      ...prev,
      candidates: prev.candidates.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  };

  const deleteCandidate = (id: string) => {
    if (state.candidates.length <= 1) {
      alert('Anda perlu mengekalkan sekurang-kurangnya satu profil calon.');
      return;
    }
    setState(prev => {
      const remaining = prev.candidates.filter(c => c.id !== id);
      return {
        candidates: remaining,
        activeCandidateId: remaining[0].id,
      };
    });
  };

  const rateCriterion = (criterionId: number, rating: CriterionRating, notes?: string) => {
    setState(prev => {
      return {
        ...prev,
        candidates: prev.candidates.map(c => {
          if (c.id !== prev.activeCandidateId) return c;
          const currentRec = c.checklist[criterionId] || { rating: 'unrated', notes: '' };
          return {
            ...c,
            checklist: {
              ...c.checklist,
              [criterionId]: {
                ...currentRec,
                rating,
                notes: notes !== undefined ? notes : currentRec.notes,
                updatedAt: new Date().toISOString().split('T')[0],
              },
            },
          };
        }),
      };
    });
  };

  const updateCriterionNotes = (criterionId: number, notes: string) => {
    setState(prev => {
      return {
        ...prev,
        candidates: prev.candidates.map(c => {
          if (c.id !== prev.activeCandidateId) return c;
          const currentRec = c.checklist[criterionId] || { rating: 'unrated', notes: '' };
          return {
            ...c,
            checklist: {
              ...c.checklist,
              [criterionId]: {
                ...currentRec,
                notes,
                updatedAt: new Date().toISOString().split('T')[0],
              },
            },
          };
        }),
      };
    });
  };

  const toggleDayCompletion = (day: number, notes?: string) => {
    setState(prev => {
      return {
        ...prev,
        candidates: prev.candidates.map(c => {
          if (c.id !== prev.activeCandidateId) return c;
          const currentRec = c.dayProgress[day] || { completed: false, notes: '', rating: 'unrated' };
          const nextCompleted = !currentRec.completed;
          const nextRating: CriterionRating = nextCompleted 
            ? (currentRec.rating && currentRec.rating !== 'unrated' ? currentRec.rating : 'green') 
            : 'unrated';
          return {
            ...c,
            dayProgress: {
              ...c.dayProgress,
              [day]: {
                ...currentRec,
                completed: nextCompleted,
                rating: nextRating,
                notes: notes !== undefined ? notes : currentRec.notes,
                completedAt: nextCompleted ? new Date().toISOString().split('T')[0] : undefined,
              },
            },
          };
        }),
      };
    });
  };

  const rateDay = (day: number, rating: CriterionRating, notes?: string) => {
    setState(prev => {
      return {
        ...prev,
        candidates: prev.candidates.map(c => {
          if (c.id !== prev.activeCandidateId) return c;
          const currentRec = c.dayProgress[day] || { completed: false, notes: '', rating: 'unrated' };
          const isCompleted = rating === 'green' || rating === 'red';
          return {
            ...c,
            dayProgress: {
              ...c.dayProgress,
              [day]: {
                ...currentRec,
                rating,
                completed: isCompleted,
                notes: notes !== undefined ? notes : currentRec.notes,
                completedAt: isCompleted ? (currentRec.completedAt || new Date().toISOString().split('T')[0]) : undefined,
              },
            },
          };
        }),
      };
    });
  };

  const updateDayNotes = (day: number, notes: string) => {
    setState(prev => {
      return {
        ...prev,
        candidates: prev.candidates.map(c => {
          if (c.id !== prev.activeCandidateId) return c;
          const currentRec = c.dayProgress[day] || { completed: false, notes: '' };
          return {
            ...c,
            dayProgress: {
              ...c.dayProgress,
              [day]: {
                ...currentRec,
                notes,
              },
            },
          };
        }),
      };
    });
  };

  const rateQuestion = (questionId: string, rating: CriterionRating, notes?: string) => {
    setState(prev => {
      return {
        ...prev,
        candidates: prev.candidates.map(c => {
          if (c.id !== prev.activeCandidateId) return c;
          const currentRatings = c.questionRatings || {};
          const currentRec = currentRatings[questionId] || { rating: 'unrated', notes: '' };
          return {
            ...c,
            questionRatings: {
              ...currentRatings,
              [questionId]: {
                ...currentRec,
                rating,
                notes: notes !== undefined ? notes : currentRec.notes,
                updatedAt: new Date().toISOString().split('T')[0],
              },
            },
          };
        }),
      };
    });
  };

  const updateQuestionNotes = (questionId: string, notes: string) => {
    setState(prev => {
      return {
        ...prev,
        candidates: prev.candidates.map(c => {
          if (c.id !== prev.activeCandidateId) return c;
          const currentRatings = c.questionRatings || {};
          const currentRec = currentRatings[questionId] || { rating: 'unrated', notes: '' };
          return {
            ...c,
            questionRatings: {
              ...currentRatings,
              [questionId]: {
                ...currentRec,
                notes,
                updatedAt: new Date().toISOString().split('T')[0],
              },
            },
          };
        }),
      };
    });
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'candidateId' | 'createdAt'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: 'journal_' + Date.now(),
      candidateId: state.activeCandidateId,
      createdAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      candidates: prev.candidates.map(c => {
        if (c.id !== prev.activeCandidateId) return c;
        return {
          ...c,
          journal: [newEntry, ...(c.journal || [])],
        };
      }),
    }));
  };

  const deleteJournalEntry = (id: string) => {
    setState(prev => ({
      ...prev,
      candidates: prev.candidates.map(c => {
        if (c.id !== prev.activeCandidateId) return c;
        return {
          ...c,
          journal: (c.journal || []).filter(j => j.id !== id),
        };
      }),
    }));
  };

  const exportDataJson = () => {
    return JSON.stringify(state, null, 2);
  };

  const importDataJson = (jsonString: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !Array.isArray(parsed.candidates) || parsed.candidates.length === 0) {
        return { success: false, error: 'Format data fail tidak sah. Sila pastikan fail JSON mengandungi senarai calon yang sah.' };
      }
      setState({
        candidates: parsed.candidates,
        activeCandidateId: parsed.activeCandidateId || parsed.candidates[0].id,
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Ralat membaca fail JSON: ' + (err?.message || 'Format tidak sah') };
    }
  };

  const resetToSampleData = () => {
    const defaultState = {
      candidates: [INITIAL_SAMPLE_CANDIDATE],
      activeCandidateId: INITIAL_SAMPLE_CANDIDATE.id,
    };
    setState(defaultState);
  };

  // Compute rich statistics for current candidate
  const stats = useMemo(() => {
    const totalCriteria = CRITERIA_DATA.length; // 25
    let greenCount = 0;
    let redCount = 0;
    let ratedCount = 0;
    let criticalRedFlags = 0;

    const catStats: Record<string, { total: number; green: number; red: number; percentage: number }> = {
      sahsiah: { total: 0, green: 0, red: 0, percentage: 0 },
      kewangan: { total: 0, green: 0, red: 0, percentage: 0 },
      keluarga: { total: 0, green: 0, red: 0, percentage: 0 },
      komunikasi: { total: 0, green: 0, red: 0, percentage: 0 },
    };

    CRITERIA_DATA.forEach(criterion => {
      const cat = criterion.category;
      if (catStats[cat]) {
        catStats[cat].total += 1;
      }
      const userRating = activeCandidate?.checklist?.[criterion.id]?.rating || 'unrated';
      if (userRating === 'green') {
        greenCount += 1;
        ratedCount += 1;
        if (catStats[cat]) catStats[cat].green += 1;
      } else if (userRating === 'red') {
        redCount += 1;
        ratedCount += 1;
        if (catStats[cat]) catStats[cat].red += 1;
        if (criterion.isCritical) {
          criticalRedFlags += 1;
        }
      }
    });

    // Calculate category percentages (Green / Total in category * 100)
    Object.keys(catStats).forEach(cat => {
      const { total, green } = catStats[cat];
      catStats[cat].percentage = total > 0 ? Math.round((green / total) * 100) : 0;
    });

    const unratedCount = totalCriteria - ratedCount;

    // Overall qualification score:
    // When rated, based on (green - red) normalized or green / (green + red),
    // Standard weighted calculation: (Green count / 25) * 100 minus penalty for red flags
    // If rated items exist: (Green / (Green + Red)) * (Rated / Total) * 100
    // Let's provide a clear, fair metric:
    // (Green Count / 25) * 100, deducting 4% per Red Flag. Max 100, min 0.
    const rawScore = Math.max(0, Math.round(((greenCount - redCount * 1.5) / totalCriteria) * 100));
    const scorePercentage = Math.min(100, Math.max(0, rawScore));

    // 30-day completed and rating counts
    let dayGreenCount = 0;
    let dayRedCount = 0;
    let completedDaysCount = 0;
    for (let i = 1; i <= 30; i++) {
      const rec = activeCandidate?.dayProgress?.[i];
      const r = rec?.rating || (rec?.completed ? 'green' : 'unrated');
      if (r === 'green') {
        dayGreenCount += 1;
        completedDaysCount += 1;
      } else if (r === 'red') {
        dayRedCount += 1;
        completedDaysCount += 1;
      } else if (rec?.completed) {
        dayGreenCount += 1;
        completedDaysCount += 1;
      }
    }
    const dayUnratedCount = 30 - (dayGreenCount + dayRedCount);

    // Journal stats
    const journals = activeCandidate?.journal || [];
    const journalCount = journals.length;
    const consistentJournalCount = journals.filter(j => j.status === 'konsisten').length;
    const consistencyRate = journalCount > 0 ? Math.round((consistentJournalCount / journalCount) * 100) : 100;

    // Question stats (32 Soalan Ta'aruf)
    const questionRatings = activeCandidate?.questionRatings || {};
    let questionGreenCount = 0;
    let questionRedCount = 0;
    let questionRatedCount = 0;
    Object.values(questionRatings).forEach(rec => {
      if (rec.rating === 'green') {
        questionGreenCount++;
        questionRatedCount++;
      } else if (rec.rating === 'red') {
        questionRedCount++;
        questionRatedCount++;
      }
    });
    const questionTotalCount = TAARUF_QUESTIONS_DATA.length;
    const questionUnratedCount = Math.max(0, questionTotalCount - questionRatedCount);

    return {
      totalCriteria,
      ratedCount,
      greenCount,
      redCount,
      unratedCount,
      scorePercentage,
      criticalRedFlags,
      categoryScores: catStats,
      completedDaysCount,
      dayGreenCount,
      dayRedCount,
      dayUnratedCount,
      questionTotalCount,
      questionRatedCount,
      questionGreenCount,
      questionRedCount,
      questionUnratedCount,
      journalCount,
      consistentJournalCount,
      consistencyRate,
    };
  }, [activeCandidate]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        candidates: state.candidates,
        activeCandidate,
        activeCandidateId: state.activeCandidateId,
        setActiveCandidateId,
        addCandidate,
        updateCandidateInfo,
        deleteCandidate,
        rateCriterion,
        updateCriterionNotes,
        toggleDayCompletion,
        rateDay,
        updateDayNotes,
        rateQuestion,
        updateQuestionNotes,
        addJournalEntry,
        deleteJournalEntry,
        exportDataJson,
        importDataJson,
        resetToSampleData,
        stats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
