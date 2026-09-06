import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Subtitles,
  Music,
  ShieldCheck
} from 'lucide-react';
import { Scene, VideoFormat, CharacterProfile } from '../types';

interface VideoPlayerPreviewProps {
  scenes: Scene[];
  format: VideoFormat;
  character?: CharacterProfile;
  activeVoice: string;
}

export const VideoPlayerPreview: React.FC<VideoPlayerPreviewProps> = ({
  scenes,
  format,
  character,
  activeVoice
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 100% of current scene
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [hasMusic, setHasMusic] = useState(true);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentScene = scenes[currentSceneIndex] || scenes[0];
  const totalDuration = scenes.reduce((acc, s) => acc + s.durationSeconds, 0);

  // Initialize synth
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Play narration on scene change when playing
  const speakCurrentScene = (text: string) => {
    if (!synthRef.current || isMuted) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    
    // Pick voice if available
    const voices = synthRef.current.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  // Timer loop for scene advancement
  useEffect(() => {
    let interval: any = null;

    if (isPlaying && currentScene) {
      speakCurrentScene(currentScene.narrationText);

      const stepMs = 100;
      const totalSteps = (currentScene.durationSeconds * 1000) / stepMs;
      const increment = 100 / totalSteps;

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev + increment >= 100) {
            // Next scene
            if (currentSceneIndex < scenes.length - 1) {
              setCurrentSceneIndex((idx) => idx + 1);
              return 0;
            } else {
              // Finished
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + increment;
        });
      }, stepMs);
    } else {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    }

    return () => {
      if (interval) clearInterval(interval);
      if (synthRef.current) synthRef.current.cancel();
    };
  }, [isPlaying, currentSceneIndex, isMuted]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (synthRef.current) synthRef.current.cancel();
    } else {
      if (progress >= 100 && currentSceneIndex >= scenes.length - 1) {
        setCurrentSceneIndex(0);
        setProgress(0);
      }
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex((i) => i - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex((i) => i + 1);
      setProgress(0);
    }
  };

  // Calculate elapsed time
  const elapsedSeconds =
    scenes.slice(0, currentSceneIndex).reduce((acc, s) => acc + s.durationSeconds, 0) +
    Math.floor(((currentScene?.durationSeconds || 15) * progress) / 100);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isVertical = format === '9:16';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Full Video Assembly & Playback</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Sync Engine: Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time preview with voiceover narration, animated captions, and Ken Burns cinematic motion
          </p>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowSubtitles(!showSubtitles)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              showSubtitles
                ? 'bg-red-600/10 border-red-500/30 text-red-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Subtitles className="w-3.5 h-3.5" />
            <span>Captions</span>
          </button>

          <button
            onClick={() => setHasMusic(!hasMusic)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              hasMusic
                ? 'bg-amber-600/10 border-amber-500/30 text-amber-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>BGM Track</span>
          </button>
        </div>
      </div>

      {/* Screen Frame Container */}
      <div className="flex justify-center bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80">
        <div
          className={`relative rounded-xl overflow-hidden bg-black shadow-2xl border border-slate-800 flex flex-col justify-between ${
            isVertical ? 'w-full max-w-sm aspect-[9/16]' : 'w-full max-w-3xl aspect-video'
          }`}
        >
          {/* Main Visual Frame with subtle Ken Burns effect */}
          <div className="absolute inset-0 overflow-hidden">
            {currentScene?.imageUrl ? (
              <img
                src={currentScene.imageUrl}
                alt={currentScene.title}
                className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${
                  isPlaying ? 'scale-110' : 'scale-100'
                }`}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500">
                <span>Generating Scene Visual...</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          </div>

          {/* Top Overlay Badge */}
          <div className="relative z-10 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                Scene {currentSceneIndex + 1}/{scenes.length}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-red-600/80 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                1080p 60fps
              </span>
            </div>

            {character && (
              <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{character.name}</span>
              </span>
            )}
          </div>

          {/* Center Title or Subtitles */}
          <div className="relative z-10 px-6 py-4 text-center">
            {showSubtitles && currentScene && (
              <div className="inline-block bg-black/75 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-white font-medium text-xs sm:text-sm max-w-lg leading-relaxed shadow-lg">
                <span className="text-yellow-400 font-bold uppercase mr-1.5 text-[11px] tracking-wide">
                  [{currentScene.voiceEmotion || 'Narrator'}]:
                </span>
                <span>"{currentScene.narrationText}"</span>
              </div>
            )}
          </div>

          {/* Bottom Player Controls Overlay */}
          <div className="relative z-10 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
            {/* Scrubber Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3 cursor-pointer">
              <div
                className="bg-red-600 h-full transition-all duration-100"
                style={{
                  width: `${((elapsedSeconds / (totalDuration || 1)) * 100).toFixed(1)}%`
                }}
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  disabled={currentSceneIndex === 0}
                  className="p-1 hover:text-red-400 disabled:opacity-40 transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={handleTogglePlay}
                  className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white transition-transform active:scale-95 shadow-md shadow-red-600/30"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentSceneIndex >= scenes.length - 1}
                  className="p-1 hover:text-red-400 disabled:opacity-40 transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <span className="text-[11px] font-mono text-slate-300 ml-1">
                  {formatTime(elapsedSeconds)} / {formatTime(totalDuration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 hover:text-red-400 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-slate-200" />
                  )}
                </button>

                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                  Audio: {activeVoice} (TTS)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
