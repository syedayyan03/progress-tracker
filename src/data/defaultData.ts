import type { TopicItem, HabitItem, AppState } from '../types';

export const DEFAULT_MEDICINE_TOPICS: TopicItem[] = [
  { id: 'med-1', day: 1, title: 'Intro to ECG' },
  { id: 'med-2', day: 2, title: 'Ischemic heart disease' },
  { id: 'med-3', day: 3, title: 'Hypertension' },
  { id: 'med-4', day: 4, title: 'Acute rheumatic fever' },
  { id: 'med-5', day: 5, title: 'Valvular heart disease – 1' },
  { id: 'med-6', day: 6, title: 'Valvular heart disease – 2' },
  { id: 'med-7', day: 7, title: 'Valvular heart disease – 3' },
  { id: 'med-8', day: 8, title: 'Infective endocarditis' },
  { id: 'med-9', day: 9, title: 'Heart failure' },
  { id: 'med-10', day: 10, title: 'Arrhythmia' },
  { id: 'med-11', day: 11, title: 'Diseases of myocardium' },
  { id: 'med-12', day: 12, title: 'Congenital heart disease' },
  { id: 'med-13', day: 13, title: 'Diseases of pericardium' },
  { id: 'med-14', day: 14, title: 'Pulmonary hypertension up to cor pulmonale' },
  { id: 'med-15', day: 15, title: 'Diseases of vessels' },
  { id: 'med-16', day: 16, title: 'Shock' },
  { id: 'med-17', day: 17, title: 'Diseases of lipid' },
  { id: 'med-18', day: 18, title: 'Diabetes Mellitus' },
];

export const DEFAULT_ORTHO_TOPICS: TopicItem[] = [
  { id: 'ortho-1', day: 1, title: 'Basic Anatomy and Physiology of Bone' },
  { id: 'ortho-2', day: 2, title: 'Basic Terminology of Fracture and Healing' },
  { id: 'ortho-3', day: 3, title: 'Open Fracture, Amputations and Polytrauma' },
  { id: 'ortho-4', day: 4, title: 'Metabolic Disorders of Bone' },
  { id: 'ortho-5', day: 5, title: 'Upper Limb Trauma: Clavicle and Shoulder' },
  { id: 'ortho-6', day: 6, title: 'Upper Limb Trauma: Arm and Elbow' },
  { id: 'ortho-7', day: 7, title: 'Upper Limb Trauma: Forearm, Wrist and Hand' },
  { id: 'ortho-8', day: 8, title: 'Lower Limb Trauma: Pelvis and Tests' },
  { id: 'ortho-9', day: 9, title: 'Lower Limb Trauma: Hip Dislocation and Fractures' },
  { id: 'ortho-10', day: 10, title: 'Lower Limb Trauma: Femur, Knee, Leg and Foot' },
  { id: 'ortho-11', day: 11, title: 'Sports Injuries Around Knee' },
  { id: 'ortho-12', day: 12, title: 'Painful Regional Conditions and AVN' },
  { id: 'ortho-13', day: 13, title: 'Nerve Injuries: Part 1' },
  { id: 'ortho-14', day: 14, title: 'Nerve Injuries: Part 2' },
  { id: 'ortho-15', day: 15, title: 'Orthopaedic Oncology: Part 1' },
  { id: 'ortho-16', day: 16, title: 'Orthopaedic Oncology: Part 2' },
  { id: 'ortho-17', day: 17, title: 'Infection of Bone and Joints' },
  { id: 'ortho-18', day: 18, title: 'Tuberculosis of Bone and Joints' },
  { id: 'ortho-19', day: 19, title: 'Paediatric Orthopaedics: Trauma, Neck and Upper Limb' },
  { id: 'ortho-20', day: 20, title: 'Paediatric Orthopaedics: Hip' },
  { id: 'ortho-21', day: 21, title: 'Paediatric Orthopaedics: Knee and Foot' },
  { id: 'ortho-22', day: 22, title: 'Spine: General and Trauma' },
  { id: 'ortho-23', day: 23, title: 'Spine: Disorders' },
  { id: 'ortho-24', day: 24, title: 'Joint Disorders' },
];

export const DEFAULT_HABITS: HabitItem[] = [
  { id: 'habit-1', title: 'Fajr', icon: 'Sun' },
  { id: 'habit-2', title: 'Zuha', icon: 'Sunrise' },
  { id: 'habit-3', title: 'Asr', icon: 'SunMedium' },
  { id: 'habit-4', title: 'Maghrib', icon: 'Sunset' },
  { id: 'habit-5', title: 'Isha', icon: 'Moon' },
  { id: 'habit-6', title: 'Surah Yaseen', icon: 'BookOpen' },
  { id: 'habit-7', title: 'Surah Waqia', icon: 'BookOpenCheck' },
  { id: 'habit-8', title: 'Surah Mulk', icon: 'BookMarked' },
  { id: 'habit-9', title: '2 Ayah with meaning', icon: 'Sparkles' },
  { id: 'habit-10', title: 'Workout', icon: 'Activity' },
];

export const getInitialState = (): AppState => {
  // Use today's date formatted as YYYY-MM-DD as initial start date
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  return {
    settings: {
      startDate: todayStr,
      theme: 'dark',
    },
    lists: {
      medicine: DEFAULT_MEDICINE_TOPICS,
      ortho: DEFAULT_ORTHO_TOPICS,
      habits: DEFAULT_HABITS,
    },
    logs: {},
    topicMeta: {
      'med-1': { rating: 4, note: 'Review lead placement and normal waveforms.', needsRevision: false },
      'ortho-1': { rating: 5, note: 'Haversian systems and osteoblasts vs osteoclasts.', needsRevision: false },
    },
  };
};
