export type AIModelProvider = 'chatgpt' | 'deepseek' | 'gemini';

export type ScriptTone =
  | 'cinematic'
  | 'high-energy'
  | 'documentary'
  | 'educational'
  | 'storytelling'
  | 'mystery';

export type VideoFormat = '16:9' | '9:16';

export type ProductionStage =
  | 'idea' | 'research' | 'scripting' | 'storyboard' | 'characters'
  | 'visuals' | 'animation' | 'combination' | 'video' | 'publish';

export interface IdeaBrief {
  concept: string;
  audience: string;
  objective: string;
  hook: string;
  references: string[];
  titleIdeas: string[];
  selectedTitle?: string;
}

export interface ScriptSection {
  id: string;
  heading: string;
  purpose: string;
  narration: string;
  estimatedSeconds: number;
}

export interface ScriptDraft {
  version: number;
  status: 'outline' | 'draft' | 'review' | 'final';
  sections: ScriptSection[];
  wordCount: number;
  estimatedDurationSeconds: number;
  notes?: string;
}

export interface AudioTrack {
  id: string;
  type: 'voice' | 'music' | 'sfx';
  name: string;
  url?: string;
  startSeconds: number;
  durationSeconds: number;
  volume: number;
}

export interface TimelineItem {
  id: string;
  sceneNumber: number;
  startSeconds: number;
  durationSeconds: number;
  visualUrl?: string;
  audioTrackIds: string[];
  transition?: string;
}

export interface ProductionState {
  currentStage: ProductionStage;
  completedStages: ProductionStage[];
  idea?: IdeaBrief;
  script?: ScriptDraft;
  selectedVoice?: string;
  audioTracks: AudioTrack[];
  timeline: TimelineItem[];
  renderStatus: 'idle' | 'rendering' | 'ready' | 'error';
  renderUrl?: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  artStyle: string;
  genderOrArchetype: string;
  hairColorAndStyle: string;
  facialFeatures: string;
  signatureOutfit: string;
  distinctiveProps: string;
  consistencyTokens: string[];
  avatarUrl?: string;
  avatarVisualPrompt?: string;
  seedNumber?: string;
  isPreset?: boolean;
}

export interface Scene {
  sceneNumber: number;
  title: string;
  durationSeconds: number;
  visualDescription: string;
  cameraAngle: string;
  characterActions: string;
  googleFlowPrompt: string;
  veoMotionPrompt: string;
  narrationText: string;
  voiceEmotion: string;
  musicMood: string;
  imageUrl?: string;
  imageStatus: 'idle' | 'generating' | 'ready' | 'error';
  audioUrl?: string;
  audioStatus: 'idle' | 'generating' | 'ready' | 'error';
}

export interface VideoSEO {
  youtubeTitle: string;
  alternativeTitles: string[];
  description: string;
  chapters: { time: string; title: string }[];
  tags: string[];
  category: string;
  seoScore: number;
  estimatedCTR: string;
}

export interface VideoProject {
  id: string;
  title: string;
  topic: string;
  format: VideoFormat;
  scriptProvider: AIModelProvider;
  characterId: string;
  tone: ScriptTone;
  targetDurationMinutes: number;
  hookStatement: string;
  fullScript: string;
  ideaBrief?: IdeaBrief;
  researchNotes?: string[];
  scriptDraft?: ScriptDraft;
  production?: ProductionState;
  scenes: Scene[];
  thumbnailPrompt: string;
  thumbnailUrl?: string;
  seo: VideoSEO;
  status: 'draft' | 'scripted' | 'visualized' | 'voiced' | 'ready' | 'published';
  youtubeUpload?: {
    status: 'draft' | 'scheduled' | 'published';
    privacy: 'public' | 'unlisted' | 'private' | 'scheduled';
    scheduledTime?: string;
    youtubeId?: string;
    youtubeUrl?: string;
    publishedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AutomationScheduleItem {
  id: string;
  projectId: string;
  projectTitle: string;
  format: VideoFormat;
  scheduledTime: string;
  frequency: 'once' | 'daily' | 'weekly_3x' | 'weekly';
  status: 'queued' | 'rendering' | 'uploaded' | 'paused';
  characterName: string;
  aiPipeline: {
    scriptModel: string;
    visualEngine: string;
    voiceName: string;
  };
}

export interface ChannelProfile {
  name: string;
  handle: string;
  niche: string;
  subscribers: number;
  defaultPrivacy: 'public' | 'unlisted' | 'private' | 'scheduled';
  defaultVoice: string;
  connected: boolean;
}
