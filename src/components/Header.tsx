import React from 'react';
import {
  Youtube,
  Sparkles,
  Bot,
  Layers,
  Calendar,
  Users,
  Settings,
  Plus,
  PlayCircle,
  Radio,
  ExternalLink
} from 'lucide-react';
import { ChannelProfile, VideoProject } from '../types';

interface HeaderProps {
  activeTab: 'studio' | 'characters' | 'automation' | 'channel';
  setActiveTab: (tab: 'studio' | 'characters' | 'automation' | 'channel') => void;
  channel: ChannelProfile;
  projects: VideoProject[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onRunBatchAutomation: () => void;
  isAutomating: boolean;
  onOpenImportChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  channel,
  projects,
  activeProjectId,
  onSelectProject,
  onNewProject,
  onRunBatchAutomation,
  isAutomating,
  onOpenImportChat
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding Row */}
        <div className="flex items-center justify-between h-16 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">
                  YouTube Automation Studio
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AI Pipeline Active
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Multi-Model Scripting (ChatGPT • DeepSeek) + Google Flow Visuals & Consistent Characters
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Channel Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-slate-200">{channel.handle}</span>
              <span className="text-slate-400">({(channel.subscribers / 1000).toFixed(1)}k subs)</span>
            </div>

            {/* Run Pipeline Button */}
            <button
              id="run-automation-pipeline-btn"
              onClick={onRunBatchAutomation}
              disabled={isAutomating}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                isAutomating
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'
              }`}
            >
              {isAutomating ? (
                <>
                  <Radio className="w-4 h-4 animate-spin" />
                  Running Automation...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Auto-Run Pipeline
                </>
              )}
            </button>

            {/* Import Chat Ideas Button */}
            {onOpenImportChat && (
              <button
                id="header-import-chat-btn"
                onClick={onOpenImportChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-xs font-semibold text-emerald-400 transition-colors"
              >
                <Bot className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Import Chat / Ideas</span>
                <span className="sm:hidden">Import</span>
              </button>
            )}

            {/* New Project Button */}
            <button
              id="new-video-project-btn"
              onClick={onNewProject}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-red-400" />
              <span>New Video</span>
            </button>
          </div>
        </div>

        {/* Secondary Nav Row */}
        <div className="flex items-center justify-between h-12">
          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1">
            <button
              id="nav-tab-studio"
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'studio'
                  ? 'bg-red-600/10 text-red-400 border border-red-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>Video Studio</span>
            </button>

            <button
              id="nav-tab-characters"
              onClick={() => setActiveTab('characters')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'characters'
                  ? 'bg-red-600/10 text-red-400 border border-red-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Consistent Characters</span>
            </button>

            <button
              id="nav-tab-automation"
              onClick={() => setActiveTab('automation')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'automation'
                  ? 'bg-red-600/10 text-red-400 border border-red-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Upload Queue & Schedule</span>
            </button>

            <button
              id="nav-tab-channel"
              onClick={() => setActiveTab('channel')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'channel'
                  ? 'bg-red-600/10 text-red-400 border border-red-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Channel & AI Engine</span>
            </button>
          </nav>

          {/* Active Project Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Project:</span>
            <select
              id="project-selector-dropdown"
              value={activeProjectId}
              onChange={(e) => onSelectProject(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 max-w-[200px] sm:max-w-[280px] truncate focus:outline-none focus:border-red-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.format})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
