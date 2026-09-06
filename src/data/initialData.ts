import { CharacterProfile, VideoProject, AutomationScheduleItem, ChannelProfile } from '../types';

export const INITIAL_CHARACTERS: CharacterProfile[] = [
  {
    id: 'char-1',
    name: 'Dr. Julian Vance',
    role: 'Tech Futurist & Quantum Narrator',
    artStyle: '3D Pixar Animation, octane render, soft subsurface scattering, clean studio key light',
    genderOrArchetype: 'Male, early 30s, sharp thinker',
    hairColorAndStyle: 'Neat wavy dark auburn hair, styled quiff',
    facialFeatures: 'Expressive hazel eyes, subtle stylish thin-frame geometric titanium glasses, charismatic smile',
    signatureOutfit: 'Charcoal minimalist tailored turtleneck sweater, navy technical blazer with glowing subtle lapel pin',
    distinctiveProps: 'Translucent floating holographic stylus, sleek smart-ring on right index finger',
    consistencyTokens: [
      'char_julian_vance',
      'pixar 3D stylized character',
      'thin geometric glasses',
      'charcoal turtleneck navy blazer',
      'expressive hazel eyes',
      'consistent face model seed: 88412'
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    isPreset: true
  },
  {
    id: 'char-2',
    name: 'Maya Lin',
    role: 'Cyber Detective & AI Investigator',
    artStyle: 'Cinematic Hyperrealistic 8K, Arri Alexa 65mm lens, moody anamorphic lighting, Blade Runner aesthetic',
    genderOrArchetype: 'Female, late 20s, observant and determined',
    hairColorAndStyle: 'Jet black sleek asymmetric bob with subtle electric cyan underlights',
    facialFeatures: 'Sharp jawline, keen dark eyes with faint digital reflection, light freckles over nose bridge',
    signatureOutfit: 'High-collar matte waterproof trench coat with neon piping, tactical grey utility mockneck',
    distinctiveProps: 'Sleek transparent AR HUD earpiece, cybernetic pocket recorder',
    consistencyTokens: [
      'char_maya_lin',
      'cinematic photorealism',
      'asymmetric black bob cyan tint',
      'matte trenchcoat mockneck',
      'AR earpiece glow',
      'consistent face model seed: 91204'
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    isPreset: true
  },
  {
    id: 'char-3',
    name: 'Professor Aris Thorne',
    role: 'Ancient History & Mythology Storyteller',
    artStyle: 'Ghibli anime aesthetic, painted watercolor backgrounds, warm nostalgic golden hour lighting',
    genderOrArchetype: 'Elder scholar, warm mentor archetype',
    hairColorAndStyle: 'Wispy silver hair, neatly trimmed salt-and-pepper beard',
    facialFeatures: 'Warm crinkled eyes with laugh lines, half-moon spectacles resting on nose',
    signatureOutfit: 'Wool tweed vest over cream linen shirt, brass pocket watch chain, roll-up sleeves',
    distinctiveProps: 'Antique leather-bound journal filled with golden sketches, brass compass',
    consistencyTokens: [
      'char_aris_thorne',
      'ghibli watercolor style',
      'silver hair trimmed beard',
      'tweed vest brass spectacles',
      'warm nostalgic lighting',
      'consistent face model seed: 33170'
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80',
    isPreset: true
  }
];

export const INITIAL_CHANNEL: ChannelProfile = {
  name: 'Nexus AI Studio',
  handle: '@NexusAIStudio',
  niche: 'Artificial Intelligence & Future Tech Automation',
  subscribers: 142800,
  defaultPrivacy: 'public',
  defaultVoice: 'Kore',
  connected: true
};

export const INITIAL_PROJECTS: VideoProject[] = [
  {
    id: 'proj-1',
    title: 'The AI Revolution: DeepSeek vs ChatGPT Explained',
    topic: 'How DeepSeek R1 reasoning works compared to OpenAI o1/ChatGPT-4o and what it means for creators',
    format: '16:9',
    scriptProvider: 'deepseek',
    characterId: 'char-1',
    tone: 'educational',
    targetDurationMinutes: 3,
    hookStatement: 'In the last 48 hours, a small open-weights model triggered a 1 trillion dollar panic in Silicon Valley. Here is what actually happened.',
    fullScript: `[SCENE 1 - 0:00 to 0:15]
VISUAL: Dr. Julian Vance stands in a modern glass holographic laboratory at midnight. Screens behind him display soaring neural network trees and cost comparison charts ($6M training cost vs $100M).
NARRATION (High Energy): "In the last 48 hours, a single open-source model caused a trillion-dollar shockwave through Silicon Valley. While everyone assumed only tech giants with nuclear power plants could build cutting-edge reasoning... DeepSeek proved math beats pure brute force."

[SCENE 2 - 0:15 to 0:45]
VISUAL: Medium close-up of Dr. Julian Vance tapping a translucent floating terminal. Two holographic brains materialize: one glowing emerald green (DeepSeek R1) using Pure Reinforcement Learning without human labels, and one glowing electric blue (ChatGPT-4o).
NARRATION (Analytical): "To understand why this shook the industry, we have to look inside the reasoning loop. Standard models mimic human answers. DeepSeek R1 learned through pure cold trial and error—rewarded only when its final math proof was 100% indisputable."

[SCENE 3 - 0:45 to 1:15]
VISUAL: Cinematic camera sweep around Dr. Vance holding a golden microchip. In the background, automated workflows generate video scripts, visual storyboards, and synthetic voices at 95% reduced cost.
NARRATION (Visionary): "For automated creators, the math is staggering. Workflows that used to cost $50 per video now cost pennies. The barrier to producing broadcast-tier YouTube content isn't money anymore—it is the architecture of your automation pipeline."

[SCENE 4 - 1:15 to 1:45]
VISUAL: Dr. Vance smiles confidently directly into the camera, gesturing towards a futuristic YouTube video player interface uploading the finished video to millions of subscribers.
NARRATION (Call to Action): "The question is no longer who owns the biggest supercomputer. The question is: what will you build with the intelligence in your hands right now? Subscribe to automate your next breakthrough."`,
    scenes: [
      {
        sceneNumber: 1,
        title: 'The $1T Silicon Valley Shockwave',
        durationSeconds: 15,
        visualDescription: 'Dr. Julian Vance in modern glass holographic laboratory at midnight. Glowing screens show cost comparison charts ($6M vs $100M). Dramatic lighting.',
        cameraAngle: 'Cinematic wide shot with smooth gimbal push-in',
        characterActions: 'Dr. Julian Vance turns towards the camera with intense focus, gesturing at the floating numbers',
        googleFlowPrompt: 'Pixar 3D style, Dr. Julian Vance character with neat auburn wavy hair, thin geometric glasses, navy blazer over charcoal turtleneck, standing inside high-tech glass holographic server lab at midnight, glowing turquoise charts, volumetric blue rim light, octane render, 8k',
        veoMotionPrompt: 'Slow camera dolly forward towards Dr. Julian Vance as holographic server data streams orbit around his shoulders smoothly, 4k 60fps',
        narrationText: 'In the last 48 hours, a single open-source model caused a trillion-dollar shockwave through Silicon Valley. While everyone assumed only tech giants could build cutting-edge reasoning, DeepSeek proved math beats pure brute force.',
        voiceEmotion: 'Dramatic, high energy hook',
        musicMood: 'Suspenseful electronic synth pulse build-up',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        imageStatus: 'ready',
        audioStatus: 'ready'
      },
      {
        sceneNumber: 2,
        title: 'Inside the Reasoning Loop: DeepSeek vs ChatGPT',
        durationSeconds: 30,
        visualDescription: 'Medium shot of Dr. Julian Vance manipulating two floating holographic AI brain models. One emerald green (DeepSeek R1) and one electric blue (ChatGPT-4o).',
        cameraAngle: 'Dynamic medium close-up, slight low angle',
        characterActions: 'Dr. Julian Vance points between the two glowing AI neural structures with precision',
        googleFlowPrompt: 'Pixar 3D style, Dr. Julian Vance character with neat auburn wavy hair, thin geometric glasses, charcoal turtleneck, interacting with two floating 3D neon brain holograms emerald and sapphire, clean futuristic studio background, depth of field, vivid lighting',
        veoMotionPrompt: 'Subtle hand movement guiding the two holographic models closer together as micro-sparks of neural electricity flicker, smooth cinematic tracking',
        narrationText: 'To understand why this shook the industry, we have to look inside the reasoning loop. Standard models mimic human answers. DeepSeek R1 learned through pure cold trial and error—rewarded only when its final math proof was 100% indisputable.',
        voiceEmotion: 'Analytical, intriguing explanation',
        musicMood: 'Modern tech beat, subtle rhythmic bassline',
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
        imageStatus: 'ready',
        audioStatus: 'ready'
      },
      {
        sceneNumber: 3,
        title: 'The 95% Cost Collapse for Creators',
        durationSeconds: 30,
        visualDescription: 'Cinematic wide shot. Dr. Julian Vance holding a golden glowing microchip while automated media pipeline diagrams stream in the air.',
        cameraAngle: 'Slow 180-degree circular orbit shot',
        characterActions: 'Holds the golden chip delicately, inspiring tone, smiling warmly',
        googleFlowPrompt: 'Pixar 3D style, Dr. Julian Vance character with auburn hair and geometric titanium glasses, navy blazer, holding glowing golden microchip in palm, ambient gold and deep purple reflections, automated studio control room, cinematic wide shot',
        veoMotionPrompt: 'Orbiting camera rotation around the subject, golden light casting soft lens flares, elegant smooth animation',
        narrationText: 'For automated creators, the math is staggering. Workflows that used to cost $50 per video now cost pennies. The barrier to producing broadcast-tier YouTube content is no longer budget—it is the architecture of your automation pipeline.',
        voiceEmotion: 'Empowering, visionary tone',
        musicMood: 'Uplifting inspiring ambient electronic',
        imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=80',
        imageStatus: 'ready',
        audioStatus: 'ready'
      },
      {
        sceneNumber: 4,
        title: 'The Automation Master Plan & Outro',
        durationSeconds: 30,
        visualDescription: 'Dr. Julian Vance smiling warmly into the camera, surrounded by glowing YouTube subscriber counters and video analytics cards.',
        cameraAngle: 'Frontal portrait shot with soft bokeh background',
        characterActions: 'Gives an encouraging nod and points to the subscription button graphic',
        googleFlowPrompt: 'Pixar 3D style, Dr. Julian Vance character with neat auburn wavy hair and thin glasses, warm friendly expression, clean modern creator studio background with subtle red YouTube neon accent, warm studio fill light, 8k octane render',
        veoMotionPrompt: 'Gentle hand gesture towards viewer with confident warm expression, background neon pulses gently',
        narrationText: 'The question is no longer who owns the biggest supercomputer. The question is: what will you build with the intelligence in your hands right now? Hit subscribe to automate your next breakthrough.',
        voiceEmotion: 'Warm, encouraging, memorable call to action',
        musicMood: 'Triumphant crescendo outro',
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
        imageStatus: 'ready',
        audioStatus: 'ready'
      }
    ],
    thumbnailPrompt: 'YouTube thumbnail: High-contrast Pixar 3D face of Dr. Julian Vance with shocked expressive reaction, glowing green DeepSeek R1 logo vs glowing blue ChatGPT logo, giant bold text "GAME OVER?", neon green and blue lightning, ultra crisp 8K',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    seo: {
      youtubeTitle: 'DeepSeek R1 vs ChatGPT-4o: The Truth Silicon Valley Hid from You',
      alternativeTitles: [
        'How DeepSeek Just Changed AI Forever (Creator Breakdown)',
        'Why Open Source AI Just Won the Race: DeepSeek Explained',
        'DeepSeek vs OpenAI: $6M vs $100M Shockwave'
      ],
      description: `DeepSeek R1 shocked the AI world by matching OpenAI o1 at 1/20th the cost. In this video, we break down how reinforcement learning without human feedback works, why this breaks the GPU monopoly, and how creators can automate high-end YouTube video production.

⏱️ CHAPTER TIMESTAMPS:
00:00 - The $1T Silicon Valley Shockwave
00:15 - Inside the Reasoning Loop (DeepSeek vs ChatGPT)
00:45 - The 95% Cost Collapse for Automated Creators
01:15 - How to Build Your Own AI Video Pipeline

#AI #DeepSeek #ChatGPT #TechTrends #Automation #YouTubeAutomation`,
      chapters: [
        { time: '00:00', title: 'The $1T Silicon Valley Shockwave' },
        { time: '00:15', title: 'Inside the Reasoning Loop' },
        { time: '00:45', title: 'The 95% Cost Collapse' },
        { time: '01:15', title: 'How to Build Your Pipeline' }
      ],
      tags: [
        'DeepSeek R1',
        'ChatGPT 4o',
        'OpenAI o1',
        'AI Automation',
        'YouTube Automation',
        'Artificial Intelligence',
        'Tech News',
        'Machine Learning',
        'Google Flow',
        'Veo AI'
      ],
      category: 'Science & Technology',
      seoScore: 96,
      estimatedCTR: '11.8%'
    },
    status: 'ready',
    youtubeUpload: {
      status: 'scheduled',
      privacy: 'public',
      scheduledTime: 'Tomorrow at 14:00 GMT',
      youtubeId: 'dQw4w9WgXcQ',
      youtubeUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ'
    },
    createdAt: '2026-09-04T12:00:00Z',
    updatedAt: '2026-09-05T18:30:00Z'
  }
];

export const INITIAL_SCHEDULE: AutomationScheduleItem[] = [
  {
    id: 'sched-1',
    projectId: 'proj-1',
    projectTitle: 'DeepSeek R1 vs ChatGPT-4o: The Truth Silicon Valley Hid',
    format: '16:9',
    scheduledTime: 'Tomorrow, 14:00 GMT',
    frequency: 'weekly_3x',
    status: 'queued',
    characterName: 'Dr. Julian Vance',
    aiPipeline: {
      scriptModel: 'DeepSeek R1 Reasoning',
      visualEngine: 'Google Flow / Imagen 3',
      voiceName: 'Kore (Warm Narrator)'
    }
  },
  {
    id: 'sched-2',
    projectId: 'proj-2',
    projectTitle: '3 AI Tools That Will Replace Video Editors in 2026',
    format: '9:16',
    scheduledTime: 'Thursday, 18:00 GMT',
    frequency: 'daily',
    status: 'rendering',
    characterName: 'Maya Lin',
    aiPipeline: {
      scriptModel: 'ChatGPT-4o Storyteller',
      visualEngine: 'Google Flow / Veo Motion',
      voiceName: 'Zephyr (High Energy)'
    }
  },
  {
    id: 'sched-3',
    projectId: 'proj-3',
    projectTitle: 'The Lost Library of Alexandria: What Was Really Inside?',
    format: '16:9',
    scheduledTime: 'Saturday, 11:00 GMT',
    frequency: 'weekly',
    status: 'uploaded',
    characterName: 'Professor Aris Thorne',
    aiPipeline: {
      scriptModel: 'Gemini 3.8 Flash Multimodal',
      visualEngine: 'Google Flow Ghibli Watercolor',
      voiceName: 'Fenrir (Deep Authority)'
    }
  }
];
