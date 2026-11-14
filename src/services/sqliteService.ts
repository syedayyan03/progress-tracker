import initSqlJs from 'sql.js';
import type { Database } from 'sql.js';
import type { AppState, SubjectConfig, TopicItem, HabitItem, DayLog, TopicMeta } from '../types';

const SQLITE_DB_KEY = 'sqlite3_cache_token_db';
const SQLITE_TOKEN_KEY = 'sqlite3_cache_token';

let dbInstance: Database | null = null;
let isInitializing = false;

export const initSQLite = async (): Promise<Database> => {
  if (dbInstance) return dbInstance;
  if (isInitializing) {
    // Wait until initialized
    while (isInitializing) {
      await new Promise(r => setTimeout(r, 50));
    }
    if (dbInstance) return dbInstance;
  }

  isInitializing = true;
  try {
    const SQL = await initSqlJs({
      locateFile: file => `/${file}`,
    });

    const savedBinaryBase64 = localStorage.getItem(SQLITE_DB_KEY);
    if (savedBinaryBase64) {
      try {
        const binaryString = atob(savedBinaryBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        dbInstance = new SQL.Database(bytes);
      } catch (e) {
        console.warn('Could not restore existing SQLite database from cache token, creating new:', e);
        dbInstance = new SQL.Database();
      }
    } else {
      dbInstance = new SQL.Database();
    }

    createTables(dbInstance);
    return dbInstance;
  } finally {
    isInitializing = false;
  }
};

const createTables = (db: Database) => {
  db.run(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      name TEXT,
      color TEXT,
      order_idx INTEGER
    );

    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      subject_id TEXT,
      day INTEGER,
      title TEXT,
      order_idx INTEGER
    );

    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      title TEXT,
      icon TEXT,
      order_idx INTEGER
    );

    CREATE TABLE IF NOT EXISTS day_logs (
      date_str TEXT PRIMARY KEY,
      habits_json TEXT,
      subject_completions_json TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS topic_meta (
      topic_id TEXT PRIMARY KEY,
      rating INTEGER,
      note TEXT,
      needs_revision INTEGER,
      scheduled_date TEXT
    );

    CREATE TABLE IF NOT EXISTS cache_tokens (
      token_key TEXT PRIMARY KEY,
      token_val TEXT,
      updated_at INTEGER
    );
  `);
};

export const syncStateToSQLite = async (state: AppState): Promise<string> => {
  try {
    const db = await initSQLite();

    db.run('BEGIN TRANSACTION;');

    // 1. Settings
    db.run('DELETE FROM app_settings;');
    const stmtSettings = db.prepare('INSERT INTO app_settings (key, value) VALUES (?, ?);');
    stmtSettings.run(['startDate', state.settings.startDate]);
    stmtSettings.run(['theme', state.settings.theme]);
    stmtSettings.free();

    // 2. Subjects
    db.run('DELETE FROM subjects;');
    const stmtSubj = db.prepare('INSERT INTO subjects (id, name, color, order_idx) VALUES (?, ?, ?, ?);');
    (state.lists.subjects || []).forEach((subj, idx) => {
      stmtSubj.run([subj.id, subj.name, subj.color, idx]);
    });
    stmtSubj.free();

    // 3. Topics
    db.run('DELETE FROM topics;');
    const stmtTopic = db.prepare('INSERT INTO topics (id, subject_id, day, title, order_idx) VALUES (?, ?, ?, ?, ?);');
    if (state.lists.topics) {
      Object.entries(state.lists.topics).forEach(([subjectId, topicList]) => {
        topicList.forEach((topic, idx) => {
          stmtTopic.run([topic.id, subjectId, topic.day, topic.title, idx]);
        });
      });
    }
    stmtTopic.free();

    // 4. Habits
    db.run('DELETE FROM habits;');
    const stmtHabit = db.prepare('INSERT INTO habits (id, title, icon, order_idx) VALUES (?, ?, ?, ?);');
    (state.lists.habits || []).forEach((h, idx) => {
      stmtHabit.run([h.id, h.title, h.icon, idx]);
    });
    stmtHabit.free();

    // 5. Day Logs
    db.run('DELETE FROM day_logs;');
    const stmtLog = db.prepare('INSERT INTO day_logs (date_str, habits_json, subject_completions_json, notes) VALUES (?, ?, ?, ?);');
    Object.entries(state.logs || {}).forEach(([dateStr, log]) => {
      const subjectComps = log.subjectCompletions || {
        medicine: log.medicine || [],
        ortho: log.ortho || [],
      };
      stmtLog.run([
        dateStr,
        JSON.stringify(log.habits || []),
        JSON.stringify(subjectComps),
        log.notes || ''
      ]);
    });
    stmtLog.free();

    // 6. Topic Meta
    db.run('DELETE FROM topic_meta;');
    const stmtMeta = db.prepare('INSERT INTO topic_meta (topic_id, rating, note, needs_revision, scheduled_date) VALUES (?, ?, ?, ?, ?);');
    Object.entries(state.topicMeta || {}).forEach(([topicId, meta]) => {
      stmtMeta.run([
        topicId,
        meta.rating || 0,
        meta.note || '',
        meta.needsRevision ? 1 : 0,
        meta.scheduledDate || ''
      ]);
    });
    stmtMeta.free();

    // 7. Generate & Save Cache Token
    const now = Date.now();
    const token = `sql3_token_${now.toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
    db.run('DELETE FROM cache_tokens;');
    const stmtToken = db.prepare('INSERT INTO cache_tokens (token_key, token_val, updated_at) VALUES (?, ?, ?);');
    stmtToken.run(['session_cache', token, now]);
    stmtToken.free();

    db.run('COMMIT;');

    // Export SQLite binary to Uint8Array and store as Base64 in localStorage cache
    const binary = db.export();
    let binaryString = '';
    const chunk = 8192;
    for (let i = 0; i < binary.length; i += chunk) {
      const sub = binary.subarray(i, i + chunk);
      binaryString += String.fromCharCode.apply(null, Array.from(sub));
    }
    const base64 = btoa(binaryString);

    localStorage.setItem(SQLITE_DB_KEY, base64);
    localStorage.setItem(SQLITE_TOKEN_KEY, token);

    return token;
  } catch (err) {
    console.error('Failed to sync to SQLite3 browser cache token:', err);
    return '';
  }
};

export const loadStateFromSQLite = async (): Promise<AppState | null> => {
  try {
    const db = await initSQLite();

    // 1. Settings
    const settingsRes = db.exec('SELECT key, value FROM app_settings;');
    let startDate = '';
    let theme: 'system' | 'dark' | 'light' = 'dark';
    if (settingsRes.length > 0) {
      settingsRes[0].values.forEach(([key, val]) => {
        if (key === 'startDate') startDate = String(val);
        if (key === 'theme') theme = val as any;
      });
    }

    if (!startDate) return null; // database has no state yet

    // 2. Subjects
    const subjRes = db.exec('SELECT id, name, color FROM subjects ORDER BY order_idx ASC;');
    const subjects: SubjectConfig[] = [];
    if (subjRes.length > 0) {
      subjRes[0].values.forEach(([id, name, color]) => {
        subjects.push({
          id: String(id),
          name: String(name),
          color: String(color),
        });
      });
    }

    // 3. Topics
    const topicsRes = db.exec('SELECT id, subject_id, day, title FROM topics ORDER BY order_idx ASC;');
    const topicsMap: Record<string, TopicItem[]> = {};
    if (topicsRes.length > 0) {
      topicsRes[0].values.forEach(([id, subject_id, day, title]) => {
        const sId = String(subject_id);
        if (!topicsMap[sId]) topicsMap[sId] = [];
        topicsMap[sId].push({
          id: String(id),
          day: Number(day),
          title: String(title),
        });
      });
    }

    // 4. Habits
    const habitsRes = db.exec('SELECT id, title, icon FROM habits ORDER BY order_idx ASC;');
    const habits: HabitItem[] = [];
    if (habitsRes.length > 0) {
      habitsRes[0].values.forEach(([id, title, icon]) => {
        habits.push({
          id: String(id),
          title: String(title),
          icon: String(icon),
        });
      });
    }

    // 5. Day Logs
    const logsRes = db.exec('SELECT date_str, habits_json, subject_completions_json, notes FROM day_logs;');
    const logs: Record<string, DayLog> = {};
    if (logsRes.length > 0) {
      logsRes[0].values.forEach(([date_str, habits_json, subject_completions_json, notes]) => {
        let habitsArr: string[] = [];
        let subjectComps: Record<string, string[]> = {};
        try {
          habitsArr = JSON.parse(String(habits_json));
        } catch {
          habitsArr = [];
        }
        try {
          subjectComps = JSON.parse(String(subject_completions_json));
        } catch {
          subjectComps = {};
        }

        logs[String(date_str)] = {
          habits: habitsArr,
          subjectCompletions: subjectComps,
          medicine: subjectComps['medicine'] || [],
          ortho: subjectComps['ortho'] || [],
          notes: String(notes || ''),
        };
      });
    }

    // 6. Topic Meta
    const metaRes = db.exec('SELECT topic_id, rating, note, needs_revision, scheduled_date FROM topic_meta;');
    const topicMeta: Record<string, TopicMeta> = {};
    if (metaRes.length > 0) {
      metaRes[0].values.forEach(([topic_id, rating, note, needs_revision, scheduled_date]) => {
        topicMeta[String(topic_id)] = {
          rating: Number(rating) || 0,
          note: String(note || ''),
          needsRevision: Number(needs_revision) === 1,
          scheduledDate: scheduled_date ? String(scheduled_date) : undefined,
        };
      });
    }

    return {
      settings: {
        startDate,
        theme,
      },
      lists: {
        subjects,
        topics: topicsMap,
        medicine: topicsMap['medicine'] || [],
        ortho: topicsMap['ortho'] || [],
        habits,
      },
      logs,
      topicMeta,
    };
  } catch (e) {
    console.error('Error reading from SQLite3 browser database:', e);
    return null;
  }
};

export const getSQLiteCacheToken = (): string => {
  return localStorage.getItem(SQLITE_TOKEN_KEY) || 'sql3_token_uninitialized';
};
