import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Upload,
  Image as ImageIcon,
  RotateCw,
  ShieldCheck,
  Check,
  Cpu
} from 'lucide-react';
import { CharacterProfile } from '../types';

interface ImportGoogleFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCharacter: (char: CharacterProfile) => void;
}

export const ImportGoogleFlowModal: React.FC<ImportGoogleFlowModalProps> = ({
  isOpen,
  onClose,
  onSaveCharacter
}) => {
  const [name, setName] = useState('Dr. Maya Lin');
  const [role, setRole] = useState('AI Technology Host');
  const [artStyle, setArtStyle] = useState('Pixar 3D CGI Animation');
  const [googleFlowPrompt, setGoogleFlowPrompt] = useState(
    'Pixar 3D stylized character portrait, charismatic female tech presenter with sleek dark bob haircut, wearing crimson blazer over black turtleneck, subtle studio rim lighting, 8k octane render, seed #88412'
  );
  const [seedNumber, setSeedNumber] = useState('#88412');
  const [avatarUrl, setAvatarUrl] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImportCharacter = async () => {
    if (!name.trim()) return;
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/import-google-flow-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          role,
          artStyle,
          googleFlowPrompt,
          seedNumber,
          imageUrl: avatarUrl
        })
      });

      const data = await res.json();
      if (data.error) {
        setErrorMessage(data.error);
      } else {
        const newChar: CharacterProfile = {
          id: data.id || `char-flow-${Date.now()}`,
          name: data.name || name,
          role: data.role || role,
          artStyle: data.artStyle || artStyle,
          genderOrArchetype: 'Digital Host Presenter',
          hairColorAndStyle: data.hairColorAndStyle || 'Custom locked haircut',
          facialFeatures: data.facialFeatures || 'Consistent facial topology',
          signatureOutfit: data.signatureOutfit || 'Signature creator jacket',
          distinctiveProps: data.distinctiveProps || 'Titanium glasses',
          seedNumber: seedNumber || '#88412',
          avatarUrl: avatarUrl,
          avatarVisualPrompt: data.googleFlowPrompt || googleFlowPrompt,
          consistencyTokens: data.consistencyTokens || [
            `char_${name.toLowerCase().replace(/\s+/g, '_')}_seed`,
            artStyle,
            `seed_${seedNumber.replace('#', '')}`,
            'consistent facial structure',
            'studio lighting 8k'
          ]
        };

        onSaveCharacter(newChar);
        onClose();
      }
    } catch (e: any) {
      setErrorMessage(`Error importing character: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-5 text-xs text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Import Google Flow Character</h2>
              <p className="text-[11px] text-slate-400">
                Lock facial geometry, art style, and seed tokens from your Google Flow generation
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

        {/* Form Body */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Character Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Channel Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Art Style</label>
              <select
                value={artStyle}
                onChange={(e) => setArtStyle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
              >
                <option value="Pixar 3D CGI Animation">Pixar 3D CGI Animation</option>
                <option value="Hyperrealistic 8K Cinematic">Hyperrealistic 8K Cinematic</option>
                <option value="Studio Ghibli Anime">Studio Ghibli Anime</option>
                <option value="Cyberpunk Neon Digital Art">Cyberpunk Neon Digital Art</option>
                <option value="Modern Flat Vector Illustration">Modern Flat Vector Illustration</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Google Flow Seed # (Optional)
              </label>
              <input
                type="text"
                value={seedNumber}
                onChange={(e) => setSeedNumber(e.target.value)}
                placeholder="e.g. #88412"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>
          </div>

          {/* Master Google Flow Prompt */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Google Flow Master Prompt / Description:
            </label>
            <textarea
              rows={3}
              value={googleFlowPrompt}
              onChange={(e) => setGoogleFlowPrompt(e.target.value)}
              placeholder="Paste the exact prompt you used in Google Flow to generate this character..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs font-mono focus:outline-none focus:border-red-500 leading-relaxed"
            />
          </div>

          {/* Avatar Upload / Preview */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Character Reference Image (Google Flow Output)
            </label>
            <div className="flex items-center gap-3 p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 space-y-1.5 min-w-0">
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Paste Image URL or choose file..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-[11px] truncate focus:outline-none focus:border-red-500"
                />
                <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer font-semibold text-[10px] transition-colors">
                  <Upload className="w-3 h-3" />
                  <span>Upload Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <p className="text-[11px] text-slate-400">
            Will anchor seed tokens to prevent face morphing across video cuts.
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
              type="button"
              onClick={handleImportCharacter}
              disabled={isProcessing || !name.trim()}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Locking Consistency Tokens...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Save to Character Bible</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
