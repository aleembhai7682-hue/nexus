import {
  AcademicProfile,
  Subject,
  Chapter,
  PracticalItem,
  StudyTask,
  FocusSession,
  YouTubeItem,
  BlogPostItem,
  UniversalNote,
  CollegeModule,
  BackupPayload,
} from '../types';
import {
  DEFAULT_PROFILE,
  DEFAULT_SUBJECTS,
  DEFAULT_CHAPTERS,
  DEFAULT_PRACTICALS,
  DEFAULT_TASKS,
  DEFAULT_YOUTUBE_ITEMS,
  DEFAULT_BLOG_ITEMS,
  DEFAULT_NOTES,
  makeDefaultChecklistItems,
} from '../data/defaultSyllabus';

const DB_NAME = 'nexus_desk_db';
const DB_VERSION = 2;

export const STORES = {
  PROFILES: 'profiles',
  SUBJECTS: 'subjects',
  CHAPTERS: 'chapters',
  PRACTICALS: 'practicals',
  TASKS: 'tasks',
  FOCUS: 'focus_sessions',
  YOUTUBE: 'youtube_items',
  BLOGS: 'blog_items',
  NOTES: 'notes',
  COLLEGE: 'college_modules',
} as const;

export class NexusDB {
  private static dbPromise: Promise<IDBDatabase> | null = null;

  public static getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported in this browser.'));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores if not existing
        if (!db.objectStoreNames.contains(STORES.PROFILES)) {
          db.createObjectStore(STORES.PROFILES, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.SUBJECTS)) {
          const sStore = db.createObjectStore(STORES.SUBJECTS, { keyPath: 'id' });
          sStore.createIndex('profileId', 'profileId', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORES.CHAPTERS)) {
          const cStore = db.createObjectStore(STORES.CHAPTERS, { keyPath: 'id' });
          cStore.createIndex('subjectId', 'subjectId', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORES.PRACTICALS)) {
          const prStore = db.createObjectStore(STORES.PRACTICALS, { keyPath: 'id' });
          prStore.createIndex('subjectId', 'subjectId', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORES.TASKS)) {
          const tStore = db.createObjectStore(STORES.TASKS, { keyPath: 'id' });
          tStore.createIndex('date', 'date', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORES.FOCUS)) {
          const fStore = db.createObjectStore(STORES.FOCUS, { keyPath: 'id' });
          fStore.createIndex('date', 'date', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORES.YOUTUBE)) {
          db.createObjectStore(STORES.YOUTUBE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.BLOGS)) {
          db.createObjectStore(STORES.BLOGS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.NOTES)) {
          db.createObjectStore(STORES.NOTES, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.COLLEGE)) {
          db.createObjectStore(STORES.COLLEGE, { keyPath: 'id' });
        }
      };

      request.onsuccess = async (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // Check if database needs seeding with preloaded verified CBSE 12 data
        try {
          await NexusDB.seedInitialDataIfEmpty(db);
        } catch (e) {
          console.warn('Seeding check warning:', e);
        }
        resolve(db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });

    return this.dbPromise;
  }

  private static async seedInitialDataIfEmpty(db: IDBDatabase): Promise<void> {
    const count = await new Promise<number>((res) => {
      const tx = db.transaction(STORES.SUBJECTS, 'readonly');
      const store = tx.objectStore(STORES.SUBJECTS);
      const req = store.count();
      req.onsuccess = () => res(req.result);
      req.onerror = () => res(0);
    });

    const practicalsCount = await new Promise<number>((res) => {
      if (!db.objectStoreNames.contains(STORES.PRACTICALS)) {
        res(0);
        return;
      }
      const tx = db.transaction(STORES.PRACTICALS, 'readonly');
      const store = tx.objectStore(STORES.PRACTICALS);
      const req = store.count();
      req.onsuccess = () => res(req.result);
      req.onerror = () => res(0);
    });

    if (count === 0 || practicalsCount === 0) {
      console.log('NEXUS DESK: Seeding/updating verified CBSE Class 12 Syllabus & Practicals...');
      const storesToSeed = [
        STORES.PROFILES,
        STORES.SUBJECTS,
        STORES.CHAPTERS,
        STORES.PRACTICALS,
        STORES.TASKS,
        STORES.YOUTUBE,
        STORES.BLOGS,
        STORES.NOTES,
      ];

      const tx = db.transaction(storesToSeed, 'readwrite');

      if (count === 0) {
        const pStore = tx.objectStore(STORES.PROFILES);
        pStore.put(DEFAULT_PROFILE);

        const sStore = tx.objectStore(STORES.SUBJECTS);
        DEFAULT_SUBJECTS.forEach((s) => sStore.put(s));

        const cStore = tx.objectStore(STORES.CHAPTERS);
        DEFAULT_CHAPTERS.forEach((c) => {
          cStore.put({
            ...c,
            customChecklist: c.customChecklist || makeDefaultChecklistItems(c.checklist),
          });
        });

        const tStore = tx.objectStore(STORES.TASKS);
        DEFAULT_TASKS.forEach((t) => tStore.put(t));

        const ytStore = tx.objectStore(STORES.YOUTUBE);
        DEFAULT_YOUTUBE_ITEMS.forEach((y) => ytStore.put(y));

        const bStore = tx.objectStore(STORES.BLOGS);
        DEFAULT_BLOG_ITEMS.forEach((b) => bStore.put(b));

        const nStore = tx.objectStore(STORES.NOTES);
        DEFAULT_NOTES.forEach((n) => nStore.put(n));
      }

      if (practicalsCount === 0) {
        const prStore = tx.objectStore(STORES.PRACTICALS);
        DEFAULT_PRACTICALS.forEach((pr) => prStore.put(pr));
      }

      await new Promise<void>((res, rej) => {
        tx.oncomplete = () => res();
        tx.onerror = () => rej(tx.error);
      });
    }
  }

  public static async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  }

  public static async put<T>(storeName: string, item: T): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public static async delete(storeName: string, id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public static async exportBackup(): Promise<BackupPayload> {
    const profiles = await this.getAll<AcademicProfile>(STORES.PROFILES);
    const subjects = await this.getAll<Subject>(STORES.SUBJECTS);
    const chapters = await this.getAll<Chapter>(STORES.CHAPTERS);
    const practicals = await this.getAll<PracticalItem>(STORES.PRACTICALS);
    const tasks = await this.getAll<StudyTask>(STORES.TASKS);
    const focusSessions = await this.getAll<FocusSession>(STORES.FOCUS);
    const youtubeItems = await this.getAll<YouTubeItem>(STORES.YOUTUBE);
    const blogItems = await this.getAll<BlogPostItem>(STORES.BLOGS);
    const notes = await this.getAll<UniversalNote>(STORES.NOTES);
    const collegeModules = await this.getAll<CollegeModule>(STORES.COLLEGE);

    return {
      version: '1.0',
      exportTimestamp: new Date().toISOString(),
      profiles,
      subjects,
      chapters,
      practicals,
      tasks,
      focusSessions,
      youtubeItems,
      blogItems,
      notes,
      collegeModules,
    };
  }

  public static async importBackup(payload: BackupPayload): Promise<void> {
    if (!payload || !payload.version) {
      throw new Error('Invalid backup file format.');
    }

    const db = await this.getDB();
    const allStoreNames = [
      STORES.PROFILES,
      STORES.SUBJECTS,
      STORES.CHAPTERS,
      STORES.PRACTICALS,
      STORES.TASKS,
      STORES.FOCUS,
      STORES.YOUTUBE,
      STORES.BLOGS,
      STORES.NOTES,
      STORES.COLLEGE,
    ];

    const tx = db.transaction(allStoreNames, 'readwrite');

    // Clear existing
    allStoreNames.forEach((s) => tx.objectStore(s).clear());

    // Populate from backup
    payload.profiles?.forEach((item) => tx.objectStore(STORES.PROFILES).put(item));
    payload.subjects?.forEach((item) => tx.objectStore(STORES.SUBJECTS).put(item));
    payload.chapters?.forEach((item) => tx.objectStore(STORES.CHAPTERS).put(item));
    payload.practicals?.forEach((item) => tx.objectStore(STORES.PRACTICALS).put(item));
    payload.tasks?.forEach((item) => tx.objectStore(STORES.TASKS).put(item));
    payload.focusSessions?.forEach((item) => tx.objectStore(STORES.FOCUS).put(item));
    payload.youtubeItems?.forEach((item) => tx.objectStore(STORES.YOUTUBE).put(item));
    payload.blogItems?.forEach((item) => tx.objectStore(STORES.BLOGS).put(item));
    payload.notes?.forEach((item) => tx.objectStore(STORES.NOTES).put(item));
    payload.collegeModules?.forEach((item) => tx.objectStore(STORES.COLLEGE).put(item));

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public static async resetToDefaults(): Promise<void> {
    const db = await this.getDB();
    const allStoreNames = [
      STORES.PROFILES,
      STORES.SUBJECTS,
      STORES.CHAPTERS,
      STORES.PRACTICALS,
      STORES.TASKS,
      STORES.FOCUS,
      STORES.YOUTUBE,
      STORES.BLOGS,
      STORES.NOTES,
      STORES.COLLEGE,
    ];

    const tx = db.transaction(allStoreNames, 'readwrite');
    allStoreNames.forEach((s) => tx.objectStore(s).clear());

    tx.objectStore(STORES.PROFILES).put(DEFAULT_PROFILE);
    DEFAULT_SUBJECTS.forEach((s) => tx.objectStore(STORES.SUBJECTS).put(s));
    DEFAULT_CHAPTERS.forEach((c) => {
      tx.objectStore(STORES.CHAPTERS).put({
        ...c,
        customChecklist: c.customChecklist || makeDefaultChecklistItems(c.checklist),
      });
    });
    DEFAULT_PRACTICALS.forEach((p) => tx.objectStore(STORES.PRACTICALS).put(p));
    DEFAULT_TASKS.forEach((t) => tx.objectStore(STORES.TASKS).put(t));
    DEFAULT_YOUTUBE_ITEMS.forEach((y) => tx.objectStore(STORES.YOUTUBE).put(y));
    DEFAULT_BLOG_ITEMS.forEach((b) => tx.objectStore(STORES.BLOGS).put(b));
    DEFAULT_NOTES.forEach((n) => tx.objectStore(STORES.NOTES).put(n));

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}
