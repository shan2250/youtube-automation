import React, { useState, useEffect } from 'react';
import {
  Settings,
  Youtube,
  Cpu,
  Volume2,
  Sparkles,
  ShieldCheck,
  Check,
  Radio,
  Sliders,
  RefreshCw,
  TrendingUp,
  ExternalLink,
  Users,
  Eye,
  Video,
  KeyRound
} from 'lucide-react';
import { ChannelProfile } from '../types';

interface ChannelSettingsProps {
  channel: ChannelProfile;
  onUpdateChannel: (updated: Partial<ChannelProfile>) => void;
}

export const ChannelSettings: React.FC<ChannelSettingsProps> = ({
  channel,
  onUpdateChannel
}) => {
  const [name, setName] = useState(channel.name);
  const [handle, setHandle] = useState(channel.handle);
  const [niche, setNiche] = useState(channel.niche);
  const [voice, setVoice] = useState(channel.defaultVoice);
  const [privacy, setPrivacy] = useState(channel.defaultPrivacy);
  const [saved, setSaved] = useState(false);

  // YouTube API status state
  const [apiStatus, setApiStatus] = useState<{
    loading: boolean;
    connected?: boolean;
    maskedKey?: string;
    message?: string;
    error?: string;
  }>({ loading: false });

  // Real YouTube Channel fetch state
  const [isFetchingChannel, setIsFetchingChannel] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  // Trending videos state
  const [trendingVideos, setTrendingVideos] = useState<any[]>([]);
  const [loadingTrends, setLoadingTrends] = useState(false);

  // Check YouTube API key status on mount
  useEffect(() => {
    checkApiKeyStatus();
    fetchTrendingTopics();
  }, []);

  const checkApiKeyStatus = async () => {
    setApiStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/youtube/status');
      const data = await res.json();
      setApiStatus({
        loading: false,
        connected: data.connected,
        maskedKey: data.maskedKey,
        message: data.message,
        error: data.error
      });
    } catch (e: any) {
      setApiStatus({
        loading: false,
        connected: false,
        error: e.message
      });
    }
  };

  const fetchTrendingTopics = async () => {
    setLoadingTrends(true);
    try {
      const res = await fetch('/api/youtube/trends');
      const data = await res.json();
      if (data.trends) {
        setTrendingVideos(data.trends);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTrends(false);
    }
  };

  const syncChannelFromYouTube = async () => {
    setIsFetchingChannel(true);
    setSyncSuccessMessage(null);
    try {
      const queryParam = handle.startsWith('@') ? `handle=${encodeURIComponent(handle)}` : `handle=@${encodeURIComponent(handle)}`;
      const res = await fetch(`/api/youtube/channel-info?${queryParam}`);
      const data = await res.json();

      if (data.error) {
        alert(`YouTube Channel Lookup: ${data.error}`);
      } else {
        setName(data.title || name);
        if (data.customUrl) setHandle(data.customUrl);

        onUpdateChannel({
          name: data.title || name,
          handle: data.customUrl || handle,
          subscribers: data.subscriberCount ? `${(data.subscriberCount / 1000).toFixed(1)}K` : channel.subscribers,
          avatarUrl: data.avatarUrl || channel.avatarUrl
        });

        setSyncSuccessMessage(
          `Successfully connected to "${data.title}" (${data.subscriberCount.toLocaleString()} subscribers, ${data.videoCount} videos)!`
        );
        setTimeout(() => setSyncSuccessMessage(null), 5000);
      }
    } catch (e: any) {
      alert(`Error querying YouTube API: ${e.message}`);
    } finally {
      setIsFetchingChannel(false);
    }
  };

  const handleSave = () => {
    onUpdateChannel({
      name,
      handle,
      niche,
      defaultVoice: voice,
      defaultPrivacy: privacy
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-xs text-slate-200">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Channel Profile & YouTube Data API
              </h1>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify live YouTube API credentials, synchronize channel analytics, and configure AI automation defaults.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={checkApiKeyStatus}
              disabled={apiStatus.loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${apiStatus.loading ? 'animate-spin' : ''}`} />
              <span>Verify API Key</span>
            </button>
          </div>
        </div>
      </div>

      {/* YouTube Data API v3 Live Status Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">YouTube Data API v3 Status</h2>
          </div>

          <div>
            {apiStatus.connected ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                API Key Connected & Active
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Key Configured in Secrets
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
              Active API Key
            </span>
            <span className="font-mono text-xs text-white font-bold">
              {apiStatus.maskedKey || 'Configured via Settings > Secrets'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
              API Quota & Endpoints
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              Channels, Videos, Uploads
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
              Publishing Mode
            </span>
            <span className="text-xs text-blue-400 font-semibold">
              Live & Scheduled Automated Queue
            </span>
          </div>
        </div>

        {syncSuccessMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Target YouTube Channel Card with Live Sync */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Youtube className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-bold text-white">Target YouTube Channel</h2>
          </div>

          <button
            onClick={syncChannelFromYouTube}
            disabled={isFetchingChannel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/15 hover:bg-red-600/25 text-red-400 border border-red-500/30 font-semibold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingChannel ? 'animate-spin' : ''}`} />
            <span>Sync from YouTube API</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Channel Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Channel Handle (e.g. @MrBeast or @YourHandle)
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Content Niche / Category</label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Channel Stats Preview</label>
            <div className="flex items-center gap-3 p-2 bg-slate-800/60 border border-slate-700/60 rounded-lg">
              <img
                src={channel.avatarUrl}
                alt={channel.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
                referrerPolicy="no-referrer"
              />
              <div className="text-[11px]">
                <p className="font-bold text-white">{name}</p>
                <p className="text-slate-400">{channel.subscribers} Subscribers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Viral Topics (Live from YouTube API) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">
              Trending Viral Video Topics (YouTube API Feed)
            </h2>
          </div>
          <button
            onClick={fetchTrendingTopics}
            disabled={loadingTrends}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${loadingTrends ? 'animate-spin' : ''}`} />
            <span>Refresh Trends</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {trendingVideos.map((trend, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-start gap-3 hover:border-slate-600 transition-colors"
            >
              <div className="w-6 h-6 rounded-md bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0">
                #{i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-xs truncate">{trend.title}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span>{trend.views}</span>
                  {trend.channelTitle && (
                    <>
                      <span>•</span>
                      <span className="truncate">{trend.channelTitle}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Model AI Engine & Voice */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Volume2 className="w-4 h-4 text-amber-400" />
          <span>Default Voice Actor & Visibility</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Primary Narrator Voice</label>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
            >
              <option value="Kore">Kore - Warm, Trustworthy & Clear (Recommended)</option>
              <option value="Fenrir">Fenrir - Deep, Authoritative Documentary Voice</option>
              <option value="Puck">Puck - Youthful, High-Energy & Punchy (Great for Shorts)</option>
              <option value="Zephyr">Zephyr - Smooth Commercial Narrator</option>
              <option value="Charon">Charon - Dramatic & Mysterious</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Default Upload Visibility</label>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
            >
              <option value="public">Public (Immediate Live)</option>
              <option value="scheduled">Scheduled Queue Drop</option>
              <option value="unlisted">Unlisted (Review First)</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          {saved && (
            <span className="text-emerald-400 text-xs flex items-center gap-1">
              <Check className="w-4 h-4" />
              <span>Settings saved successfully</span>
            </span>
          )}
          <button
            id="save-channel-settings-btn"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
