import React, { useState } from 'react';
import {
  Film,
  Camera,
  Wand2,
  Volume2,
  Play,
  RotateCw,
  Sparkles,
  ShieldCheck,
  Music,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { Scene, CharacterProfile, VideoFormat } from '../types';

interface StoryboardViewProps {
  scenes: Scene[];
  character?: CharacterProfile;
  format: VideoFormat;
  onUpdateScene: (index: number, updated: Partial<Scene>) => void;
  onAddScene: () => void;
  onDeleteScene: (index: number) => void;
  onGenerateSceneVisual: (index: number) => Promise<void>;
  onPlaySceneAudio: (text: string, emotion?: string) => void;
  onBatchGenerateVisuals: () => void;
  isBatchGenerating: boolean;
}

export const StoryboardView: React.FC<StoryboardViewProps> = ({
  scenes,
  character,
  format,
  onUpdateScene,
  onAddScene,
  onDeleteScene,
  onGenerateSceneVisual,
  onPlaySceneAudio,
  onBatchGenerateVisuals,
  isBatchGenerating
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [loadingSceneIndex, setLoadingSceneIndex] = useState<number | null>(null);

  const handleRegenerate = async (index: number) => {
    setLoadingSceneIndex(index);
    try {
      await onGenerateSceneVisual(index);
    } finally {
      setLoadingSceneIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">
              Google Flow Storyboard & Scene Breakdown
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
              {scenes.length} Scenes • {format === '9:16' ? 'Shorts 9:16' : 'Widescreen 16:9'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Character consistency locked to{' '}
            <strong className="text-slate-200">{character?.name || 'Default Protagonist'}</strong>{' '}
            via Google Flow seed tokens
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBatchGenerateVisuals}
            disabled={isBatchGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            {isBatchGenerating ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Visuals...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate All Visuals</span>
              </>
            )}
          </button>

          <button
            onClick={onAddScene}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-red-400" />
            <span>Add Scene</span>
          </button>
        </div>
      </div>

      {/* Scene Cards Stack */}
      <div className="space-y-4">
        {scenes.map((scene, idx) => {
          const isExpanded = expandedIndex === idx;
          const isGenerating = loadingSceneIndex === idx;

          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all shadow-sm"
            >
              {/* Scene Card Header Bar */}
              <div
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-red-400">
                    #{scene.sceneNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{scene.title}</span>
                      <span className="text-xs text-slate-400 font-mono">
                        ({scene.durationSeconds}s)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 max-w-lg mt-0.5">
                      {scene.narrationText}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Thumbnail snippet */}
                  {scene.imageUrl && (
                    <img
                      src={scene.imageUrl}
                      alt={scene.title}
                      className="w-14 h-9 object-cover rounded-md border border-slate-700 hidden sm:block"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Scene Card Expanded Details */}
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-slate-800/80 mt-2 space-y-4 text-xs">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-3">
                    {/* Left Col: Visual Preview & Google Flow Prompts */}
                    <div className="lg:col-span-5 space-y-3">
                      <div className="relative rounded-xl overflow-hidden bg-black border border-slate-800 aspect-video group flex items-center justify-center">
                        {scene.imageUrl ? (
                          <img
                            src={scene.imageUrl}
                            alt={scene.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                            <p className="text-slate-400 text-xs">No visual rendered yet</p>
                          </div>
                        )}

                        <button
                          onClick={() => handleRegenerate(idx)}
                          disabled={isGenerating}
                          className="absolute bottom-2.5 right-2.5 px-2.5 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-[11px] font-medium border border-white/20 backdrop-blur-md flex items-center gap-1.5 transition-all shadow-md"
                        >
                          <RotateCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                          <span>{isGenerating ? 'Rendering...' : 'Regenerate Frame'}</span>
                        </button>
                      </div>

                      {/* Camera Angle & Character Movement */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                          <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1 text-[11px]">
                            <Camera className="w-3.5 h-3.5 text-blue-400" />
                            <span>Camera Angle</span>
                          </div>
                          <input
                            type="text"
                            value={scene.cameraAngle}
                            onChange={(e) => onUpdateScene(idx, { cameraAngle: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px]"
                          />
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                          <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1 text-[11px]">
                            <Music className="w-3.5 h-3.5 text-amber-400" />
                            <span>Audio Mood</span>
                          </div>
                          <input
                            type="text"
                            value={scene.musicMood}
                            onChange={(e) => onUpdateScene(idx, { musicMood: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Col: Prompts and Voice Narration */}
                    <div className="lg:col-span-7 space-y-3.5">
                      {/* Narration Script with Audio Playback */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                            <Volume2 className="w-3.5 h-3.5 text-red-400" />
                            <span>Spoken Narration Script</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => onPlaySceneAudio(scene.narrationText, scene.voiceEmotion)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40"
                          >
                            <Play className="w-3 h-3 fill-emerald-400" />
                            <span>Preview Voice</span>
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={scene.narrationText}
                          onChange={(e) => onUpdateScene(idx, { narrationText: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-red-500 leading-relaxed font-sans"
                        />
                      </div>

                      {/* Google Flow Image Prompt */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span>Google Flow (Imagen) Image Prompt</span>
                          </label>
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Character Lock Active</span>
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          value={scene.googleFlowPrompt}
                          onChange={(e) => onUpdateScene(idx, { googleFlowPrompt: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-300 font-mono text-[11px] focus:outline-none focus:border-red-500"
                        />
                      </div>

                      {/* Veo Video Motion Prompt */}
                      <div>
                        <label className="text-slate-300 font-semibold flex items-center gap-1.5 mb-1">
                          <Film className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Google Veo Video Motion Prompt</span>
                        </label>
                        <input
                          type="text"
                          value={scene.veoMotionPrompt}
                          onChange={(e) => onUpdateScene(idx, { veoMotionPrompt: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 font-mono text-[11px] focus:outline-none focus:border-red-500"
                        />
                      </div>

                      {/* Actions */}
                      <div className="pt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[11px]">Duration:</span>
                          <input
                            type="number"
                            min={5}
                            max={120}
                            value={scene.durationSeconds}
                            onChange={(e) =>
                              onUpdateScene(idx, { durationSeconds: parseInt(e.target.value) || 15 })
                            }
                            className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-slate-200 text-center"
                          />
                          <span className="text-slate-400 text-[11px]">seconds</span>
                        </div>

                        {scenes.length > 1 && (
                          <button
                            onClick={() => onDeleteScene(idx)}
                            className="flex items-center gap-1 text-slate-400 hover:text-red-400 text-[11px] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Scene</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
