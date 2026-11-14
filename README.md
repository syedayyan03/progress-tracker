# Daily Progress Tracker | Medical & Habits Study Tracker

A functional, responsive, offline-first recreation of the **SIS Daily Progress Tracker** (`https://sis-progress-tracker.vercel.app/`).

Designed for medical students and structured learners to balance medical curriculum milestones (Internal Medicine & Orthopaedics) alongside a 10-point daily spiritual and lifestyle habit routine.

---

## 🌟 Key Features

### 1. View Navigation & Routing
- **Today View (`/today`):**
  - Hero progress card with animated circular SVG completion ring and dynamic motivational coach.
  - Syllabus day calculator automatically mapping calendar dates to syllabus days based on the configurable start date.
  - Category-tagged cards for Medicine and Orthopaedics with completion checkboxes, Day tags, star ratings (`★`), revision flags, and notes snippets.
  - General Daily Habits checklist (10 core habits) with custom Lucide icons.
  - Auto-saving Daily Reflection & Notes editor for clinical notes and focus evaluations.
  - Celebration confetti effect upon reaching 100% completion.
- **Calendar View (`/calendar`):**
  - Month navigation with previous/next controls.
  - 3 Monthly KPI Cards: Average Completion %, Active Days Recorded, and 100% Perfect Days (🌟).
  - Color-coded monthly grid (Sun–Sat) with 5 completion tiers and subject status indicators (Coral for Medicine, Cyan for Orthopaedics).
  - Interactive Day Inspector allowing task completion, note-taking, and modal inspection for past and future dates.
- **Analytics View (`/analytics`):**
  - 6 Key Performance Indicator (KPI) metrics cards: Topics Completed, Overall Completion %, Current Active Streak, Velocity Projected Finish Date, Best Day Record, and Overdue / Pending.
  - Smart Performance Insights engine evaluating Strongest Day, Lowest Day, Friction Habits, and Consistency Rockstars.
  - 52-Week Contribution Heatmap (365 days) with category filters (Overall, Medicine, Ortho, Habits) and 5 intensity tiers.
  - Completion Trend with 7-Day Moving Average (7D, 30D, 90D, and All-time filters).
  - Subject Syllabus Completion gauges and 30-day Habit Friction & Skipped Ranking.
  - Multi-dimensional Study & Habit Domain Radar balance chart.
  - Day-of-Week consistency distribution bar chart with highest/lowest day highlights.
  - Consecutive 8-Week progress comparison bar chart.
- **Settings & Management (`/settings`):**
  - Curriculum Start Date picker with live mapping feedback.
  - Appearance selector: System, Dark, and Light themes.
  - Interactive Checklist Manager with tabs for Medicine (18), Ortho (24), and Habits (10).
  - Full CRUD operations: Add new topic/habit, click-to-edit inline renaming, move up/down reordering, and item deletion.
  - JSON Backup Export with timestamped filename (`daily_progress_tracker_backup_YYYY-MM-DD.json`).
  - JSON Backup Import with real-time state restore.
  - Load Sample Data generator (45 days of realistic study logs and ratings).
  - Destructive Reset All Data with confirmation dialog.

---

## 🛠 Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS + PostCSS + Autoprefixer
- **Typography:** Google Fonts (`Outfit` display font & `Inter` sans font)
- **Icons:** Lucide React
- **Visualizations:** Recharts (AreaChart, BarChart, RadarChart)
- **Animations & Effects:** Canvas Confetti + Tailwind transitions
- **Testing:** Playwright (Chromium & Mobile Chrome emulation)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone or navigate to the project directory
cd d:/habit-tracker

# Install dependencies
npm install
```

### Running Locally
```bash
# Start Vite development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```bash
npm run build
npm run preview
```

---

## 🧪 Testing with Playwright

The project includes an end-to-end test suite testing all routes, user interactions, CRUD operations, calculations, and responsive layouts:

```bash
# Run all Playwright tests
npx playwright test

# Run tests in UI mode
npx playwright test --ui
```

**Test Coverage Summary:**
- `e2e/views-navigation.spec.ts`: Tests all 4 main views, date switcher, theme toggles, and mobile layout.
- `e2e/today-interactions.spec.ts`: Tests habit and topic toggles, live progress circle, topic/habit details modals, and localStorage persistence.
- `e2e/calendar.spec.ts`: Tests month switching, 3 monthly KPI cards, monthly grid cell indicators, and Day Inspector.
- `e2e/analytics.spec.ts`: Tests 6 KPI cards, Smart Performance Insights, 52-week heatmap tabs, trend filters, and all Recharts visualizations.
- `e2e/settings-crud.spec.ts`: Tests start date adjustments, checklist item additions, inline renames, reorder, delete, backup export/import, and confirmation dialogs.

---

## 📦 Data Schema & State Architecture

All state is stored locally in `localStorage` under the key `sis_progress_tracker_state`:

```typescript
interface AppState {
  settings: {
    startDate: string; // "YYYY-MM-DD"
    theme: "system" | "dark" | "light";
  };
  lists: {
    medicine: Array<{ id: string; day: number; title: string }>;
    ortho: Array<{ id: string; day: number; title: string }>;
    habits: Array<{ id: string; title: string; icon: string }>;
  };
  logs: {
    [dateString: string]: { // "YYYY-MM-DD"
      habits: string[];     // IDs of completed habits
      medicine: string[];   // IDs of completed medicine topics
      ortho: string[];      // IDs of completed orthopaedics topics
      notes: string;        // Daily reflection string
    };
  };
  topicMeta: {
    [topicId: string]: {
      rating: number;        // 1 to 5 stars
      note: string;          // Clinical notes & mnemonics
      needsRevision: boolean;// Revision flag
    };
  };
}
```

---

## 🔒 Environment Variables

No external API keys or server credentials are required. The application is completely private, local-first, and offline-capable (PWA ready).
