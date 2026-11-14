import type { TopicItem, HabitItem, SubjectConfig, AppState } from '../types';

export const DEFAULT_SUBJECTS: SubjectConfig[] = [
  { id: 'medicine', name: 'Medicine', color: 'rose' },
  { id: 'ortho', name: 'Ortho', color: 'cyan' },
  { id: 'paediatrics', name: 'Paediatrics', color: 'amber' },
  { id: 'obgyn', name: 'Obgyn', color: 'pink' },
  { id: 'surgery', name: 'Surgery', color: 'blue' },
  { id: 'derma', name: 'Derma', color: 'emerald' },
  { id: 'anesthesia', name: 'Anesthesia', color: 'violet' },
  { id: 'psychiatry', name: 'Psychiatry', color: 'indigo' },
  { id: 'ent', name: 'Ent', color: 'teal' },
  { id: 'opthal', name: 'Opthal', color: 'yellow' },
];

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

export const DEFAULT_PAEDIATRICS_TOPICS: TopicItem[] = [
  { id: 'paed-1', day: 1, title: 'Growth and Development Milestones' },
  { id: 'paed-2', day: 2, title: 'Neonatal Resuscitation & APGAR Scoring' },
  { id: 'paed-3', day: 3, title: 'Infant Nutrition & Severe Acute Malnutrition' },
  { id: 'paed-4', day: 4, title: 'National Immunization Schedule & Vaccines' },
  { id: 'paed-5', day: 5, title: 'Congenital Heart Diseases (Acyanotic vs Cyanotic)' },
  { id: 'paed-6', day: 6, title: 'Paediatric Respiratory Distress & Croup' },
  { id: 'paed-7', day: 7, title: 'Acute Gastroenteritis & Dehydration Management' },
  { id: 'paed-8', day: 8, title: 'Febrile Seizures & Childhood Epilepsy' },
  { id: 'paed-9', day: 9, title: 'Nephrotic Syndrome & Glomerulonephritis' },
  { id: 'paed-10', day: 10, title: 'Down Syndrome, Turner & Genetic Syndromes' },
];

export const DEFAULT_OBGYN_TOPICS: TopicItem[] = [
  { id: 'obgyn-1', day: 1, title: 'Physiological Changes in Pregnancy' },
  { id: 'obgyn-2', day: 2, title: 'Antenatal Care & First Trimester Screening' },
  { id: 'obgyn-3', day: 3, title: 'Normal Labour & Partogram Monitoring' },
  { id: 'obgyn-4', day: 4, title: 'Antepartum Haemorrhage (Placenta Praevia & Abruptio)' },
  { id: 'obgyn-5', day: 5, title: 'Hypertensive Disorders & Pre-eclampsia' },
  { id: 'obgyn-6', day: 6, title: 'Postpartum Haemorrhage (PPH) Management' },
  { id: 'obgyn-7', day: 7, title: 'Ectopic Pregnancy & Recurrent Pregnancy Loss' },
  { id: 'obgyn-8', day: 8, title: 'Benign & Malignant Ovarian Tumours' },
  { id: 'obgyn-9', day: 9, title: 'Cervical Cancer Screening (Pap Smear/HPV) & Staging' },
  { id: 'obgyn-10', day: 10, title: 'Infertility Evaluation & Assisted Reproduction' },
];

export const DEFAULT_SURGERY_TOPICS: TopicItem[] = [
  { id: 'surg-1', day: 1, title: 'Fluid & Electrolyte Balance in Surgical Patients' },
  { id: 'surg-2', day: 2, title: 'Surgical Wound Healing & Surgical Site Infections' },
  { id: 'surg-3', day: 3, title: 'Shock, Haemorrhage & Blood Component Transfusion' },
  { id: 'surg-4', day: 4, title: 'Trauma Evaluation & Advanced Trauma Life Support (ATLS)' },
  { id: 'surg-5', day: 5, title: 'Acute Abdomen & Appendicitis Diagnosis' },
  { id: 'surg-6', day: 6, title: 'Intestinal Obstruction & Groin Hernias' },
  { id: 'surg-7', day: 7, title: 'Gallbladder Diseases, Cholelithiasis & Choledocholithiasis' },
  { id: 'surg-8', day: 8, title: 'Thyroid Nodules & Thyroid Carcinoma' },
  { id: 'surg-9', day: 9, title: 'Breast Lump Assessment & Triple Assessment of Breast' },
  { id: 'surg-10', day: 10, title: 'Peripheral Arterial Disease & Varicose Veins' },
];

export const DEFAULT_DERMA_TOPICS: TopicItem[] = [
  { id: 'derma-1', day: 1, title: 'Skin Anatomy, Histology & Primary Lesions' },
  { id: 'derma-2', day: 2, title: 'Papulosquamous Disorders: Psoriasis & Lichen Planus' },
  { id: 'derma-3', day: 3, title: 'Eczematous Dermatitis & Contact Allergies' },
  { id: 'derma-4', day: 4, title: 'Bacterial Infections: Impetigo, Erysipelas & Cellulitis' },
  { id: 'derma-5', day: 5, title: 'Fungal Infections: Dermatophytoses & Candidiasis' },
  { id: 'derma-6', day: 6, title: 'Viral Exanthems, Herpes Zoster & HSV' },
  { id: 'derma-7', day: 7, title: 'Autoimmune Bullous Disorders: Pemphigus vs Pemphigoid' },
  { id: 'derma-8', day: 8, title: 'Acne Vulgaris, Rosacea & Hidradenitis Suppurativa' },
  { id: 'derma-9', day: 9, title: 'Leprosy (Hansen Disease) Classification & Reactions' },
  { id: 'derma-10', day: 10, title: 'Cutaneous Manifestations of Systemic Disease' },
];

export const DEFAULT_ANESTHESIA_TOPICS: TopicItem[] = [
  { id: 'anes-1', day: 1, title: 'Pre-anesthetic Evaluation & ASA Physical Status' },
  { id: 'anes-2', day: 2, title: 'Airway Assessment & Difficult Airway Algorithm' },
  { id: 'anes-3', day: 3, title: 'Inhalational Anesthetic Agents (Sevoflurane, Isoflurane)' },
  { id: 'anes-4', day: 4, title: 'Intravenous Induction Agents (Propofol, Etomidate, Ketamine)' },
  { id: 'anes-5', day: 5, title: 'Neuromuscular Blockers & Reversal with Sugammadex' },
  { id: 'anes-6', day: 6, title: 'Subarachnoid Block (Spinal Anesthesia) & Complications' },
  { id: 'anes-7', day: 7, title: 'Epidural Anesthesia & Peripheral Nerve Blocks' },
  { id: 'anes-8', day: 8, title: 'Local Anesthetic Systemic Toxicity (LAST) & Lipid Rescue' },
  { id: 'anes-9', day: 9, title: 'Intraoperative Monitoring & Capnography Interpretation' },
  { id: 'anes-10', day: 10, title: 'Cardiopulmonary Resuscitation (ACLS Guidelines 2025)' },
];

export const DEFAULT_PSYCHIATRY_TOPICS: TopicItem[] = [
  { id: 'psych-1', day: 1, title: 'Mental Status Examination (MSE) Methodology' },
  { id: 'psych-2', day: 2, title: 'Major Depressive Disorder & Antidepressant Selection' },
  { id: 'psych-3', day: 3, title: 'Bipolar Affective Disorder & Mood Stabilizers (Lithium)' },
  { id: 'psych-4', day: 4, title: 'Schizophrenia Spectrum & Antipsychotic Management' },
  { id: 'psych-5', day: 5, title: 'Anxiety Disorders, Panic Disorder & Phobias' },
  { id: 'psych-6', day: 6, title: 'Obsessive-Compulsive Disorder (OCD) & ERP Therapy' },
  { id: 'psych-7', day: 7, title: 'Alcohol & Substance Use Disorders: Intoxication & Withdrawal' },
  { id: 'psych-8', day: 8, title: 'Sleep-Wake Disorders & Insomnia Management' },
  { id: 'psych-9', day: 9, title: 'Childhood Psychiatric Conditions: ADHD & Autism Spectrum' },
  { id: 'psych-10', day: 10, title: 'Psychiatric Emergencies: Acute Delirium & Suicidal Risk' },
];

export const DEFAULT_ENT_TOPICS: TopicItem[] = [
  { id: 'ent-1', day: 1, title: 'Surgical Anatomy of Middle Ear & Hearing Mechanics' },
  { id: 'ent-2', day: 2, title: 'Otitis Media: ASOM, OME & Chronic Suppurative Otitis' },
  { id: 'ent-3', day: 3, title: 'Tuning Fork Tests & Pure Tone Audiometry Interpretation' },
  { id: 'ent-4', day: 4, title: 'Peripheral vs Central Vertigo & Meniere Disease' },
  { id: 'ent-5', day: 5, title: 'Allergic Rhinitis, Nasal Polyps & Deviated Nasal Septum' },
  { id: 'ent-6', day: 6, title: 'Acute & Chronic Sinusitis (FESS Principles)' },
  { id: 'ent-7', day: 7, title: 'Epistaxis Etiology & Emergency Tamponade Protocol' },
  { id: 'ent-8', day: 8, title: 'Tonsillitis, Adenoid Hypertrophy & Quinsy' },
  { id: 'ent-9', day: 9, title: 'Stridor, Foreign Body Aspiration & Tracheostomy' },
  { id: 'ent-10', day: 10, title: 'Hoarseness of Voice & Laryngeal Carcinoma Staging' },
];

export const DEFAULT_OPTHAL_TOPICS: TopicItem[] = [
  { id: 'opth-1', day: 1, title: 'Anatomy of Globe, Cornea & Visual Pathway' },
  { id: 'opth-2', day: 2, title: 'Optics, Refractive Errors (Myopia/Hyperopia) & Astigmatism' },
  { id: 'opth-3', day: 3, title: 'Infectious Keratitis, Corneal Ulcer & Fungal Keratitis' },
  { id: 'opth-4', day: 4, title: 'Cataract Types, Pathogenesis & Phacoemulsification' },
  { id: 'opth-5', day: 5, title: 'Primary Open Angle Glaucoma & Medical Management' },
  { id: 'opth-6', day: 6, title: 'Acute Angle Closure Glaucoma & Emergency Laser Iridotomy' },
  { id: 'opth-7', day: 7, title: 'Anterior & Posterior Uveitis & Systemic Correlations' },
  { id: 'opth-8', day: 8, title: 'Diabetic Retinopathy Screening, Staging & Anti-VEGF' },
  { id: 'opth-9', day: 9, title: 'Rhegmatogenous Retinal Detachment & Flashes/Floaters' },
  { id: 'opth-10', day: 10, title: 'Neuro-ophthalmology: Optic Neuritis, Papilloedema & Pupils' },
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
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

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

  return {
    settings: {
      startDate: todayStr,
      theme: 'dark',
    },
    lists: {
      subjects: DEFAULT_SUBJECTS,
      topics: defaultTopics,
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
