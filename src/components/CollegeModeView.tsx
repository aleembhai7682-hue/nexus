import React, { useState } from 'react';
import {
  Building2,
  Plus,
  GraduationCap,
  BookOpen,
  Award,
  Layers,
  CheckCircle2,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { AcademicProfile, CollegeModule, Language } from '../types';

interface CollegeModeViewProps {
  profiles: AcademicProfile[];
  activeProfile: AcademicProfile;
  onSelectProfile: (profile: AcademicProfile) => void;
  onCreateProfile: (profile: Omit<AcademicProfile, 'id' | 'createdDate'>) => void;
  lang: Language;
}

export const CollegeModeView: React.FC<CollegeModeViewProps> = ({
  profiles,
  activeProfile,
  onSelectProfile,
  onCreateProfile,
}) => {
  const [showAddProfileModal, setShowAddProfileModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newDegree, setNewDegree] = useState('');
  const [newSessionYear, setNewSessionYear] = useState('2027–2031');
  const [newInstitution, setNewInstitution] = useState('');

  // Sample or active modules for college mode
  const [collegeModules, setCollegeModules] = useState<CollegeModule[]>([
    {
      id: 'cm_1',
      profileId: 'college_sample',
      semester: 'Semester 1',
      courseCode: 'CS101',
      courseName: 'Data Structures and Algorithms',
      credits: 4,
      units: [
        { name: 'Unit 1: Asymptotic Analysis & Arrays', completed: true },
        { name: 'Unit 2: Stacks, Queues & Linked Lists', completed: true },
        { name: 'Unit 3: Trees and Graphs', completed: false },
        { name: 'Unit 4: Dynamic Programming & Greedy', completed: false },
      ],
      practicals: [
        { title: 'Lab 1: Memory management & pointer arithmetic in C++', submitted: true },
        { title: 'Lab 2: Binary Search Tree benchmark comparison', submitted: false },
      ],
      targetGrade: 'A+',
    },
    {
      id: 'cm_2',
      profileId: 'college_sample',
      semester: 'Semester 1',
      courseCode: 'CS102',
      courseName: 'Digital Logic & Computer Organization',
      credits: 4,
      units: [
        { name: 'Unit 1: Boolean Algebra & Logic Gates', completed: true },
        { name: 'Unit 2: Combinational & Sequential Circuits', completed: false },
        { name: 'Unit 3: Processor Architecture & Pipelining', completed: false },
      ],
      practicals: [
        { title: 'Verilog Simulator: 4-bit ALU implementation', submitted: true },
      ],
      targetGrade: 'A',
    },
  ]);

  const handleCreateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim() || !newDegree.trim()) return;

    onCreateProfile({
      name: newProfileName.trim(),
      type: 'college_university',
      degreeOrGrade: newDegree.trim(),
      sessionYear: newSessionYear.trim(),
      institution: newInstitution.trim() || undefined,
      isDefault: false,
    });

    setShowAddProfileModal(false);
    setNewProfileName('');
    setNewDegree('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-900/95 via-[#161226] to-slate-900/95 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <span>LONG-TERM ACADEMIC ARCHITECTURE</span>
            <span>·</span>
            <span>MULTI-PROFILE SYSTEM</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Future College & University Mode
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Preserves your Class 12 CBSE achievements while providing semester credits, lab practicals, and university courses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddProfileModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors shadow-sm shadow-purple-950/40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Future Profile</span>
          </button>
        </div>
      </div>

      {/* Profile Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((p) => {
          const isActive = activeProfile.id === p.id;

          return (
            <div
              key={p.id}
              onClick={() => onSelectProfile(p)}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                isActive
                  ? 'bg-slate-900 border-purple-500 shadow-md shadow-purple-950/20'
                  : 'bg-[#0B1222] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-[11px] text-purple-400">
                  {p.type === 'cbse_school' ? 'CBSE Schooling' : 'Higher Education'}
                </span>
                {isActive && (
                  <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60">
                    Active
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-100 truncate">{p.name}</h4>
              <p className="text-xs text-slate-300 mt-0.5">{p.degreeOrGrade}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 font-mono">
                <span>Session: {p.sessionYear}</span>
                {p.institution && <span className="truncate max-w-[120px]">{p.institution}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* College Mode Curriculum & Semesters Architecture Preview */}
      <div className="rounded-xl bg-[#0B1222] border border-slate-800/80 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[11px] font-mono text-purple-400 uppercase">
              Degree Framework
            </span>
            <h3 className="text-sm font-semibold text-slate-100">
              Semester Courses, Modules & Practical Lab Records
            </h3>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Semester 1 · 8 Total Credits
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collegeModules.map((mod) => (
            <div
              key={mod.id}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-purple-400 font-semibold">
                  {mod.courseCode} · {mod.credits} Credits
                </span>
                <span className="font-mono text-cyan-300 px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-800/50">
                  Target Grade: {mod.targetGrade}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-100">{mod.courseName}</h4>

              {/* Units */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  Units & Theory Modules:
                </span>
                {mod.units.map((u, i) => (
                  <div
                    key={i}
                    className="p-1.5 rounded bg-slate-950/60 text-[11px] text-slate-300 flex items-center justify-between"
                  >
                    <span>{u.name}</span>
                    <span className={u.completed ? 'text-emerald-400 text-[10px] font-mono' : 'text-slate-500 text-[10px] font-mono'}>
                      {u.completed ? 'Done' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Practicals / Lab work */}
              <div className="space-y-1 pt-1 border-t border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  Practicals & Lab Submissions:
                </span>
                {mod.practicals.map((p, i) => (
                  <div
                    key={i}
                    className="p-1.5 rounded bg-slate-950/60 text-[11px] text-slate-300 flex items-center justify-between"
                  >
                    <span className="truncate max-w-[240px]">{p.title}</span>
                    <span className={p.submitted ? 'text-emerald-400 text-[10px] font-mono' : 'text-amber-400 text-[10px] font-mono'}>
                      {p.submitted ? 'Submitted' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add Future Profile */}
      {showAddProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0B1222] border border-slate-800 rounded-xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-semibold text-slate-100">
              Create Higher Education / College Academic Profile
            </h3>
            <form onSubmit={handleCreateProfileSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Profile Label
                </label>
                <input
                  type="text"
                  required
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Degree / Program Name
                </label>
                <input
                  type="text"
                  required
                  value={newDegree}
                  onChange={(e) => setNewDegree(e.target.value)}
                  placeholder="e.g. Bachelor of Technology (CSE) / B.Sc Physics"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Academic Session
                  </label>
                  <input
                    type="text"
                    value={newSessionYear}
                    onChange={(e) => setNewSessionYear(e.target.value)}
                    placeholder="2027–2031"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Institution (Optional)
                  </label>
                  <input
                    type="text"
                    value={newInstitution}
                    onChange={(e) => setNewInstitution(e.target.value)}
                    placeholder="University Name"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProfileModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
