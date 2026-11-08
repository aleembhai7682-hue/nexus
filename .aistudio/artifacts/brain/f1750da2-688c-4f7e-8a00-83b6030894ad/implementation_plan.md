# NEXUS DESK — Desktop Command Center & Academic Workspace

NEXUS DESK is a desktop-first personal productivity and academic command center designed for Windows laptops running modern browsers (Chrome & Edge). It serves as a unified workspace for Class 12 CBSE board preparation (Session 2026–27), seamless transition into future college/university degrees, daily scheduling, Pomodoro focus tracking, YouTube creator workflows (High-tech gamer channel), blog content operations (NOVENTRA & Arena IQ), and server-side Gemini AI assistance.

***

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural parameters have been confirmed based on your preferences:
> - **CBSE Class 12 Syllabus**: Preloaded with official, verified CBSE 2026–27 chapters for all 5 subjects: Physics (14 chapters), Chemistry (10 chapters), Mathematics (13 chapters), Informatics Practices (4 units/chapters), and Painting (3 units/chapters) with fully customizable subtopics.
> - **Phase 1 Delivery Priority**: Foundation begins with the Core Study Desk (subjects, chapters, customizable 7-step checklists, progress math) and the Calendar & Smart Daily Planner, establishing immediate utility before expanding adjacent studios.
> - **Local Data & Backup Strategy**: High-capacity client-side IndexedDB storage paired with one-click JSON export/import and automated backup reminders, ensuring 100% offline functionality without requiring paid cloud databases.
> - **Platform & Form Factor**: Desktop-first web application engineered for 1440px+ laptop displays, fully PWA-installable on Windows via Chrome and Edge. No native Android or mobile-only compromises.

***

## 1. Overview & Core Concept

- **What It Does**: NEXUS DESK is a multi-mode desktop application that consolidates academic tracking, time management, creative pipelines, and universal notes into a single cohesive interface. It eliminates context switching between fragmented apps (spreadsheets, to-do lists, Notion, timers) by providing tailored workspaces with shared data models and persistent local storage.
- **Target Audience / Persona**: An ambitious Class 12 CBSE student preparing for board exams who actively runs a gaming YouTube channel, publishes across two technology/intellectual blogs, and requires an extensible platform that smoothly transitions into future college and university degree programs.
- **Key Value**:
  - **Zero-Friction Local Workspace**: Fast, reliable, local-first IndexedDB persistence that works completely offline.
  - **Academic Rigor**: Chapter-level granular checklists (Theory, Notes, Examples, NCERT, Extra Practice, Revision, Final Confirmation) with calculated mastery percentages and deadline pacing.
  - **Creator Separation**: Distinct workspaces for YouTube video pipelines and multi-blog publication, keeping editorial calendars and script drafts isolated yet accessible.
  - **Safe AI Grounding**: Server-side Gemini AI assistant with specialized personas (Study, Productivity, Creator) that generate suggestions but never mutate saved schedules without explicit user approval.

***

## 2. User Experience & Visual Design

### Visual Identity & Theme
- **Aesthetic Direction**: Premium Windows productivity workstation inspired by modern dark IDEs and high-performance desktop dashboards. Deep, calm, and distraction-free.
- **Color Palette**:
  - **Dark Canvas (Dominant 60%)**: Deep navy and rich obsidian (`#070B14`, `#0B132B`).
  - **Structural Surfaces (30%)**: Charcoal panels and soft hairline dividers (`#111C38`, `#1C2B4E`, with border `#23355E`).
  - **High-Intent Accents (10%)**: Soft electric cyan (`#06B6D4` / `#38BDF8`) for active selection, focus timers, and progress fills; emerald (`#10B981`) for completed tasks; amber (`#F59E0B`) for approaching deadlines.
  - **Dual-Theme Support**: Instant toggle between Dark Obsidian and Crisp Light Paper (`#F8FAFC` background with `#E2E8F0` surfaces) using CSS variables and Tailwind v4 `@custom-variant dark`.
- **Bilingual Interface**: Seamless header switch between English and Hinglish labels (e.g., "Study Desk" ↔ "Padhai Desk", "Today's Priorities" ↔ "Aaj ke Zaroori Kaam", "Focus Session" ↔ "Focus Kaam").
- **Typography & Scale**:
  - *Display & Headings*: `Plus Jakarta Sans` with tight tracking and balanced headlines (`text-wrap: balance`).
  - *Body Prose & Notes*: `DM Sans` (14px–16px, 1.6 line height) for fatigue-free reading during long study sessions.
  - *Data & Timers*: Monospace tabular numerals (`font-mono tabular-nums`, `JetBrains Mono`) for stopwatches, deadlines, marks, and statistics.
- **Zero-Pill & Metadata Discipline**: Metadata (tags, dates, counts, read times) is displayed as clean unboxed text separated by typographic middots (`·`). Interactive filter pills are strictly reserved for functional tab switchers.

### Desktop Spatial Layout & Top Bar Contract
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ NEXUS DESK  ·  [Study Desk]  [Planner]  [Focus]  [YouTube]  [Blogs]  [Notes]  │ ⚙ Quick │
├──────────────┬─────────────────────────────────────────────────────────────────────────┤
│ SIDEBAR      │ MAIN WORKSPACE VIEWPORT (1440px Responsive Canvas)                      │
│ 260px Fixed  │                                                                         │
│              │ ┌──────────────────────┐ ┌─────────────────────┐ ┌────────────────────┐ │
│ • Dashboard  │ │ Today's Priorities   │ │ Academic Progress   │ │ Timetable & Pacing │ │
│ • Study Desk │ └──────────────────────┘ └─────────────────────┘ └────────────────────┘ │
│ • Planner    │                                                                         │
│ • Focus Mode │ ┌──────────────────────────────────────────────┐ ┌────────────────────┐ │
│ • YT Studio  │ │ Active Subject Cards / Chapter Checklist     │ │ Focus Quick-Timer  │ │
│ • Blog Desk  │ │ (Physics, Chemistry, Math, IP, Painting)     │ │ 25/5 · 50/10       │ │
│ • Notes Vault│ └──────────────────────────────────────────────┘ └────────────────────┘ │
│ • College (V2│                                                                         │
│ ──────────── │                                                                         │
│ [Offline OK] │                                                                         │
└──────────────┴─────────────────────────────────────────────────────────────────────────┘
```

***

## 3. Key Product Decisions & Trade-Offs

| Decision Area | Chosen Approach | Rationale & User Benefit | Rejected Alternative |
| :--- | :--- | :--- | :--- |
| **Local Storage Engine** | **IndexedDB** with structured object stores & version migration | Handles thousands of chapters, subtopics, revision logs, rich text notes, and video scripts without the 5MB quota limit of `localStorage`. | `localStorage` (too small, synchronous, freezes on large notes); Cloud SQL/Firebase (requires user login, billing/credentials, breaks offline). |
| **Backup & Data Safety** | **One-Click JSON Export & Validation** with autosave alerts | Total user ownership of data, zero cloud lock-in, easy backup before Windows reinstallation or device changes. | Proprietary binary format (opaque); auto-syncing to unauthenticated server (privacy risk). |
| **PWA vs Native EXE** | **Progressive Web App (PWA)** for Windows Chrome & Edge | Native Windows desktop feel (window controls, standalone launcher, start menu shortcut, offline cache) without fragile Electron runtime bloat. | Native Electron/Kotlin/Wails (unnecessary compile friction, large installer size, non-portable). |
| **Gemini AI Architecture** | **Server-Side API Proxy** (`/api/gemini/*`) | Keeps API keys secure inside server environment variables (`GEMINI_API_KEY`). Protects user credentials and enables Hinglish prompt shaping. | Client-side SDK calls (leaks API keys in browser network tab, strictly banned by security rules). |
| **AI Action Boundary** | **Suggestion-Approval Pattern** | Gemini can propose schedule adjustments, chapter study time estimates, or script outlines, but NEVER writes to IndexedDB without explicit user click. | Autonomous agent edits (destructive risk to carefully crafted study timetables). |
| **Multi-Profile Architecture** | **Profile-Partitioned Schema** | Academic data is scoped under `profileId` (`cbse_12_2026`, `college_btech_sem1`, etc.), ensuring Class 12 CBSE records remain preserved forever. | Hardcoding Class 12 fields into global root state (makes the app obsolete after graduation). |

***

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT ARCHITECTURE                                    │
│                                                                                          │
│  ┌───────────────────────┐   ┌───────────────────────┐   ┌────────────────────────────┐  │
│  │   Navigation & State  │   │   Workspace Modules   │   │     Local Storage Engine   │  │
│  │  • Active View Router │   │  • Study Desk (CBSE12)│   │  • IndexedDB Database      │  │
│  │  • Profile Manager    │──>│  • Calendar & Planner │<─>│    - subjects, chapters    │  │
│  │  • Theme & Lang State │   │  • Focus Pomodoro     │   │    - tasks, focus_sessions │  │
│  │  • PWA Install Hook   │   │  • YouTube Studio     │   │    - notes, yt_items, blogs│  │
│  └───────────────────────┘   │  • Blog Studio        │   │  • JSON Backup & Restore   │  │
│                              │  • Universal Notes    │   │  • Autosave Dirty Tracker  │  │
│                              └───────────────────────┘   └────────────────────────────┘  │
│                                          │                                               │
└──────────────────────────────────────────┼───────────────────────────────────────────────┘
                                           │ HTTP POST (SSE Stream / JSON)
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                SERVER ARCHITECTURE (Node.js / Express)                   │
│                                                                                          │
│  ┌────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  Endpoint: /api/gemini/assist                                                      │  │
│  │  • Validates API key (process.env.GEMINI_API_KEY)                                  │  │
│  │  • Context Injection: Study Assistant (Hinglish/PCM/IP), Productivity, or Creator │  │
│  │  • Invokes @google/genai SDK (gemini-3.8-flash) with structured parameters         │  │
│  │  • Streams clean Markdown / JSON response back to client                           │  │
│  └────────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### TypeScript Data Models

```typescript
// 1. Academic & Study Desk Models
export interface AcademicProfile {
  id: string; // 'cbse_12_2026' | 'college_univ_v1'
  type: 'cbse_school' | 'college_university';
  name: string; // "Class XII CBSE (2026–27)"
  sessionYear: string; // "2026-2027"
  isDefault: boolean;
  degreeOrGrade: string; // "Class 12" or "B.Tech Computer Science"
  institution?: string;
  createdDate: string;
}

export interface Subject {
  id: string;
  profileId: string;
  code: string; // 'PHYSICS' | 'CHEMISTRY' | 'MATH' | 'IP' | 'PAINTING'
  name: string;
  color: string; // Hex color for calendar and card accents
  targetScore: number; // e.g., 95
  totalChapters: number;
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
  targetDate?: string;
  completedDate?: string;
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
  completedHours: number;
  subtopics: string[];
  notesSnippet?: string;
}

// 2. Calendar & Smart Daily Planner
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
  aiSuggested?: boolean;
}

// 3. Focus Timer Models
export interface FocusSession {
  id: string;
  startTime: string;
  durationMinutes: number;
  type: '25_5' | '50_10' | 'custom';
  subjectId?: string;
  chapterId?: string;
  projectId?: string;
  completed: boolean;
  notes?: string;
}

// 4. Creative Studios: YouTube & Blogs
export interface YouTubeVideoItem {
  id: string;
  channelName: string; // "High-tech gamer"
  title: string;
  format: 'long_form' | 'short';
  stage: 'idea' | 'research' | 'script' | 'recording' | 'editing' | 'thumbnail' | 'scheduled' | 'published';
  targetDate?: string;
  videoUrl?: string;
  researchNotes: string;
  scriptContent: string;
  recordingChecklist: { task: string; done: boolean }[];
  editingChecklist: { task: string; done: boolean }[];
  thumbnailConcept: string;
}

export interface BlogPostItem {
  id: string;
  blogName: string; // "NOVENTRA" | "Arena IQ" | custom
  title: string;
  seoKeywords: string[];
  metaDescription: string;
  stage: 'idea' | 'research' | 'outline' | 'draft' | 'editing' | 'ready' | 'published';
  outline: string;
  draftContent: string;
  editingChecklist: { task: string; done: boolean }[];
  scheduledDate?: string;
  publishedUrl?: string;
}

// 5. Universal Notes & Backups
export interface UniversalNote {
  id: string;
  title: string;
  content: string; // Markdown supported
  tags: string[];
  linkedSubjectId?: string;
  linkedChapterId?: string;
  linkedProjectId?: string;
  updatedAt: string;
}

export interface BackupPayload {
  version: '1.0';
  exportTimestamp: string;
  profiles: AcademicProfile[];
  subjects: Subject[];
  chapters: Chapter[];
  tasks: StudyTask[];
  focusSessions: FocusSession[];
  youtubeItems: YouTubeVideoItem[];
  blogItems: BlogPostItem[];
  notes: UniversalNote[];
}
```

### Preloaded Verified CBSE Class 12 Syllabus (Session 2026–27)

1. **Physics (042)**:
   - Ch 01: Electric Charges and Fields
   - Ch 02: Electrostatic Potential and Capacitance
   - Ch 03: Current Electricity
   - Ch 04: Moving Charges and Magnetism
   - Ch 05: Magnetism and Matter
   - Ch 06: Electromagnetic Induction
   - Ch 07: Alternating Current
   - Ch 08: Electromagnetic Waves
   - Ch 09: Ray Optics and Optical Instruments
   - Ch 10: Wave Optics
   - Ch 11: Dual Nature of Radiation and Matter
   - Ch 12: Atoms
   - Ch 13: Nuclei
   - Ch 14: Semiconductor Electronics: Materials, Devices and Simple Circuits

2. **Chemistry (043)**:
   - Ch 01: Solutions
   - Ch 02: Electrochemistry
   - Ch 03: Chemical Kinetics
   - Ch 04: The d- and f-Block Elements
   - Ch 05: Coordination Compounds
   - Ch 06: Haloalkanes and Haloarenes
   - Ch 07: Alcohols, Phenols and Ethers
   - Ch 08: Aldehydes, Ketones and Carboxylic Acids
   - Ch 09: Amines
   - Ch 10: Biomolecules

3. **Mathematics (041)**:
   - Ch 01: Relations and Functions
   - Ch 02: Inverse Trigonometric Functions
   - Ch 03: Matrices
   - Ch 04: Determinants
   - Ch 05: Continuity and Differentiability
   - Ch 06: Application of Derivatives
   - Ch 07: Integrals
   - Ch 08: Application of Integrals
   - Ch 09: Differential Equations
   - Ch 10: Vector Algebra
   - Ch 11: Three Dimensional Geometry
   - Ch 12: Linear Programming
   - Ch 13: Probability

4. **Informatics Practices (065)**:
   - Unit 01: Data Handling using Pandas and Data Visualization
   - Unit 02: Database Query using SQL (Advanced Functions & Grouping)
   - Unit 03: Introduction to Computer Networks
   - Unit 04: Societal Impacts (Cyber Ethics, IPR, Digital Footprints)

5. **Painting (049)**:
   - Unit 01: The Rajasthani and Pahari Schools of Miniature Painting
   - Unit 02: The Mughal and Deccani Schools of Miniature Painting
   - Unit 03: The Bengal School of Painting and the Modern Trends in Indian Art

***

## 5. Detailed Implementation Phases

### Phase 1: Core Study Desk & Daily Smart Planner *(Immediate Priority)*
- **Navigation Shell**: Fixed desktop sidebar (260px) with icons, branding wordmark, workspace switchers, theme switcher (Dark/Light), and language selector (English / Hinglish).
- **Class 12 CBSE Subject Manager**: Interactive cards for Physics, Chemistry, Math, IP, and Painting showing dynamic completion percentages, total chapters, and priority indicators.
- **Chapter Workspace**: Detailed view with 7-step interactive checklist, target dates, estimated hours, subtopic breakdown, and Mark Chapter Complete with undo.
- **Interactive Calendar & Daily Agenda**:
  - Month view with date-click task creation.
  - Week & Day views with drag/status updates.
  - Filter by Subject, Exam Dates, Deadlines, or Custom Tasks.
- **Local IndexedDB Foundation**: Database initialization with preloaded CBSE data, automatic schema indexing, and dirty state tracking.

### Phase 2: Focus Mode, Universal Notes, Master Dashboard & Backups
- **Focus Station**: 25/5 and 50/10 Pomodoro timers with custom intervals, ambient study sounds (optional/calm chime), subject/chapter linking, and daily/weekly focus charts.
- **Universal Notes Vault**: Fast-search note editor with markdown preview, tag filtering, subject association, and real-time autosave indicators.
- **Master Command Dashboard**: Unified command center aggregating Today's Priorities, Today's Timetable, Quick Actions, Academic Progress metrics, and Active Projects.
- **Data Safety Hub**: One-click JSON backup export, drag-and-drop JSON restore with schema validation, and reset confirmation dialogs.

### Phase 3: Creator Workspaces (YouTube & Blog Studios)
- **YouTube Studio ("High-tech gamer")**:
  - 8-stage Kanban board and list view (Idea → Published).
  - Script editor, recording checklist, editing checklist, thumbnail concepts, and video URL records.
  - Long-form vs. Shorts filtering.
- **Blog Studio ("NOVENTRA" & "Arena IQ")**:
  - Dedicated multi-blog management tab.
  - SEO keyword fields, meta descriptions, structured article outlines, markdown drafting canvas, and content calendar.

### Phase 4: Gemini AI Assistant, Future College Mode & Desktop PWA
- **Server-Side Gemini Proxy**: Express route `/api/gemini/assist` powered by `@google/genai` (`gemini-3.8-flash`).
- **Triple-Context AI Drawer**:
  - *Study Assistant*: Hinglish/English conceptual explanations, PCM/IP problem breakdowns, and quiz generators.
  - *Productivity Assistant*: Daily schedule optimizer and weekly review generator (with approval buttons before applying changes).
  - *Creator Assistant*: YouTube video ideas, SEO titles, and blog outlines.
- **Future College Mode**: Profile switcher to create degree programs (B.Tech, B.Sc, etc.) with semesters, credit hours, modular units, lab practicals, and GPA calculation without losing CBSE 12 archives.
- **PWA Desktop Installation**: Web App Manifest (`manifest.json`), service worker for offline app shell caching, desktop app icon, and in-app install button.

***

## 6. Testing & Resilience Strategy

- **Offline Validation**: All primary modules (Study Desk, Planner, Focus Timer, Notes, Studios) run 100% locally through IndexedDB. Network calls are strictly reserved for the optional Gemini Assistant.
- **Data Integrity & Schema Migration**: JSON import validates version numbers and object shapes before replacing stores. Confirmation modals prevent accidental overwrites.
- **Edge & Chrome Windows Optimization**: Layout tested for 1366x768 and 1920x1080 Windows displays, using horizontal scrollbars only where intentional and maintaining accessible keyboard shortcuts (`Ctrl+S` for quick backup, `Esc` to close modals).
