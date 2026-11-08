export type WorkspaceView =
  | 'dashboard'
  | 'study'
  | 'planner'
  | 'focus'
  | 'youtube'
  | 'blogs'
  | 'notes'
  | 'college'
  | 'backup';

export type Language = 'english' | 'hinglish';
export type Theme = 'dark' | 'light';

export interface AcademicProfile {
  id: string;
  type: 'cbse_school' | 'college_university';
  name: string;
  sessionYear: string;
  degreeOrGrade: string;
  institution?: string;
  isDefault: boolean;
  createdDate: string;
}

export interface Subject {
  id: string;
  profileId: string;
  code: string;
  name: string;
  color: string;
  targetScore: number;
  totalChapters: number;
  hasPracticals?: boolean;
  theoryMarks?: number;
  practicalMarks?: number;
  description?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  isDefault?: boolean;
}

export interface ChapterChecklist {
  theoryCompleted: boolean;
  notesCompleted: boolean;
  examplesPracticed: boolean;
  ncertQuestionsCompleted: boolean;
  extraQuestionsPracticed: boolean;
  revisionCompleted: boolean;
  finalConfirmation: boolean;
}

export interface Chapter {
  id: string;
  subjectId: string;
  chapterNumber: number;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed';
  checklist: ChapterChecklist;
  customChecklist?: ChecklistItem[];
  targetDate?: string;
  completedDate?: string;
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
  completedHours: number;
  subtopics: string[];
  personalNotes?: string;
}

export interface PracticalItem {
  id: string;
  subjectId: string;
  section: string; // e.g. "Section A Experiments", "Section 1: Nature and Object Study", etc.
  title: string;
  aimOrDescription: string;
  completed: boolean;
  recordFileWritten: boolean;
  teacherSigned: boolean;
  marksWeightage?: number;
  notes?: string;
}

export interface StudyTask {
  id: string;
  title: string;
  type: 'study_session' | 'chapter_deadline' | 'exam' | 'revision' | 'custom_task';
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  durationMinutes: number;
  subjectId?: string;
  chapterId?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  aiSuggested?: boolean;
}

export interface FocusSession {
  id: string;
  timestamp: string; // ISO string
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  mode: '25_5' | '50_10' | 'custom';
  subjectId?: string;
  chapterId?: string;
  projectId?: string;
  completed: boolean;
  notes?: string;
}

export type ContentStage =
  | 'idea'
  | 'research'
  | 'script'
  | 'recording'
  | 'editing'
  | 'thumbnail'
  | 'scheduled'
  | 'published';

export interface YouTubeItem {
  id: string;
  channelName: string;
  title: string;
  format: 'long_form' | 'short';
  stage: ContentStage;
  targetDate?: string;
  videoUrl?: string;
  researchNotes: string;
  scriptContent: string;
  recordingChecklist: { id: string; task: string; done: boolean }[];
  editingChecklist: { id: string; task: string; done: boolean }[];
  thumbnailConcept: string;
  updatedAt: string;
}

export type BlogStage =
  | 'idea'
  | 'research'
  | 'outline'
  | 'draft'
  | 'editing'
  | 'ready'
  | 'published';

export interface BlogPostItem {
  id: string;
  blogName: string; // e.g. "NOVENTRA" | "Arena IQ"
  title: string;
  seoKeywords: string[];
  metaDescription: string;
  stage: BlogStage;
  outline: string;
  draftContent: string;
  editingChecklist: { id: string; task: string; done: boolean }[];
  scheduledDate?: string;
  publishedUrl?: string;
  updatedAt: string;
}

export interface UniversalNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  linkedSubjectId?: string;
  linkedChapterId?: string;
  linkedProjectId?: string;
  updatedAt: string;
}

export interface CollegeModule {
  id: string;
  profileId: string;
  semester: string; // "Sem 1", "Sem 2", etc.
  courseCode: string;
  courseName: string;
  credits: number;
  units: { name: string; completed: boolean }[];
  practicals: { title: string; submitted: boolean }[];
  targetGrade?: string;
}

export interface BackupPayload {
  version: '1.0';
  exportTimestamp: string;
  profiles: AcademicProfile[];
  subjects: Subject[];
  chapters: Chapter[];
  practicals?: PracticalItem[];
  tasks: StudyTask[];
  focusSessions: FocusSession[];
  youtubeItems: YouTubeItem[];
  blogItems: BlogPostItem[];
  notes: UniversalNote[];
  collegeModules?: CollegeModule[];
}
