import type { AppState } from '../types';
import { DEFAULT_MEDICINE_TOPICS, DEFAULT_ORTHO_TOPICS, DEFAULT_HABITS } from './defaultData';

export const generateSampleData = (referenceDateStr?: string): AppState => {
  const refDate = referenceDateStr ? new Date(referenceDateStr) : new Date();
  
  // Set start date 45 days ago
  const startDateObj = new Date(refDate);
  startDateObj.setDate(startDateObj.getDate() - 44);

  const formatYMD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const startDate = formatYMD(startDateObj);
  const logs: AppState['logs'] = {};
  const topicMeta: AppState['topicMeta'] = {};

  const reflectionSnippets = [
    'Great focus today on cardiology principles. ECG interpretation clicked after practicing 10 rhythm strips.',
    'Productive morning. Completed morning prayers on time. Ortho fracture classification was straightforward.',
    'Felt slightly fatigued in the afternoon, but finished valvular heart disease and review notes.',
    'Solid workout session. Good retention on infective endocarditis Duke criteria.',
    'Memorized Salter-Harris classification easily today using the SALTR mnemonic.',
    'Revised heart failure clinical trials: NYHA classification and guideline directed medical therapy.',
    'Consistent habit flow. Took thorough notes on paediatric orthopaedics and hip dysplasia.',
    'Full marks on quick recall quiz! Finished all habits before 10 PM.',
    'Focused heavily on neurovascular exam in extremity trauma. High yield topics covered.'
  ];

  // Populate 45 days of logs
  for (let i = 0; i < 45; i++) {
    const current = new Date(startDateObj);
    current.setDate(startDateObj.getDate() + i);
    const dateKey = formatYMD(current);
    const syllabusDay = i + 1;

    // Completed habits (realistic 70-100% completion)
    const completedHabits: string[] = [];
    DEFAULT_HABITS.forEach((h, index) => {
      // Habit 10 (workout) and habit 2 (zuha) skipped occasionally
      const skipProb = index === 9 ? 0.45 : (index === 1 ? 0.3 : 0.1);
      if (Math.random() > skipProb) {
        completedHabits.push(h.id);
      }
    });

    const completedMed: string[] = [];
    const completedOrtho: string[] = [];

    // Up to day 18 for medicine
    if (syllabusDay <= 18) {
      const medItem = DEFAULT_MEDICINE_TOPICS.find(m => m.day === syllabusDay);
      if (medItem && Math.random() > 0.15) {
        completedMed.push(medItem.id);
        topicMeta[medItem.id] = {
          rating: (syllabusDay % 2 === 0) ? 4 : 5,
          note: `Completed syllabus day ${syllabusDay}. Core clinical concepts retained.`,
          needsRevision: syllabusDay % 5 === 0,
        };
      }
    }

    // Up to day 24 for ortho
    if (syllabusDay <= 24) {
      const orthoItem = DEFAULT_ORTHO_TOPICS.find(o => o.day === syllabusDay);
      if (orthoItem && Math.random() > 0.18) {
        completedOrtho.push(orthoItem.id);
        topicMeta[orthoItem.id] = {
          rating: (syllabusDay % 3 === 0) ? 5 : 4,
          note: `Case studies reviewed for ${orthoItem.title}.`,
          needsRevision: syllabusDay === 3 || syllabusDay === 9,
        };
      }
    }

    logs[dateKey] = {
      habits: completedHabits,
      medicine: completedMed,
      ortho: completedOrtho,
      notes: reflectionSnippets[i % reflectionSnippets.length],
    };
  }

  return {
    settings: {
      startDate,
      theme: 'dark',
    },
    lists: {
      medicine: DEFAULT_MEDICINE_TOPICS,
      ortho: DEFAULT_ORTHO_TOPICS,
      habits: DEFAULT_HABITS,
    },
    logs,
    topicMeta,
  };
};
