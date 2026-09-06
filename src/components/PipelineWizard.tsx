import React, { useState } from 'react';
import {
  Sparkles,
  Film,
  Users,
  Volume2,
  PlayCircle,
  Upload,
  Bot,
  RotateCw,
  Layers,
  Wand2,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Radio,
  ArrowRight
} from 'lucide-react';
import {
  VideoProject,
  CharacterProfile,
  AIModelProvider,
  ScriptTone,
  VideoFormat,
  ChannelProfile,
  Scene
} from '../types';
import { StoryboardView } from './StoryboardView';
import { VideoPlayerPreview } from './VideoPlayerPreview';
import { YouTubePublisher } from './YouTubePublisher';

interface PipelineWizardProps {
  project: VideoProject;
  characters: CharacterProfile[];
  channel: ChannelProfile;
  onUpdateProject: (updated: Partial<VideoProject>) => void;
  onOpenCharacterModal: () => void;
  onSelectCharacter: (charId: string) => void;
  onOpenImportChatModal?: () => void;
  onOpenGoogleFlowModal?: () => void;
}

export const PipelineWizard: React.FC<PipelineWizardProps> = ({
  project,
  characters,
  channel,
  onUpdateProject,
  onOpenCharacterModal,
  onSelectCharacter,
  onOpenImportChatModal,
  onOpenGoogleFlowModal
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isBatchVisualizing, setIsBatchVisualizing] = useState(false);
  const [topicInput, setTopicInput] = useState(project.topic);
  const [provider, setProvider] = useState<AIModelProvider>(project.scriptProvider || 'deepseek');
  const [format, setFormat] = useState<VideoFormat>(project.format || '16:9');
  const [tone, setTone] = useState<ScriptTone>(project.tone || 'educational');
  const [targetDuration, setTargetDuration] = useState<number>(project.targetDurationMinutes || 2);
  const [selectedVoice, setSelectedVoice] = useState(channel.defaultVoice || 'Kore');
  const [idea, setIdea] = useState(project.ideaBrief || {
    concept: project.topic || '',
    audience: 'YouTube audience',
    objective: 'Educate and retain viewers',
    hook: project.hookStatement || '',
    references: [],
    titleIdeas: []
  });

  const activeCharacter = characters.find((c) => c.id === project.characterId) || characters[0];

  // Script Generator call
  const handleGenerateScript = async () => {
    if (!topicInput.trim()) return;
    setIsGeneratingScript(true);
    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicInput,
          provider,
          format,
          tone,
          durationMinutes: targetDuration,
          character: activeCharacter
        })
      });
      const data = await res.json();
      if (data && data.scenes) {
        onUpdateProject({
          title: data.title || topicInput,
          topic: topicInput,
          scriptProvider: provider,
          format,
          tone,
          targetDurationMinutes: targetDuration,
          hookStatement: data.hookStatement || '',
          fullScript: data.fullScript || '',
          ideaBrief: idea,
          scriptDraft: {
            version: 1,
            status: 'final',
            sections: (data.scenes || []).map((scene: Scene) => ({
              id: `scene-${scene.sceneNumber}`,
              heading: scene.title,
              purpose: scene.visualDescription || scene.title,
              narration: scene.narrationText || '',
              estimatedSeconds: scene.durationSeconds || 0
            })),
            wordCount: (data.fullScript || '').trim().split(/\s+/).filter(Boolean).length,
            estimatedDurationSeconds: (data.scenes || []).reduce((sum: number, scene: Scene) => sum + (scene.durationSeconds || 0), 0),
            notes: 'Generated from the approved Idea Brief.'
          },
          scenes: data.scenes,
          thumbnailPrompt: data.thumbnailPrompt || '',
          thumbnailUrl: data.scenes[0]?.imageUrl,
          seo: data.seo,
          status: 'scripted',
          production: {
            currentStage: 'storyboard',
            completedStages: ['idea', 'research', 'scripting'],
            ideaBrief: idea,
            scriptDraft: {
              version: 1,
              status: 'final',
              sections: (data.scenes || []).map((scene: Scene) => ({ id: `scene-${scene.sceneNumber}`, heading: scene.title, purpose: scene.visualDescription || scene.title, narration: scene.narrationText || '', estimatedSeconds: scene.durationSeconds || 0 })),
              wordCount: (data.fullScript || '').trim().split(/\s+/).filter(Boolean).length,
              estimatedDurationSeconds: (data.scenes || []).reduce((sum: number, scene: Scene) => sum + (scene.durationSeconds || 0), 0)
            },
            audioTracks: [],
            timeline: [],
            renderStatus: 'idle'
          }
        });
        // advance to next stage smoothly
        setActiveStep(3);
      }
    } catch (e) {
      console.error(e);
      alert('Error generating script. Please try again.');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Scene Visual Generator
  const handleGenerateSceneVisual = async (sceneIndex: number) => {
    const scene = project.scenes[sceneIndex];
    if (!scene) return;

    try {
      const res = await fetch('/api/generate-scene-visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: scene.googleFlowPrompt,
          characterTokens: activeCharacter?.consistencyTokens || [],
          artStyle: activeCharacter?.artStyle || '',
          format: project.format
        })
      });
      const data = await res.json();
      const updatedScenes = [...project.scenes];
      updatedScenes[sceneIndex] = {
        ...scene,
        imageUrl: data.imageUrl,
        imageStatus: 'ready'
      };
      onUpdateProject({ scenes: updatedScenes });
    } catch (e) {
      console.error(e);
    }
  };

  // Batch Visual Generator for all scenes
  const handleBatchGenerateVisuals = async () => {
    setIsBatchVisualizing(true);
    try {
      for (let i = 0; i < project.scenes.length; i++) {
        await handleGenerateSceneVisual(i);
      }
    } finally {
      setIsBatchVisualizing(false);
    }
  };

  // Scene Audio Playback (browser speech preview)
  const handlePlaySceneAudio = (text: string, emotion?: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const steps = [
    { id: 1, label: 'Idea', icon: Sparkles, desc: 'Concept, audience & hook' },
    { id: 2, label: 'Scripting', icon: Bot, desc: 'Research, outline & script' },
    { id: 3, label: 'Storyboard', icon: Film, desc: 'Scene-by-scene planning' },
    { id: 4, label: 'Characters', icon: Users, desc: 'Character Bible & consistency' },
    { id: 5, label: 'Visuals', icon: Layers, desc: 'Images, backgrounds & assets' },
    { id: 6, label: 'Animation', icon: Wand2, desc: 'Motion & camera direction' },
    { id: 7, label: 'Combination', icon: Radio, desc: 'Timeline, audio & editing' },
    { id: 8, label: 'Video', icon: PlayCircle, desc: 'Preview & final render' },
    { id: 9, label: 'Publish', icon: Upload, desc: 'SEO & YouTube delivery' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Step Indicator Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = activeStep === s.id;
            const isCompleted = activeStep > s.id;

            return (
              <button
                key={s.id}
                onClick={() => setActiveStep(s.id)}
                className={`p-3 rounded-xl text-left transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-red-600/15 border border-red-500/40 text-white shadow-sm'
                    : isCompleted
                    ? 'bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-950/40 border border-slate-800/60 text-slate-500 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
                  </span>
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-red-400' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  />
                </div>
                <div>
                  <p className="text-xs font-bold truncate">{s.label}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{s.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Idea Studio */}
      {activeStep === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-500" />
              Idea & Concept Studio
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Define the concept before the script is generated. This brief becomes the source of truth for the production pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Video Concept *</label>
              <textarea
                rows={5}
                value={idea.concept}
                onChange={(e) => setIdea({ ...idea, concept: e.target.value })}
                placeholder="What is this video about?"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Target Audience</label>
                <input
                  value={idea.audience}
                  onChange={(e) => setIdea({ ...idea, audience: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Video Objective</label>
                <input
                  value={idea.objective}
                  onChange={(e) => setIdea({ ...idea, objective: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Hook / Core Promise</label>
                <input
                  value={idea.hook}
                  onChange={(e) => setIdea({ ...idea, hook: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              disabled={!idea.concept.trim()}
              onClick={() => {
                onUpdateProject({
                  topic: idea.concept,
                  hookStatement: idea.hook,
                  ideaBrief: idea,
                  status: 'draft'
                });
                setTopicInput(idea.concept);
                setActiveStep(2);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs disabled:opacity-50"
            >
              Continue to Scripting
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: AI Scriptwriter */}
      {activeStep === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-red-500" />
                <span>Multi-Model AI Scripting Studio</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate high-retention YouTube scripts powered by ChatGPT-4o, DeepSeek-R1, or Gemini
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {onOpenImportChatModal && (
                <button
                  type="button"
                  onClick={onOpenImportChatModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Import Chat / Ideas</span>
                </button>
              )}

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 hidden sm:inline">Host:</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{activeCharacter?.name}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Model Selector Cards */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              Select Script Reasoning & Pacing Engine
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setProvider('deepseek')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  provider === 'deepseek'
                    ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/50'
                    : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-white">DeepSeek R1 Engine</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                    Reasoning Hook
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Step-by-step contrarian logic, data-driven hooks, and high-density technical analysis.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setProvider('chatgpt')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  provider === 'chatgpt'
                    ? 'bg-blue-950/40 border-blue-500/60 ring-1 ring-blue-500/50'
                    : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-white">ChatGPT-4o Viral</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400">
                    High Retention
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Storytelling arcs, pattern interrupts every 12s, conversational warmth, and viral CTR titles.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  provider === 'gemini'
                    ? 'bg-purple-950/40 border-purple-500/60 ring-1 ring-purple-500/50'
                    : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-white">Gemini 3.8 Flash</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400">
                    Google Flow Native
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Multimodal visual choreography, direct Imagen 3 scene prompts, and cinematic camera flow.
                </p>
              </button>
            </div>
          </div>

          {/* Topic & Parameters */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Video Topic / Hook Concept *
              </label>
              <textarea
                rows={3}
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g. How DeepSeek R1 reasoning was trained for $6M and broke OpenAI's monopoly..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-red-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Video Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="16:9">16:9 Landscape (YouTube Main)</option>
                  <option value="9:16">9:16 Vertical (YouTube Shorts)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Narrative Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="educational">Educational & Analytical</option>
                  <option value="high-energy">High Energy & Fast Paced</option>
                  <option value="cinematic">Cinematic Documentary</option>
                  <option value="storytelling">Storytelling & Suspense</option>
                  <option value="mystery">Investigation & Mystery</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Target Length: {targetDuration} min
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(parseInt(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer mt-2"
                />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Character tokens from{' '}
              <strong className="text-slate-200">{activeCharacter?.name}</strong> will be injected
              into every scene.
            </span>

            <button
              id="generate-script-btn"
              onClick={handleGenerateScript}
              disabled={isGeneratingScript || !topicInput.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all disabled:opacity-50"
            >
              {isGeneratingScript ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Full Script...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Complete Production Script</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Consistent Character Bible */}
      {activeStep === 4 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-red-500" />
                <span>Consistent Character Anchor Setup</span>
              </h2>
              <p className="text-slate-400 mt-0.5">
                Lock avatar facial geometry, hair, signature outfit, and lighting seeds across all cuts
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onOpenGoogleFlowModal && (
                <button
                  type="button"
                  onClick={onOpenGoogleFlowModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/15 hover:bg-purple-600/25 text-purple-300 border border-purple-500/30 font-semibold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Import from Google Flow</span>
                </button>
              )}

              <button
                onClick={onOpenCharacterModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors"
              >
                <Wand2 className="w-3.5 h-3.5 text-red-400" />
                <span>Edit / New Character</span>
              </button>
            </div>
          </div>

          {/* Character Selector Carousel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {characters.map((char) => {
              const isSelected = char.id === activeCharacter?.id;

              return (
                <div
                  key={char.id}
                  onClick={() => {
                    onSelectCharacter(char.id);
                    onUpdateProject({ characterId: char.id });
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-red-500/10 border-red-500 ring-1 ring-red-500/40 text-white'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={char.avatarUrl}
                      alt={char.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-bold text-white text-sm">{char.name}</h3>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{char.role}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <p className="text-[11px] text-slate-300">
                      <strong>Style:</strong> {char.artStyle.split(',')[0]}
                    </p>
                    <p className="text-[11px] text-slate-300 line-clamp-1">
                      <strong>Outfit:</strong> {char.signatureOutfit}
                    </p>
                  </div>

                  <div className="mt-3 pt-2">
                    <span
                      className={`w-full py-1 rounded text-center block text-[11px] font-bold ${
                        isSelected ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isSelected ? 'Selected for This Video' : 'Select Avatar'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Consistency Anchor Inspection Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Active Consistency Tokens (Injected Into Every Scene Prompt)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeCharacter?.consistencyTokens.map((tok, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300"
                >
                  {tok}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setActiveStep(5)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
            >
              <span>Continue to Visuals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Google Flow Storyboard & Visuals */}
      {activeStep === 3 && (
        <StoryboardView
          scenes={project.scenes}
          character={activeCharacter}
          format={project.format}
          onUpdateScene={(idx, updated) => {
            const copy = [...project.scenes];
            copy[idx] = { ...copy[idx], ...updated };
            onUpdateProject({ scenes: copy });
          }}
          onAddScene={() => {
            const nextNum = project.scenes.length + 1;
            const newScene: Scene = {
              sceneNumber: nextNum,
              title: `Scene ${nextNum}`,
              durationSeconds: 15,
              visualDescription: `${activeCharacter.name} transitions to the next phase of the topic.`,
              cameraAngle: 'Cinematic medium shot',
              characterActions: 'Speaks engagingly to audience',
              googleFlowPrompt: `${activeCharacter.artStyle}, ${activeCharacter.name}, ${activeCharacter.signatureOutfit}, studio lighting, 8k render`,
              veoMotionPrompt: 'Smooth cinematic push-in, 4k 60fps',
              narrationText: 'Continuing with our breakdown...',
              voiceEmotion: 'Confident',
              musicMood: 'Modern tech pulse',
              imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
              imageStatus: 'ready',
              audioStatus: 'ready'
            };
            onUpdateProject({ scenes: [...project.scenes, newScene] });
          }}
          onDeleteScene={(idx) => {
            const copy = project.scenes.filter((_, i) => i !== idx);
            onUpdateProject({ scenes: copy });
          }}
          onGenerateSceneVisual={handleGenerateSceneVisual}
          onPlaySceneAudio={handlePlaySceneAudio}
          onBatchGenerateVisuals={handleBatchGenerateVisuals}
          isBatchGenerating={isBatchVisualizing}
        />
      )}

      {activeStep === 3 && (
        <div className="flex justify-end -mt-5">
          <button onClick={() => setActiveStep(4)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs">
            Continue to Characters <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 5B: Visuals */}
      {activeStep === 5 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white">Visual Asset Studio</h2>
          <p className="text-xs text-slate-400 mt-1">Generate and review visual assets for all storyboard scenes.</p>
          <button onClick={handleBatchGenerateVisuals} disabled={isBatchVisualizing || !project.scenes.length} className="mt-5 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs disabled:opacity-50">
            {isBatchVisualizing ? 'Generating Visuals…' : 'Generate All Scene Visuals'}
          </button>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            {project.scenes.map(scene => (
              <div key={scene.sceneNumber} className="rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                {scene.imageUrl ? <img src={scene.imageUrl} alt={scene.title} className="w-full aspect-video object-cover" /> : <div className="aspect-video flex items-center justify-center text-slate-500">No visual</div>}
                <div className="p-2 text-[10px] text-slate-300">Scene {scene.sceneNumber}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-5"><button onClick={() => setActiveStep(6)} className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs">Continue to Animation <ArrowRight className="w-4 h-4 inline ml-1" /></button></div>
        </div>
      )}

      {/* STEP 6: Animation */}
      {activeStep === 6 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 text-xs">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2"><Wand2 className="w-5 h-5 text-red-500" />Animation Studio</h2>
            <p className="text-slate-400 mt-1">Review motion prompts, camera movement and animation direction for every storyboard scene.</p>
          </div>
          <div className="space-y-3">
            {project.scenes.map((scene) => (
              <div key={scene.sceneNumber} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="font-bold text-white">Scene {scene.sceneNumber}: {scene.title}</span>
                  <span className="text-[10px] text-slate-400">{scene.durationSeconds}s</span>
                </div>
                <textarea
                  rows={2}
                  value={scene.veoMotionPrompt}
                  onChange={(e) => {
                    const scenes = [...project.scenes];
                    const idx = scenes.findIndex(s => s.sceneNumber === scene.sceneNumber);
                    if (idx >= 0) scenes[idx] = { ...scenes[idx], veoMotionPrompt: e.target.value };
                    onUpdateProject({ scenes });
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button onClick={() => setActiveStep(7)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs">Continue to Combination <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* STEP 7: Combination / Editing */}
      {activeStep === 7 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 text-xs">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2"><Radio className="w-5 h-5 text-red-500" />Combination & Timeline</h2>
            <p className="text-slate-400 mt-1">Assemble scenes, narration, music and effects into one production timeline.</p>
          </div>
          <div className="space-y-2">
            {project.scenes.map((scene, index) => (
              <div key={scene.sceneNumber} className="grid grid-cols-[80px_1fr_100px] gap-3 items-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                <span className="font-bold text-slate-300">Scene {scene.sceneNumber}</span>
                <div className="h-8 rounded bg-slate-700/60 flex items-center px-3 text-slate-300 truncate">{scene.title} · {scene.narrationText}</div>
                <span className="text-right text-slate-400">{scene.durationSeconds}s</span>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button onClick={() => setActiveStep(8)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs">Open Video Preview <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* AUDIO: Voice Actor (part of Combination) */}
      {activeStep === 7 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 text-xs">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-red-500" />
              <span>Audio Narration & Voice Actor Studio</span>
            </h2>
            <p className="text-slate-400 mt-0.5">
              Select high-fidelity synthesized voices with emotional resonance and synchronized audio timestamps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Kore', type: 'Warm & Analytical', desc: 'Ideal for tech breakdowns & science', tone: 'warm' },
              { name: 'Fenrir', type: 'Authoritative & Deep', desc: 'Cinematic documentary narrator', tone: 'deep' },
              { name: 'Puck', type: 'Energetic & Punchy', desc: 'Fast-talking viral YouTube Shorts', tone: 'energetic' },
              { name: 'Zephyr', type: 'Commercial & Smooth', desc: 'Polished studio presenter', tone: 'smooth' }
            ].map((voice) => {
              const isSelected = selectedVoice === voice.name;

              return (
                <div
                  key={voice.name}
                  onClick={() => setSelectedVoice(voice.name)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-red-500/10 border-red-500 ring-1 ring-red-500/40 text-white'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-white">{voice.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                        {voice.tone}
                      </span>
                    </div>
                    <p className="font-medium text-slate-300 text-[11px] mb-1">{voice.type}</p>
                    <p className="text-[11px] text-slate-400">{voice.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaySceneAudio(`Hello! I am ${voice.name}, your automated YouTube narrator for this episode.`);
                    }}
                    className="mt-4 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-[11px] flex items-center justify-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Sample Voice</span>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-white text-sm">Full Script Audio Lines</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {project.scenes.map((sc, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-bold text-slate-300 mr-2">Scene {sc.sceneNumber}:</span>
                    <span className="text-slate-200">"{sc.narrationText}"</span>
                  </div>
                  <button
                    onClick={() => handlePlaySceneAudio(sc.narrationText, sc.voiceEmotion)}
                    className="shrink-0 p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200"
                  >
                    <PlayCircle className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveStep(7)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
            >
              <span>Proceed to Assembly Player</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: Video */}
      {activeStep === 8 && (
        <div className="space-y-6">
          <VideoPlayerPreview
            scenes={project.scenes}
            format={project.format}
            character={activeCharacter}
            activeVoice={selectedVoice}
          />
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Final video package</p>
              <p className="text-xs text-slate-400 mt-1">Preview the assembled production before sending it to YouTube.</p>
            </div>
            <button onClick={() => setActiveStep(9)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs">Continue to Publish <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* STEP 6: YouTube Publish */}
      {activeStep === 9 && (
        <YouTubePublisher
          project={project}
          channel={channel}
          onUpdateProject={onUpdateProject}
          onPublishSuccess={() => {}}
        />
      )}
    </div>
  );
};
