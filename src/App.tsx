/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PipelineWizard } from './components/PipelineWizard';
import { CharacterRoster } from './components/CharacterRoster';
import { CharacterBibleModal } from './components/CharacterBibleModal';
import { ImportChatModal } from './components/ImportChatModal';
import { ImportGoogleFlowModal } from './components/ImportGoogleFlowModal';
import { AutomationQueue } from './components/AutomationQueue';
import { ChannelSettings } from './components/ChannelSettings';
import {
  INITIAL_CHARACTERS,
  INITIAL_PROJECTS,
  INITIAL_SCHEDULE,
  INITIAL_CHANNEL
} from './data/initialData';
import { VideoProject, CharacterProfile, AutomationScheduleItem, ChannelProfile } from './types';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'characters' | 'automation' | 'channel'>('studio');
  const [projects, setProjects] = useState<VideoProject[]>(() => {
    const saved = localStorage.getItem('yt_auto_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0]?.id || 'proj-1');

  const [characters, setCharacters] = useState<CharacterProfile[]>(() => {
    const saved = localStorage.getItem('yt_auto_characters');
    return saved ? JSON.parse(saved) : INITIAL_CHARACTERS;
  });

  const [schedule, setSchedule] = useState<AutomationScheduleItem[]>(() => {
    const saved = localStorage.getItem('yt_auto_schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [channel, setChannel] = useState<ChannelProfile>(() => {
    const saved = localStorage.getItem('yt_auto_channel');
    return saved ? JSON.parse(saved) : INITIAL_CHANNEL;
  });

  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isImportChatModalOpen, setIsImportChatModalOpen] = useState(false);
  const [isImportGoogleFlowModalOpen, setIsImportGoogleFlowModalOpen] = useState(false);
  const [isAutomating, setIsAutomating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('yt_auto_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('yt_auto_characters', JSON.stringify(characters));
  }, [characters]);

  useEffect(() => {
    localStorage.setItem('yt_auto_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('yt_auto_channel', JSON.stringify(channel));
  }, [channel]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleUpdateProject = (updated: Partial<VideoProject>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, ...updated, updatedAt: new Date().toISOString() } : p))
    );
  };

  const handleNewProject = () => {
    const newId = `proj-${Date.now()}`;
    const newProj: VideoProject = {
      id: newId,
      title: 'Untold Secrets of Quantum AI',
      topic: 'How future quantum computing will supercharge AI models',
      format: '16:9',
      scriptProvider: 'deepseek',
      characterId: characters[0]?.id || 'char-1',
      tone: 'educational',
      targetDurationMinutes: 2,
      hookStatement: 'In the next two minutes, we examine how quantum superposition rewrites neural computing.',
      fullScript: `[Scene 1] Hook\n[Scene 2] Quantum Superposition\n[Scene 3] Outro`,
      scenes: [
        {
          sceneNumber: 1,
          title: 'Quantum Horizon Hook',
          durationSeconds: 15,
          visualDescription: `${characters[0]?.name || 'Presenter'} stands in front of a giant quantum cryostat chamber with shimmering subatomic particles.`,
          cameraAngle: 'Cinematic wide push-in',
          characterActions: 'Walks briskly toward the lens, gesturing at the glowing core',
          googleFlowPrompt: `${characters[0]?.artStyle || 'Pixar 3D style'}, ${characters[0]?.name || 'Presenter'}, ${characters[0]?.signatureOutfit || 'modern blazer'}, quantum computer lab background, blue particles, 8k octane render`,
          veoMotionPrompt: 'Slow cinematic tracking shot following subject in quantum lab, 4k 60fps',
          narrationText: 'What if standard silicon microchips hit a physical wall tomorrow? Welcome to the quantum AI frontier.',
          voiceEmotion: 'Dramatic, high energy',
          musicMood: 'Suspenseful electronic synth',
          imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80',
          imageStatus: 'ready',
          audioStatus: 'ready'
        },
        {
          sceneNumber: 2,
          title: 'Superposition & Qubits',
          durationSeconds: 30,
          visualDescription: 'Floating holographic Bloch spheres rotate with quantum vector arrows.',
          cameraAngle: 'Medium close-up with soft depth of field',
          characterActions: 'Holds hands up to manipulate the floating quantum qubit sphere',
          googleFlowPrompt: `${characters[0]?.artStyle || 'Pixar 3D style'}, ${characters[0]?.name || 'Presenter'}, manipulating glowing 3D holographic qubit spheres, neon blue and violet reflections`,
          veoMotionPrompt: 'Smooth pan around floating quantum holograms, cinematic volumetric light',
          narrationText: 'Unlike classical bits that are either zero or one, quantum qubits exist in all possibilities simultaneously.',
          voiceEmotion: 'Analytical, clear',
          musicMood: 'Modern tech rhythmic pulse',
          imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
          imageStatus: 'ready',
          audioStatus: 'ready'
        }
      ],
      thumbnailPrompt: 'High-contrast Pixar 3D face of Dr. Julian Vance reacting to glowing golden quantum processor, bold neon yellow text "QUANTUM SHIFT", 8K HDR',
      thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80',
      seo: {
        youtubeTitle: 'Quantum Computing + AI: What Nobody Tells You',
        alternativeTitles: [
          'Why Silicon Valley Is Quietly Switching to Quantum AI',
          'How Quantum Qubits Will Replace GPUs by 2030'
        ],
        description: 'A complete breakdown of quantum AI, qubits, and future automation.\n\n⏱️ CHAPTERS:\n00:00 - Quantum Horizon Hook\n00:15 - Superposition & Qubits\n\n#QuantumAI #DeepSeek #ChatGPT #TechTrends',
        chapters: [
          { time: '00:00', title: 'Quantum Horizon Hook' },
          { time: '00:15', title: 'Superposition & Qubits' }
        ],
        tags: ['Quantum Computing', 'Artificial Intelligence', 'Qubits', 'Future Tech', 'YouTube Automation'],
        category: 'Science & Technology',
        seoScore: 94,
        estimatedCTR: '11.2%'
      },
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProjects([newProj, ...projects]);
    setActiveProjectId(newId);
    setActiveTab('studio');
    showToast('Created new automated video project!');
  };

  const handleSaveCharacter = (newChar: CharacterProfile) => {
    setCharacters((prev) => {
      const idx = prev.findIndex((c) => c.id === newChar.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newChar;
        return copy;
      }
      return [...prev, newChar];
    });
    showToast(`Saved character bible for ${newChar.name}`);
  };

  const handleRunBatchAutomation = () => {
    setIsAutomating(true);
    showToast('Executing automated YouTube batch pipeline...');

    setTimeout(() => {
      setIsAutomating(false);
      showToast('Automation pipeline complete! 1 video published, 2 scheduled for upload.');
      // mark first queued item as uploaded
      setSchedule((prev) =>
        prev.map((item, idx) =>
          idx === 0 ? { ...item, status: 'uploaded' } : item
        )
      );
    }, 2800);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        channel={channel}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={(id) => {
          setActiveProjectId(id);
          setActiveTab('studio');
        }}
        onNewProject={handleNewProject}
        onRunBatchAutomation={handleRunBatchAutomation}
        isAutomating={isAutomating}
        onOpenImportChat={() => setIsImportChatModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'studio' && activeProject && (
          <PipelineWizard
            project={activeProject}
            characters={characters}
            channel={channel}
            onUpdateProject={handleUpdateProject}
            onOpenCharacterModal={() => setIsCharacterModalOpen(true)}
            onSelectCharacter={(charId) => handleUpdateProject({ characterId: charId })}
            onOpenImportChatModal={() => setIsImportChatModalOpen(true)}
            onOpenGoogleFlowModal={() => setIsImportGoogleFlowModalOpen(true)}
          />
        )}

        {activeTab === 'characters' && (
          <CharacterRoster
            characters={characters}
            onSaveCharacter={handleSaveCharacter}
            onSelectCharacterForProject={(charId) => {
              handleUpdateProject({ characterId: charId });
              setActiveTab('studio');
              showToast('Active character assigned to current video project!');
            }}
            activeCharacterId={activeProject?.characterId}
          />
        )}

        {activeTab === 'automation' && (
          <AutomationQueue
            schedule={schedule}
            projects={projects}
            characters={characters}
            onAddScheduleItem={(item) => {
              setSchedule([item, ...schedule]);
              showToast('Scheduled video added to automation calendar!');
            }}
            onRemoveScheduleItem={(id) => {
              setSchedule(schedule.filter((s) => s.id !== id));
              showToast('Removed from automation queue.');
            }}
            onRunBatchAutomation={handleRunBatchAutomation}
            isAutomating={isAutomating}
          />
        )}

        {activeTab === 'channel' && (
          <ChannelSettings
            channel={channel}
            onUpdateChannel={(updated) => {
              setChannel({ ...channel, ...updated });
              showToast('Channel settings saved successfully.');
            }}
          />
        )}
      </main>

      {/* Persistent Character Bible Modal */}
      <CharacterBibleModal
        isOpen={isCharacterModalOpen}
        onClose={() => setIsCharacterModalOpen(false)}
        onSaveCharacter={handleSaveCharacter}
      />

      {/* Import from ChatGPT & DeepSeek Modal */}
      <ImportChatModal
        isOpen={isImportChatModalOpen}
        onClose={() => setIsImportChatModalOpen(false)}
        activeCharacter={characters.find((c) => c.id === activeProject?.characterId) || characters[0]}
        onImportSuccess={(parsedProject) => {
          const newId = `proj-${Date.now()}`;
          const newProj: VideoProject = {
            id: newId,
            title: parsedProject.title || 'Imported Video Project',
            topic: parsedProject.topic || parsedProject.title,
            format: parsedProject.format || '16:9',
            scriptProvider: parsedProject.scriptProvider || 'deepseek',
            characterId: activeProject?.characterId || characters[0]?.id || 'char-1',
            tone: 'educational',
            targetDurationMinutes: 2,
            hookStatement: parsedProject.hookStatement || '',
            fullScript: parsedProject.fullScript || '',
            scenes: (parsedProject.scenes || []).map((s: any) => ({
              ...s,
              imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
              imageStatus: 'ready',
              audioStatus: 'ready'
            })),
            thumbnailPrompt: parsedProject.thumbnailPrompt || '',
            thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
            seo: parsedProject.seo,
            status: 'scripted',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          setProjects([newProj, ...projects]);
          setActiveProjectId(newId);
          setActiveTab('studio');
          showToast(`Successfully converted chat into production video: "${newProj.title}"`);
        }}
      />

      {/* Import from Google Flow Modal */}
      <ImportGoogleFlowModal
        isOpen={isImportGoogleFlowModalOpen}
        onClose={() => setIsImportGoogleFlowModalOpen(false)}
        onSaveCharacter={(newChar) => {
          handleSaveCharacter(newChar);
          handleUpdateProject({ characterId: newChar.id });
          showToast(`Locked Google Flow character: ${newChar.name}`);
        }}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
