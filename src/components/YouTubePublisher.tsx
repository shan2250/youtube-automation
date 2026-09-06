import React, { useState } from 'react';
import {
  Youtube,
  Upload,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Copy,
  Check,
  Tag,
  Clock,
  Eye,
  Lock,
  Globe,
  Radio,
  FileText
} from 'lucide-react';
import { VideoProject, ChannelProfile } from '../types';

interface YouTubePublisherProps {
  project: VideoProject;
  channel: ChannelProfile;
  onUpdateProject: (updated: Partial<VideoProject>) => void;
  onPublishSuccess: (result: any) => void;
}

export const YouTubePublisher: React.FC<YouTubePublisherProps> = ({
  project,
  channel,
  onUpdateProject,
  onPublishSuccess
}) => {
  const [privacy, setPrivacy] = useState<'public' | 'scheduled' | 'unlisted' | 'private'>('public');
  const [scheduledDate, setScheduledDate] = useState('Tomorrow at 14:00 GMT');
  const [selectedTitle, setSelectedTitle] = useState(project.seo.youtubeTitle);
  const [description, setDescription] = useState(project.seo.description);
  const [tags, setTags] = useState<string[]>(project.seo.tags);
  const [newTagInput, setNewTagInput] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [copiedChapters, setCopiedChapters] = useState(false);
  const [publishResult, setPublishResult] = useState<any>(project.youtubeUpload?.status === 'published' ? project.youtubeUpload : null);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(newTagInput.trim())) {
        const updated = [...tags, newTagInput.trim()];
        setTags(updated);
        onUpdateProject({
          seo: { ...project.seo, tags: updated }
        });
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = tags.filter((t) => t !== tagToRemove);
    setTags(updated);
    onUpdateProject({
      seo: { ...project.seo, tags: updated }
    });
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch('/api/youtube/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedTitle,
          description,
          tags,
          privacy,
          scheduledTime: privacy === 'scheduled' ? scheduledDate : undefined,
          thumbnailUrl: project.thumbnailUrl,
          category: project.seo.category
        })
      });
      const data = await res.json();
      setPublishResult(data);
      onUpdateProject({
        status: 'published',
        youtubeUpload: {
          status: data.status,
          privacy,
          scheduledTime: privacy === 'scheduled' ? scheduledDate : undefined,
          youtubeId: data.youtubeId,
          youtubeUrl: data.youtubeUrl,
          publishedAt: data.uploadedAt
        }
      });
      onPublishSuccess(data);
    } catch (e) {
      console.error(e);
      alert('Error publishing to YouTube');
    } finally {
      setIsPublishing(false);
    }
  };

  const copyChapters = () => {
    const chapterText = project.seo.chapters.map((c) => `${c.time} - ${c.title}`).join('\n');
    navigator.clipboard.writeText(chapterText);
    setCopiedChapters(true);
    setTimeout(() => setCopiedChapters(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-md shadow-red-600/30">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-base font-bold text-white">
                YouTube Publishing & Metadata Optimizer
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Automated Title A/B scoring, synchronized chapter markers, viral tags, and direct channel push
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                SEO Score
              </span>
              <span className="text-lg font-black text-emerald-400">{project.seo.seoScore}/100</span>
            </div>
            <div className="text-right hidden sm:block border-l border-slate-800 pl-3">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                Est. CTR
              </span>
              <span className="text-lg font-black text-blue-400">{project.seo.estimatedCTR}</span>
            </div>
          </div>
        </div>

        {/* Live Published Success Notification */}
        {publishResult && (
          <div className="mt-5 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-emerald-300">
                  {publishResult.status === 'scheduled'
                    ? 'Video Successfully Scheduled on YouTube!'
                    : 'Video Successfully Pushed to YouTube!'}
                </p>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Assigned Video ID:{' '}
                  <span className="font-mono text-emerald-400 font-bold">
                    {publishResult.youtubeId}
                  </span>{' '}
                  • Privacy: <span className="capitalize font-semibold">{publishResult.privacy}</span>
                </p>
              </div>
            </div>

            <a
              href={publishResult.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors self-start sm:self-auto"
            >
              <span>View on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Main Publishing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Title variations & Description */}
        <div className="lg:col-span-8 space-y-5">
          {/* Title Variations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <label className="text-xs font-bold text-slate-200 block">
              Choose High-CTR Video Title
            </label>

            <div className="space-y-2">
              <div
                onClick={() => setSelectedTitle(project.seo.youtubeTitle)}
                className={`p-3 rounded-xl border cursor-pointer text-xs transition-all flex items-center justify-between ${
                  selectedTitle === project.seo.youtubeTitle
                    ? 'bg-red-500/10 border-red-500/40 text-white font-medium'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{project.seo.youtubeTitle}</span>
                {selectedTitle === project.seo.youtubeTitle && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                    Primary
                  </span>
                )}
              </div>

              {project.seo.alternativeTitles?.map((alt, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedTitle(alt)}
                  className={`p-3 rounded-xl border cursor-pointer text-xs transition-all flex items-center justify-between ${
                    selectedTitle === alt
                      ? 'bg-red-500/10 border-red-500/40 text-white font-medium'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{alt}</span>
                  {selectedTitle === alt && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                      Selected
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description with Chapters */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-200">
                YouTube Description & Auto-Generated Chapter Markers
              </label>
              <button
                onClick={copyChapters}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
              >
                {copiedChapters ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedChapters ? 'Copied!' : 'Copy Timestamps'}</span>
              </button>
            </div>

            <textarea
              rows={8}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                onUpdateProject({ seo: { ...project.seo, description: e.target.value } });
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 font-mono text-[11px] focus:outline-none focus:border-red-500 leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-200 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-red-400" />
                <span>Search Tags ({tags.length}/15)</span>
              </label>
              <span className="text-[11px] text-slate-400">Press Enter to add tag</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-1.5 font-medium"
                >
                  <span>#{t}</span>
                  <button
                    onClick={() => handleRemoveTag(t)}
                    className="text-slate-400 hover:text-red-400 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag and press enter..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Right Column: Upload Settings & Direct Push */}
        <div className="lg:col-span-4 space-y-5">
          {/* Thumbnail Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <label className="text-xs font-bold text-slate-200 block">
              YouTube Thumbnail Preview
            </label>
            <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-slate-700">
              <img
                src={project.thumbnailUrl || project.scenes[0]?.imageUrl}
                alt="Thumbnail"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-[10px] font-bold text-white">
                02:15
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Prompt: {project.thumbnailPrompt}
            </p>
          </div>

          {/* Publishing Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
            <label className="font-bold text-slate-200 block">Visibility & Schedule</label>

            <div className="space-y-2">
              <label
                onClick={() => setPrivacy('public')}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                  privacy === 'public'
                    ? 'bg-red-500/10 border-red-500/40 text-white'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                }`}
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="font-semibold text-xs">Public</p>
                  <p className="text-[10px] text-slate-400">Push live immediately to channel</p>
                </div>
              </label>

              <label
                onClick={() => setPrivacy('scheduled')}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                  privacy === 'scheduled'
                    ? 'bg-red-500/10 border-red-500/40 text-white'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                }`}
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="font-semibold text-xs">Schedule Upload</p>
                  <p className="text-[10px] text-slate-400">Automated queue drop</p>
                </div>
              </label>

              {privacy === 'scheduled' && (
                <div className="pt-2">
                  <input
                    type="text"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    placeholder="e.g. Tomorrow at 14:00 GMT"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs"
                  />
                </div>
              )}

              <label
                onClick={() => setPrivacy('unlisted')}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                  privacy === 'unlisted'
                    ? 'bg-red-500/10 border-red-500/40 text-white'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                }`}
              >
                <Eye className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="font-semibold text-xs">Unlisted</p>
                  <p className="text-[10px] text-slate-400">Only accessible via direct link</p>
                </div>
              </label>
            </div>

            {/* Target Channel */}
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px]">
              <span className="text-slate-400 block mb-0.5">Publishing Channel:</span>
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <span>{channel.name} ({channel.handle})</span>
              </span>
            </div>

            {/* Primary Push Button */}
            <button
              id="publish-to-youtube-btn"
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <Radio className="w-4 h-4 animate-spin" />
                  <span>Processing Upload & Assembly...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>
                    {privacy === 'scheduled' ? 'Confirm Schedule Upload' : 'Publish to YouTube Now'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
