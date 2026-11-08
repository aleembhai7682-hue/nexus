import { Language } from '../types';

export const t = (key: string, lang: Language): string => {
  const dictionary: Record<string, { english: string; hinglish: string }> = {
    // Navigation
    nav_dashboard: { english: 'Dashboard', hinglish: 'Command Desk' },
    nav_study: { english: 'Study Desk', hinglish: 'Padhai Desk' },
    nav_planner: { english: 'Daily Planner', hinglish: 'Smart Planner' },
    nav_focus: { english: 'Focus Station', hinglish: 'Focus Pomodoro' },
    nav_youtube: { english: 'YouTube Studio', hinglish: 'YouTube Studio' },
    nav_blogs: { english: 'Blog Studio', hinglish: 'Blog Studio' },
    nav_notes: { english: 'Notes Vault', hinglish: 'Notes Vault' },
    nav_college: { english: 'College Mode', hinglish: 'Future College' },
    nav_backup: { english: 'Backup & Data', hinglish: 'Backup & Data' },

    // Top Bar & Global
    active_profile: { english: 'Active Profile', hinglish: 'Current Profile' },
    ask_ai: { english: 'Gemini Assistant', hinglish: 'Gemini AI Madad' },
    export_json: { english: 'Export JSON', hinglish: 'JSON Save Karo' },
    import_json: { english: 'Import JSON', hinglish: 'JSON Load Karo' },
    today: { english: 'Today', hinglish: 'Aaj' },

    // Dashboard
    todays_priorities: { english: "Today's Priorities", hinglish: 'Aaj ke Top Zaroori Kaam' },
    todays_timetable: { english: "Today's Timetable", hinglish: 'Aaj ka Padhai Schedule' },
    academic_progress: { english: 'Academic Progress', hinglish: 'CBSE 12 Padhai Status' },
    focus_summary: { english: 'Focus Minutes Logged', hinglish: 'Focus Time (Aaj)' },
    active_projects: { english: 'Active Creator Pipeline', hinglish: 'Active Video & Blog Pipeline' },
    quick_actions: { english: 'Quick Actions', hinglish: 'Turant Actions' },
    no_urgent_tasks: { english: 'No urgent tasks pending for today.', hinglish: 'Aaj ke sabhi zaroori tasks pure ho gaye!' },
    start_session: { english: 'Start Focus Session', hinglish: 'Focus Timer Shuru Karo' },
    add_task: { english: 'Add Study Task', hinglish: 'Naya Task Jodo' },

    // Study Desk
    cbse_12_banner: { english: 'CBSE Class XII (Session 2026–27)', hinglish: 'CBSE Class 12 (Session 2026–27)' },
    subject_syllabus: { english: 'Verified NCERT & CBSE Syllabus', hinglish: 'Official CBSE & NCERT Syllabus' },
    all_chapters: { english: 'All Chapters', hinglish: 'Sabhi Chapters' },
    not_started: { english: 'Not Started', hinglish: 'Shuru Nahi Hua' },
    in_progress: { english: 'In Progress', hinglish: 'Chal Raha Hai' },
    completed: { english: 'Completed', hinglish: 'Poora Ho Gaya' },
    mark_complete: { english: 'Mark Chapter Complete', hinglish: 'Chapter Poora Mark Karein' },
    undo_complete: { english: 'Undo Completion', hinglish: 'Wapas In-Progress Karein' },
    checklist_title: { english: '7-Step Mastery Checklist', hinglish: '7-Step Padhai Checklist' },
    chk_theory: { english: 'Theory completed', hinglish: 'NCERT Theory read ki' },
    chk_notes: { english: 'Personal notes written', hinglish: 'Short notes bana liye' },
    chk_examples: { english: 'Solved examples practiced', hinglish: 'Solved examples solve kiye' },
    chk_ncert: { english: 'NCERT back exercise solved', hinglish: 'NCERT back questions pure kiye' },
    chk_extra: { english: 'Pyqs & extra questions solved', hinglish: 'PYQs aur extra questions kiye' },
    chk_revision: { english: 'First revision completed', hinglish: 'Revision poora kiya' },
    chk_final: { english: 'Final exam readiness confirmed', hinglish: 'Exam ke liye ready hai' },

    // Planner
    month_view: { english: 'Month View', hinglish: 'Month View' },
    week_view: { english: 'Week View', hinglish: 'Week View' },
    day_view: { english: 'Day View', hinglish: 'Day View' },
    ai_schedule_tip: { english: 'Smart Study Recommendation', hinglish: 'AI Smart Padhai Salah' },
    apply_to_schedule: { english: 'Add to Timetable', hinglish: 'Schedule me Jodo' },

    // Focus
    focus_headline: { english: 'Calm Focus Station', hinglish: 'Shant Deep Work Station' },
    pomodoro_25: { english: '25/5 Pomodoro', hinglish: '25/5 Pomodoro' },
    deep_work_50: { english: '50/10 Deep Work', hinglish: '50/10 Deep Work' },
    custom_timer: { english: 'Custom Timer', hinglish: 'Custom Time' },
    break_time: { english: 'Break Time', hinglish: 'Break ka Samay' },
    focus_time: { english: 'Focus Session', hinglish: 'Focus Time' },

    // YouTube & Blogs
    yt_headline: { english: 'YouTube Production Desk', hinglish: 'YouTube Creator Desk' },
    blog_headline: { english: 'Editorial & Blog Desk', hinglish: 'Blog Lekhan Desk' },
    channel_name: { english: 'High-tech gamer', hinglish: 'High-tech gamer' },
    ideas: { english: 'Ideas', hinglish: 'Ideas' },
    research: { english: 'Research', hinglish: 'Research' },
    script: { english: 'Script', hinglish: 'Script' },
    recording: { english: 'Recording', hinglish: 'Recording' },
    editing: { english: 'Editing', hinglish: 'Editing' },
    thumbnail: { english: 'Thumbnail', hinglish: 'Thumbnail' },
    scheduled: { english: 'Scheduled', hinglish: 'Scheduled' },
    published: { english: 'Published', hinglish: 'Published' },
  };

  if (!dictionary[key]) {
    return key;
  }
  return dictionary[key][lang] || dictionary[key].english;
};
