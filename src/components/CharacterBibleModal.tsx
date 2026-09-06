import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Palette, Wand2, RefreshCw } from 'lucide-react';
import { CharacterProfile } from '../types';

interface CharacterBibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCharacter: (char: CharacterProfile) => void;
  editingCharacter?: CharacterProfile | null;
}

const ART_STYLES = [
  '3D Pixar Animation, octane render, soft subsurface scattering, clean studio key light',
  'Cinematic Hyperrealistic 8K, Arri Alexa 65mm lens, moody anamorphic lighting',
  'Studio Ghibli Anime, hand-drawn watercolor backgrounds, nostalgic golden hour',
  'Cyberpunk Neo-Noir, volumetric neon fog, rain reflections, high contrast',
  'Modern Graphic Novel, bold dynamic linework, vibrant flat colors with halftone'
];

export const CharacterBibleModal: React.FC<CharacterBibleModalProps> = ({
  isOpen,
  onClose,
  onSaveCharacter,
  editingCharacter
}) => {
  const [name, setName] = useState(editingCharacter?.name || '');
  const [role, setRole] = useState(editingCharacter?.role || 'Host & Explainer');
  const [artStyle, setArtStyle] = useState(editingCharacter?.artStyle || ART_STYLES[0]);
  const [hairAndFace, setHairAndFace] = useState(editingCharacter?.hairColorAndStyle || 'Dark wavy hair, neat styling, expressive eyes, charismatic presence');
  const [signatureOutfit, setSignatureOutfit] = useState(editingCharacter?.signatureOutfit || 'Tailored modern blazer with minimalist dark turtleneck');
  const [props, setProps] = useState(editingCharacter?.distinctiveProps || 'Smart ring on index finger, floating transparent stylus');
  const [tokens, setTokens] = useState<string[]>(editingCharacter?.consistencyTokens || [
    'char_anchor_locked',
    'consistent facial topology seed #8812',
    'distinctive signature outfit',
    '8k octane studio render'
  ]);
  const [isGeneratingTokens, setIsGeneratingTokens] = useState(false);

  if (!isOpen) return null;

  const handleGenerateConsistencyTokens = async () => {
    setIsGeneratingTokens(true);
    try {
      const res = await fetch('/api/generate-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'Presenter',
          role,
          artStyle,
          physicalDescription: hairAndFace,
          signatureOutfit,
          distinctiveProps: props
        })
      });
      const data = await res.json();
      if (data.consistencyTokens) {
        setTokens(data.consistencyTokens);
      }
    } catch (e) {
      console.error(e);
      // local fallback
      const cleanName = (name || 'Host').toLowerCase().replace(/\s+/g, '_');
      setTokens([
        `char_${cleanName}`,
        artStyle.split(',')[0],
        signatureOutfit,
        hairAndFace.split(',')[0],
        `consistent seed #${Math.floor(Math.random() * 90000 + 10000)}`,
        'octane studio lighting'
      ]);
    } finally {
      setIsGeneratingTokens(false);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const newChar: CharacterProfile = {
      id: editingCharacter?.id || `char-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      artStyle,
      genderOrArchetype: 'Creator Host',
      hairColorAndStyle: hairAndFace,
      facialFeatures: hairAndFace,
      signatureOutfit,
      distinctiveProps: props,
      consistencyTokens: tokens,
      avatarUrl: editingCharacter?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      isPreset: false
    };
    onSaveCharacter(newChar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Consistent Character Bible</h2>
              <p className="text-xs text-slate-400">
                Lock visual anchors to guarantee zero character morphing between scenes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Character Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Leo Vance"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Role / Niche</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Tech Futurist & Lead Narrator"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Visual Art Style (Locked for entire series)
            </label>
            <select
              value={artStyle}
              onChange={(e) => setArtStyle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
            >
              {ART_STYLES.map((style, idx) => (
                <option key={idx} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Facial Features, Hair & Expression
            </label>
            <input
              type="text"
              value={hairAndFace}
              onChange={(e) => setHairAndFace(e.target.value)}
              placeholder="e.g. Sharp jawline, dark wavy swept hair, thin wire glasses, warm smile"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Signature Outfit (Locked)</label>
              <input
                type="text"
                value={signatureOutfit}
                onChange={(e) => setSignatureOutfit(e.target.value)}
                placeholder="e.g. Navy tailored blazer over black turtleneck"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Recurring Props / Accessories</label>
              <input
                type="text"
                value={props}
                onChange={(e) => setProps(e.target.value)}
                placeholder="e.g. Holographic wrist device, notebook"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Consistency Lock Tokens Section */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-slate-200">
                  Google Flow Consistency Tokens (Auto-Injected)
                </span>
              </div>
              <button
                type="button"
                onClick={handleGenerateConsistencyTokens}
                disabled={isGeneratingTokens}
                className="flex items-center gap-1 text-[11px] font-semibold text-red-400 hover:text-red-300 px-2 py-1 rounded bg-red-950/40 border border-red-800/40"
              >
                {isGeneratingTokens ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Wand2 className="w-3 h-3" />
                )}
                <span>Auto-Synthesize Tokens</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mb-2.5">
              These exact prompt tags will be prepended to every single scene generated for this character:
            </p>

            <div className="flex flex-wrap gap-1.5">
              {tokens.map((token, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 font-mono text-[10px] text-emerald-300 flex items-center gap-1"
                >
                  <span>{token}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
          >
            Cancel
          </button>
          <button
            id="save-character-bible-btn"
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-semibold text-white shadow-lg shadow-red-600/20 disabled:opacity-50"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Save Character Bible</span>
          </button>
        </div>
      </div>
    </div>
  );
};
