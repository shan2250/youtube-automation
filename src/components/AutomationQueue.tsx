import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Repeat,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCw,
  Sparkles,
  Terminal,
  ShieldCheck,
  TrendingUp,
  Youtube,
  Plus,
  Trash2
} from 'lucide-react';
import { AutomationScheduleItem, VideoProject, CharacterProfile } from '../types';

interface AutomationQueueProps {
  schedule: AutomationScheduleItem[];
  projects: VideoProject[];
  characters: CharacterProfile[];
  onAddScheduleItem: (item: AutomationScheduleItem) => void;
  onRemoveScheduleItem: (id: string) => void;
  onRunBatchAutomation: () => void;
  isAutomating: boolean;
}

export const AutomationQueue: React.FC<AutomationQueueProps> = ({
  schedule,
  projects,
  characters,
  onAddScheduleItem,
  onRemoveScheduleItem,
  onRunBatchAutomation,
  isAutomating
}) => {
  const [activeFrequency, setActiveFrequency] = useState<'daily' | 'weekly_3x' | 'weekly'>('daily');
  const [selectedCharId, setSelectedCharId] = useState(characters[0]?.id || '');
  const [selectedFormat, setSelectedFormat] = useState<'16:9' | '9:16'>('16:9');
  const [topicInput, setTopicInput] = useState('');
  const [logs, setLogs] = useState<string[]>([
    '[21:40:02] Engine initialized: Multi-Model router active (ChatGPT, DeepSeek, Gemini).',
    '[21:40:05] Character Bible loaded: Dr. Julian Vance (Seed #88412 locked).',
    '[21:41:12] Google Flow & Veo motion prompt compiler synchronized.',
    '[21:42:30] Scheduled video "DeepSeek vs ChatGPT" successfully queued for YouTube release.'
  ]);

  const handleCreateScheduledVideo = () => {
    if (!topicInput.trim()) return;
    const char = characters.find((c) => c.id === selectedCharId) || characters[0];
    const newItem: AutomationScheduleItem = {
      id: `sched-${Date.now()}`,
      projectId: `proj-${Date.now()}`,
      projectTitle: topicInput.trim(),
      format: selectedFormat,
      scheduledTime: activeFrequency === 'daily' ? 'Tomorrow at 18:00 GMT' : 'Saturday at 11:00 GMT',
      frequency: activeFrequency,
      status: 'queued',
      characterName: char.name,
      aiPipeline: {
        scriptModel: 'DeepSeek R1 + ChatGPT-4o',
        visualEngine: 'Google Flow / Imagen 3',
        voiceName: 'Kore (TTS)'
      }
    };

    onAddScheduleItem(newItem);
    setTopicInput('');
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Scheduled automation job registered: "${newItem.projectTitle}" for ${newItem.scheduledTime}.`,
      ...prev
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              YouTube Upload Automation & Cadence Engine
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Maintain daily algorithmic consistency without manual intervention. Automatically trigger scriptwriting,
            consistent character prompt locking, Google Flow frame generation, voice narration, and YouTube upload.
          </p>
        </div>

        <button
          id="run-full-automation-batch-btn"
          onClick={onRunBatchAutomation}
          disabled={isAutomating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/25 transition-all self-start sm:self-auto disabled:opacity-50"
        >
          {isAutomating ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Processing Queue...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Trigger Auto-Run Now</span>
            </>
          )}
        </button>
      </div>

      {/* Analytics & Retention Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Upload Cadence</span>
            <Repeat className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-lg font-bold text-white">Daily Consistency</p>
          <span className="text-[10px] text-emerald-400">7 videos queued this week</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Character Identity Lock</span>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-lg font-bold text-white">100% Consistent</p>
          <span className="text-[10px] text-blue-400">0 face shifts detected</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Estimated Retention</span>
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-lg font-bold text-white">72.4% Avg Watch</p>
          <span className="text-[10px] text-amber-400">+14% vs channel baseline</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>YouTube Data API</span>
            <Youtube className="w-3.5 h-3.5 text-red-500" />
          </div>
          <p className="text-lg font-bold text-white">OAuth Live</p>
          <span className="text-[10px] text-emerald-400">Auto-publish authorized</span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scheduled Queue Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-400" />
                <span>Automated Upload Pipeline Queue</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {schedule.length} video(s) in queue
              </span>
            </div>

            <div className="space-y-3">
              {schedule.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-slate-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-200">
                        {item.format}
                      </span>
                      <h3 className="font-bold text-white text-sm">{item.projectTitle}</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{item.scheduledTime}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>{item.characterName}</span>
                      </span>
                      <span className="text-slate-500">•</span>
                      <span>{item.aiPipeline.scriptModel}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        item.status === 'uploaded'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : item.status === 'rendering'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {item.status}
                    </span>

                    <button
                      onClick={() => onRemoveScheduleItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700/50 transition-colors"
                      title="Remove from queue"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Pipeline Console Logs */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-mono font-bold">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Live Automation Pipeline Console</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Stream: Connected</span>
            </div>

            <div className="bg-slate-900/80 rounded-xl p-3 font-mono text-[11px] text-slate-300 space-y-1.5 max-h-40 overflow-y-auto">
              {logs.map((log, idx) => (
                <p key={idx} className="leading-relaxed">
                  <span className="text-slate-500 mr-2">{log.slice(0, 10)}</span>
                  <span className={log.includes('successfully') ? 'text-emerald-400' : 'text-slate-300'}>
                    {log.slice(10)}
                  </span>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Queue New Automated Video */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 text-xs">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                <Plus className="w-4 h-4 text-red-400" />
                <span>Schedule Next Video</span>
              </h2>
              <p className="text-slate-400 text-[11px]">
                Add an upcoming automated episode to the YouTube publishing calendar
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Topic or Title Idea</label>
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g. 5 AI Inventions Arriving in 2027"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Format</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="16:9">16:9 Long-form</option>
                  <option value="9:16">9:16 YouTube Shorts</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cadence</label>
                <select
                  value={activeFrequency}
                  onChange={(e) => setActiveFrequency(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="daily">Daily Drop</option>
                  <option value="weekly_3x">3x Per Week</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Assigned Consistent Host
              </label>
              <select
                value={selectedCharId}
                onChange={(e) => setSelectedCharId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
              >
                {characters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.role})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCreateScheduledVideo}
              disabled={!topicInput.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all disabled:opacity-50"
            >
              Add to Automation Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
