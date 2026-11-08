import React, { useState, useEffect, useCallback } from 'react';
import {
  WorkspaceView,
  Language,
  Theme,
  AcademicProfile,
  Subject,
  Chapter,
  PracticalItem,
  StudyTask,
  FocusSession,
  YouTubeItem,
  BlogPostItem,
  UniversalNote,
} from './types';
import { NexusDB, STORES } from './db/indexedDb';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { StudyDeskView } from './components/StudyDeskView';
import { PlannerView } from './components/PlannerView';
import { FocusView } from './components/FocusView';
import { YouTubeStudioView } from './components/YouTubeStudioView';
import { BlogStudioView } from './components/BlogStudioView';
import { NotesVaultView } from './components/NotesVaultView';
import { CollegeModeView } from './components/CollegeModeView';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { BackupModal } from './components/BackupModal';
import { DEFAULT_PROFILE } from './data/defaultSyllabus';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<WorkspaceView>('dashboard');
  const [lang, setLang] = useState<Language>('english');
  const [theme, setTheme] = useState<Theme>('dark');
  const [searchQuery, setSearchQuery] = useState('');

  // Core Data Stores
  const [profiles, setProfiles] = useState<AcademicProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<AcademicProfile>(DEFAULT_PROFILE);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [practicals, setPracticals] = useState<PracticalItem[]>([]);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [youtubeItems, setYoutubeItems] = useState<YouTubeItem[]>([]);
  const [blogItems, setBlogItems] = useState<BlogPostItem[]>([]);
  const [notes, setNotes] = useState<UniversalNote[]>([]);

  // Modals & Drawers
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiContext, setAiContext] = useState<'study' | 'productivity' | 'creator'>('study');
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [quickTaskModalOpen, setQuickTaskModalOpen] = useState(false);

  // Load all data from IndexedDB
  const reloadAllData = useCallback(async () => {
    try {
      const [
        loadedProfiles,
        loadedSubjects,
        loadedChapters,
        loadedPracticals,
        loadedTasks,
        loadedFocus,
        loadedYT,
        loadedBlogs,
        loadedNotes,
      ] = await Promise.all([
        NexusDB.getAll<AcademicProfile>(STORES.PROFILES),
        NexusDB.getAll<Subject>(STORES.SUBJECTS),
        NexusDB.getAll<Chapter>(STORES.CHAPTERS),
        NexusDB.getAll<PracticalItem>(STORES.PRACTICALS),
        NexusDB.getAll<StudyTask>(STORES.TASKS),
        NexusDB.getAll<FocusSession>(STORES.FOCUS),
        NexusDB.getAll<YouTubeItem>(STORES.YOUTUBE),
        NexusDB.getAll<BlogPostItem>(STORES.BLOGS),
        NexusDB.getAll<UniversalNote>(STORES.NOTES),
      ]);

      setProfiles(loadedProfiles);
      const defaultProf = loadedProfiles.find((p) => p.isDefault) || loadedProfiles[0] || DEFAULT_PROFILE;
      setActiveProfile(defaultProf);
      setSubjects(loadedSubjects);
      setChapters(loadedChapters);
      setPracticals(loadedPracticals);
      setTasks(loadedTasks);
      setFocusSessions(loadedFocus);
      setYoutubeItems(loadedYT);
      setBlogItems(loadedBlogs);
      setNotes(loadedNotes);
    } catch (err) {
      console.error('Failed to load IndexedDB data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadAllData();

    // Register service worker for offline app shell
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Service worker registration failed:', err);
      });
    }
  }, [reloadAllData]);

  // Handle Theme switching
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLang = () => {
    setLang((prev) => (prev === 'english' ? 'hinglish' : 'english'));
  };

  // Chapter Handlers
  const handleUpdateChapter = async (chapter: Chapter) => {
    setChapters((prev) => prev.map((c) => (c.id === chapter.id ? chapter : c)));
    await NexusDB.put(STORES.CHAPTERS, chapter);
  };

  const handleAddChapter = async (subjectId: string, title: string, estimatedHours: number) => {
    const subChapters = chapters.filter((c) => c.subjectId === subjectId);
    const newChap: Chapter = {
      id: `ch_${Date.now()}`,
      subjectId,
      chapterNumber: subChapters.length + 1,
      title,
      status: 'not_started',
      checklist: {
        theoryCompleted: false,
        notesCompleted: false,
        examplesPracticed: false,
        ncertQuestionsCompleted: false,
        extraQuestionsPracticed: false,
        revisionCompleted: false,
        finalConfirmation: false,
      },
      priority: 'medium',
      estimatedHours,
      completedHours: 0,
      subtopics: [],
    };

    setChapters((prev) => [...prev, newChap]);
    await NexusDB.put(STORES.CHAPTERS, newChap);
  };

  // Practical Handlers
  const handleUpdatePractical = async (practical: PracticalItem) => {
    setPracticals((prev) => prev.map((p) => (p.id === practical.id ? practical : p)));
    await NexusDB.put(STORES.PRACTICALS, practical);
  };

  // Task Handlers
  const handleAddTask = async (taskData: Omit<StudyTask, 'id'>) => {
    const newTask: StudyTask = {
      ...taskData,
      id: `task_${Date.now()}`,
    };
    setTasks((prev) => [...prev, newTask]);
    await NexusDB.put(STORES.TASKS, newTask);
  };

  const handleUpdateTask = async (task: StudyTask) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    await NexusDB.put(STORES.TASKS, task);
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    await NexusDB.delete(STORES.TASKS, taskId);
  };

  const handleToggleTaskComplete = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const updated = { ...task, completed: !task.completed };
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    await NexusDB.put(STORES.TASKS, updated);
  };

  // Focus Handlers
  const handleCompleteFocusSession = async (sessionData: Omit<FocusSession, 'id'>) => {
    const newSession: FocusSession = {
      ...sessionData,
      id: `focus_${Date.now()}`,
    };
    setFocusSessions((prev) => [newSession, ...prev]);
    await NexusDB.put(STORES.FOCUS, newSession);

    // If chapter linked, increment chapter completed study hours
    if (sessionData.chapterId) {
      const chapter = chapters.find((c) => c.id === sessionData.chapterId);
      if (chapter) {
        const addedHours = Math.round(sessionData.durationMinutes / 60);
        const updatedChapter: Chapter = {
          ...chapter,
          completedHours: (chapter.completedHours || 0) + (addedHours || 1),
          status: chapter.status === 'not_started' ? 'in_progress' : chapter.status,
        };
        handleUpdateChapter(updatedChapter);
      }
    }
  };

  const handleStartFocusForChapter = (subjectId: string, chapterId: string) => {
    setCurrentView('focus');
  };

  // Creator Handlers
  const handleSaveYouTubeItem = async (item: YouTubeItem) => {
    setYoutubeItems((prev) => {
      const exists = prev.some((y) => y.id === item.id);
      return exists ? prev.map((y) => (y.id === item.id ? item : y)) : [...prev, item];
    });
    await NexusDB.put(STORES.YOUTUBE, item);
  };

  const handleDeleteYouTubeItem = async (id: string) => {
    setYoutubeItems((prev) => prev.filter((y) => y.id !== id));
    await NexusDB.delete(STORES.YOUTUBE, id);
  };

  const handleSaveBlogItem = async (item: BlogPostItem) => {
    setBlogItems((prev) => {
      const exists = prev.some((b) => b.id === item.id);
      return exists ? prev.map((b) => (b.id === item.id ? item : b)) : [...prev, item];
    });
    await NexusDB.put(STORES.BLOGS, item);
  };

  const handleDeleteBlogItem = async (id: string) => {
    setBlogItems((prev) => prev.filter((b) => b.id !== id));
    await NexusDB.delete(STORES.BLOGS, id);
  };

  // Notes Handlers
  const handleSaveNote = async (note: UniversalNote) => {
    setNotes((prev) => {
      const exists = prev.some((n) => n.id === note.id);
      return exists ? prev.map((n) => (n.id === note.id ? note : n)) : [...prev, note];
    });
    await NexusDB.put(STORES.NOTES, note);
  };

  const handleDeleteNote = async (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    await NexusDB.delete(STORES.NOTES, id);
  };

  // Academic Profile Handlers
  const handleSelectProfile = (profile: AcademicProfile) => {
    setActiveProfile(profile);
  };

  const handleCreateProfile = async (
    profileData: Omit<AcademicProfile, 'id' | 'createdDate'>
  ) => {
    const newProfile: AcademicProfile = {
      ...profileData,
      id: `prof_${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setProfiles((prev) => [...prev, newProfile]);
    setActiveProfile(newProfile);
    await NexusDB.put(STORES.PROFILES, newProfile);
  };

  // AI Assistant Triggers
  const handleOpenAIForChapter = (subjectName: string, chapterTitle: string) => {
    setAiContext('study');
    setAiInitialPrompt(`Explain key concepts, NCERT core formulas, and high-weightage board exam derivations for ${subjectName} - Chapter: "${chapterTitle}".`);
    setAiDrawerOpen(true);
  };

  const handleOpenAIForCreator = (creatorDomain: string, title: string) => {
    setAiContext('creator');
    setAiInitialPrompt(`Provide high-CTR title variations, hook script, and thumbnail visual concept for: "${title}" (${creatorDomain}).`);
    setAiDrawerOpen(true);
  };

  // Counts for Sidebar badges
  const inProgressChaptersCount = chapters.filter((c) => c.status === 'in_progress').length;
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingTasksCount = tasks.filter((t) => t.date === todayStr && !t.completed).length;

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#070B14] text-slate-100 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-cyan-500/20 animate-pulse">
          <span className="font-mono font-bold text-xl text-white">N</span>
        </div>
        <div className="text-center">
          <h2 className="text-base font-bold font-mono text-slate-100 tracking-wider">
            NEXUS DESK
          </h2>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 justify-center">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            Loading local IndexedDB workspaces...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-screen flex overflow-hidden ${theme === 'dark' ? 'bg-[#070B14] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* 260px Fixed Desktop Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={(view) => {
          if (view === 'backup') {
            setBackupModalOpen(true);
          } else {
            setCurrentView(view);
          }
        }}
        activeProfile={activeProfile}
        lang={lang}
        onOpenAI={() => {
          setAiContext('study');
          setAiDrawerOpen(true);
        }}
        inProgressChaptersCount={inProgressChaptersCount}
        pendingTasksCount={pendingTasksCount}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Bar (3-Zone Contract) */}
        <TopBar
          currentView={currentView}
          lang={lang}
          onToggleLang={toggleLang}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenAI={() => {
            setAiContext('study');
            setAiDrawerOpen(true);
          }}
          onOpenBackup={() => setBackupModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Viewport Canvas (Scrollable) */}
        <main className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              subjects={subjects}
              chapters={chapters}
              practicals={practicals}
              tasks={tasks}
              focusSessions={focusSessions}
              youtubeItems={youtubeItems}
              blogItems={blogItems}
              onNavigate={setCurrentView}
              onToggleTaskComplete={handleToggleTaskComplete}
              onOpenQuickTaskModal={() => {
                setCurrentView('planner');
              }}
              lang={lang}
            />
          )}

          {currentView === 'study' && (
            <StudyDeskView
              subjects={subjects}
              chapters={chapters}
              practicals={practicals}
              onUpdateChapter={handleUpdateChapter}
              onAddChapter={handleAddChapter}
              onUpdatePractical={handleUpdatePractical}
              onStartFocusForChapter={handleStartFocusForChapter}
              onAskAIForChapter={handleOpenAIForChapter}
              lang={lang}
            />
          )}

          {currentView === 'planner' && (
            <PlannerView
              tasks={tasks}
              subjects={subjects}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onToggleComplete={handleToggleTaskComplete}
              lang={lang}
            />
          )}

          {currentView === 'focus' && (
            <FocusView
              subjects={subjects}
              chapters={chapters}
              focusSessions={focusSessions}
              onCompleteSession={handleCompleteFocusSession}
              lang={lang}
            />
          )}

          {currentView === 'youtube' && (
            <YouTubeStudioView
              items={youtubeItems}
              onSaveItem={handleSaveYouTubeItem}
              onDeleteItem={handleDeleteYouTubeItem}
              onAskCreatorAI={(channel, title) => handleOpenAIForCreator(channel, title)}
              lang={lang}
            />
          )}

          {currentView === 'blogs' && (
            <BlogStudioView
              items={blogItems}
              onSaveItem={handleSaveBlogItem}
              onDeleteItem={handleDeleteBlogItem}
              onAskCreatorAI={(blog, title) => handleOpenAIForCreator(blog, title)}
              lang={lang}
            />
          )}

          {currentView === 'notes' && (
            <NotesVaultView
              notes={notes}
              subjects={subjects}
              onSaveNote={handleSaveNote}
              onDeleteNote={handleDeleteNote}
              lang={lang}
            />
          )}

          {currentView === 'college' && (
            <CollegeModeView
              profiles={profiles}
              activeProfile={activeProfile}
              onSelectProfile={handleSelectProfile}
              onCreateProfile={handleCreateProfile}
              lang={lang}
            />
          )}
        </main>
      </div>

      {/* Slide-over Gemini AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        lang={lang}
        initialContext={aiContext}
        initialPrompt={aiInitialPrompt}
        onAddTaskToPlanner={handleAddTask}
      />

      {/* JSON Backup & Data Management Modal */}
      <BackupModal
        isOpen={backupModalOpen}
        onClose={() => setBackupModalOpen(false)}
        onDataReloaded={reloadAllData}
        lang={lang}
      />
    </div>
  );
}
