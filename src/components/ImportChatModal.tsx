import React, { useState } from 'react';
import {
  X,
  FileText,
  Sparkles,
  Bot,
  RotateCw,
  Copy,
  ArrowRight,
  Lightbulb,
  Check
} from 'lucide-react';
import { CharacterProfile, VideoFormat } from '../types';

interface ImportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (projectData: any) => void;
  activeCharacter?: CharacterProfile;
}

export const ImportChatModal: React.FC<ImportChatModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  activeCharacter
}) => {
  const [source, setSource] = useState<'deepseek' | 'chatgpt'>('deepseek');
  const [rawText, setRawText] = useState('');
  const [format, setFormat] = useState<VideoFormat>('16:9');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'paste' | 'templates'>('paste');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const exampleIdeas = [
    {
      title: 'DeepSeek R1 vs OpenAI Architecture Breakdown',
      source: 'deepseek' as const,
      preview: `User: Can you give me a YouTube script idea about DeepSeek R1?
DeepSeek: Here is a high-retention script:
Hook: "In December 2024, a team trained an AI model for just $6 Million that rivaled OpenAI's $100 Million o1 model. Here is the architectural trick they used..."
Scene 1: Reinforcement Learning without supervised cold start.
Scene 2: Group Relative Policy Optimization (GRPO) replacing critics.
Scene 3: Why open source weights fundamentally changed the AI market.`
    },
    {
      title: 'ChatGPT Viral Tech Hook: The Truth About Superintelligent Agents',
      source: 'chatgpt' as const,
      preview: `User: Write a 60-second viral YouTube Shorts script about autonomous AI agents.
ChatGPT:
[0-3s Hook]: Stop building websites. Autonomous AI agents just took over software workflows.
[3-15s]: Meet the multi-agent system where one writes, one tests, and one deploys code in real-time.
[15-40s]: We tested this on a real client project. Here were the shocking results.
[40-60s CTA]: The future is human orchestrators, not coders. Subscribe for daily breakdowns.`
    },
    {
      title: 'Google Flow & Veo: The Complete Generative Cinema Revolution',
      source: 'deepseek' as const,
      preview: `User: Outline our next video on Google Flow and Veo video generation.
DeepSeek:
Concept: The death of traditional green screen VFX.
Key Points:
- Scene-by-scene character consistency using locked seed tokens.
- Google Flow prompt chaining with 4K 60fps Veo camera motions.
- How solo creators are generating Hollywood-grade documentary sequences for under $10.`
    }
  ];

  const handleImport = async () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/import-chat-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          source,
          format,
          character: activeCharacter
        })
      });

      const data = await res.json();
      if (data.error) {
        setErrorMessage(data.error);
      } else {
        onImportSuccess({
          ...data,
          format,
          scriptProvider: source
        });
        onClose();
      }
    } catch (e: any) {
      setErrorMessage(`Error importing chat: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const loadTemplate = (template: typeof exampleIdeas[0]) => {
    setErrorMessage(null);
    setSource(template.source);
    setRawText(template.preview);
    setActiveTab('paste');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-5 text-xs text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Import Content Idea from ChatGPT or DeepSeek
              </h2>
              <p className="text-[11px] text-slate-400">
                Paste your existing chat transcript or brainstormed draft to convert into a full video
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inline Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-white font-bold ml-3"
            >
              ×
            </button>
          </div>
        )}

        {/* Source & Mode Tabs */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSource('deepseek')}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors flex items-center gap-1.5 ${
                source === 'deepseek'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>DeepSeek Chat</span>
            </button>

            <button
              onClick={() => setSource('chatgpt')}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors flex items-center gap-1.5 ${
                source === 'chatgpt'
                  ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>ChatGPT Conversation</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-red-500"
            >
              <option value="16:9">16:9 Long-Form</option>
              <option value="9:16">9:16 Shorts</option>
            </select>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-[11px]">
          <button
            onClick={() => setActiveTab('paste')}
            className={`pb-1 px-1 font-semibold ${
              activeTab === 'paste' ? 'text-white border-b-2 border-red-500' : 'text-slate-400'
            }`}
          >
            Direct Paste
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-1 px-1 font-semibold ${
              activeTab === 'templates' ? 'text-white border-b-2 border-red-500' : 'text-slate-400'
            }`}
          >
            Example Ideas & Formats ({exampleIdeas.length})
          </button>
        </div>

        {activeTab === 'paste' ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300">
                Paste Your Chat Transcript / Script Notes:
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {rawText.length} characters
              </span>
            </div>
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste your conversation or notes from DeepSeek or ChatGPT here... e.g.:&#10;User: Give me 5 viral video ideas about AI Agents&#10;DeepSeek: Here is the script outline for video 1..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-red-500"
            />
          </div>
        ) : (
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {exampleIdeas.map((ex, idx) => (
              <div
                key={idx}
                onClick={() => loadTemplate(ex)}
                className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-slate-500 cursor-pointer transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs">{ex.title}</h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      ex.source === 'deepseek'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {ex.source}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono line-clamp-2">{ex.preview}</p>
                <span className="text-[10px] text-red-400 font-semibold block">Click to load into parser →</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <p className="text-[11px] text-slate-400">
            Will automatically extract scenes, voiceover cues, and Google Flow prompts.
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              id="confirm-import-chat-btn"
              type="button"
              onClick={handleImport}
              disabled={isProcessing || !rawText.trim()}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Parsing into Video Scenes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Convert to Production Video</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
