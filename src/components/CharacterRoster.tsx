import React, { useState } from 'react';
import { Users, Plus, ShieldCheck, Sparkles, Wand2, Film, CheckCircle2, Edit, Cpu } from 'lucide-react';
import { CharacterProfile } from '../types';
import { CharacterBibleModal } from './CharacterBibleModal';
import { ImportGoogleFlowModal } from './ImportGoogleFlowModal';

interface CharacterRosterProps {
  characters: CharacterProfile[];
  onSaveCharacter: (char: CharacterProfile) => void;
  onSelectCharacterForProject: (charId: string) => void;
  activeCharacterId?: string;
}

export const CharacterRoster: React.FC<CharacterRosterProps> = ({
  characters,
  onSaveCharacter,
  onSelectCharacterForProject,
  activeCharacterId
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);
  const [editingChar, setEditingChar] = useState<CharacterProfile | null>(null);

  const handleCreateNew = () => {
    setEditingChar(null);
    setIsModalOpen(true);
  };

  const handleEdit = (char: CharacterProfile) => {
    setEditingChar(char);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Consistent Character Bible Roster
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Eliminate character hallucination and face-shifting across YouTube episodes.
            Each avatar locks style seeds, physical tokens, and signature clothing across Google Flow and Veo prompts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            id="import-google-flow-char-btn"
            onClick={() => setIsFlowModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all"
          >
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>Import from Google Flow</span>
          </button>

          <button
            id="create-new-character-btn"
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Character</span>
          </button>
        </div>
      </div>

      {/* Grid of Characters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((char) => {
          const isSelected = char.id === activeCharacterId;

          return (
            <div
              key={char.id}
              className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all flex flex-col ${
                isSelected
                  ? 'border-red-500 ring-1 ring-red-500/50 shadow-lg shadow-red-900/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Image Header */}
              <div className="relative h-48 bg-slate-950 overflow-hidden group">
                <img
                  src={char.avatarUrl}
                  alt={char.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Seed Locked</span>
                  </span>
                  {char.isPreset && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-medium">
                      Studio Preset
                    </span>
                  )}
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(char)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700/60 backdrop-blur-xs transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>

                {/* Name & Role on bottom of image */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-base font-bold text-white drop-shadow-sm">{char.name}</h3>
                  <p className="text-xs text-slate-300 line-clamp-1">{char.role}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5 text-xs text-slate-300">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                    Art Style & Engine
                  </span>
                  <p className="text-slate-200 mt-0.5 line-clamp-2 leading-relaxed">
                    {char.artStyle}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                    Signature Outfit (Locked)
                  </span>
                  <p className="text-slate-300 mt-0.5 line-clamp-1">
                    {char.signatureOutfit}
                  </p>
                </div>

                {/* Tokens pill list */}
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1 block">
                    Active Consistency Tokens
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-16 overflow-hidden">
                    {char.consistencyTokens.slice(0, 4).map((tok, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[9px] text-emerald-400"
                      >
                        {tok}
                      </span>
                    ))}
                    {char.consistencyTokens.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[9px]">
                        +{char.consistencyTokens.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectCharacterForProject(char.id)}
                    className={`w-full py-2 px-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active for Current Project</span>
                      </>
                    ) : (
                      <>
                        <Film className="w-3.5 h-3.5" />
                        <span>Use for Current Video</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <CharacterBibleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveCharacter={onSaveCharacter}
        editingCharacter={editingChar}
      />

      <ImportGoogleFlowModal
        isOpen={isFlowModalOpen}
        onClose={() => setIsFlowModalOpen(false)}
        onSaveCharacter={(newChar) => {
          onSaveCharacter(newChar);
          setIsFlowModalOpen(false);
        }}
      />
    </div>
  );
};
