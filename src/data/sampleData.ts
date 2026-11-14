import type { AppState, TopicItem } from '../types';
import { 
  DEFAULT_SUBJECTS, 
  DEFAULT_MEDICINE_TOPICS, 
  DEFAULT_ORTHO_TOPICS, 
  DEFAULT_PAEDIATRICS_TOPICS,
  DEFAULT_OBGYN_TOPICS,
  DEFAULT_SURGERY_TOPICS,
  DEFAULT_DERMA_TOPICS,
  DEFAULT_ANESTHESIA_TOPICS,
  DEFAULT_PSYCHIATRY_TOPICS,
  DEFAULT_ENT_TOPICS,
  DEFAULT_OPTHAL_TOPICS,
  DEFAULT_HABITS 
} from './defaultData';

export const generateSampleData = (referenceDateStr?: string): AppState => {
  const refDate = referenceDateStr ? new Date(referenceDateStr) : new Date();
  
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
    'Reviewed Paediatrics milestones and immunization schedule. High-yield recall!',
    'Solid workout session. Good retention on infective endocarditis Duke criteria.',
    'Revised Surgery ATLS trauma protocol and emergency laparotomy indications.',
    'Memorized Obgyn partogram parameters and PPH medical management steps.',
    'Deep dive into Ophthalmology glaucoma laser iridotomy and optic disk cupping.',
    'Covered Anesthesia difficult airway algorithms and rapid sequence induction agents.',
    'Consistent habit flow. Took thorough notes on Dermatology psoriasis vs lichen planus.'
  ];

  const defaultTopics: Record<string, TopicItem[]> = {
    medicine: DEFAULT_MEDICINE_TOPICS,
    ortho: DEFAULT_ORTHO_TOPICS,
    paediatrics: DEFAULT_PAEDIATRICS_TOPICS,
    obgyn: DEFAULT_OBGYN_TOPICS,
    surgery: DEFAULT_SURGERY_TOPICS,
    derma: DEFAULT_DERMA_TOPICS,
    anesthesia: DEFAULT_ANESTHESIA_TOPICS,
    psychiatry: DEFAULT_PSYCHIATRY_TOPICS,
    ent: DEFAULT_ENT_TOPICS,
    opthal: DEFAULT_OPTHAL_TOPICS,
  };

  // Populate 45 days of logs
  for (let i = 0; i < 45; i++) {
    const current = new Date(startDateObj);
    current.setDate(startDateObj.getDate() + i);
    const dateKey = formatYMD(current);
    const syllabusDay = i + 1;

    const completedHabits: string[] = [];
    DEFAULT_HABITS.forEach((h, index) => {
      const skipProb = index === 9 ? 0.45 : (index === 1 ? 0.3 : 0.1);
      if (Math.random() > skipProb) {
        completedHabits.push(h.id);
      }
    });

    const subjectCompletions: Record<string, string[]> = {};
    const completedMed: string[] = [];
    const completedOrtho: string[] = [];

    // For all subjects
    DEFAULT_SUBJECTS.forEach(subj => {
      subjectCompletions[subj.id] = [];
      const topicsList = defaultTopics[subj.id] || [];
      const topicForDay = topicsList.find(t => t.day === syllabusDay);
      if (topicForDay && Math.random() > 0.2) {
        subjectCompletions[subj.id].push(topicForDay.id);
        if (subj.id === 'medicine') completedMed.push(topicForDay.id);
        if (subj.id === 'ortho') completedOrtho.push(topicForDay.id);

        topicMeta[topicForDay.id] = {
          rating: (syllabusDay % 2 === 0) ? 4 : 5,
          note: `Case studies and key guidelines reviewed for ${topicForDay.title}.`,
          needsRevision: syllabusDay % 7 === 0,
        };
      }
    });

    logs[dateKey] = {
      habits: completedHabits,
      medicine: completedMed,
      ortho: completedOrtho,
      subjectCompletions,
      notes: reflectionSnippets[i % reflectionSnippets.length],
    };
  }

  return {
    settings: {
      startDate,
      theme: 'dark',
    },
    lists: {
      subjects: DEFAULT_SUBJECTS,
      topics: defaultTopics,
      medicine: DEFAULT_MEDICINE_TOPICS,
      ortho: DEFAULT_ORTHO_TOPICS,
      habits: DEFAULT_HABITS,
    },
    logs,
    topicMeta,
  };
};
