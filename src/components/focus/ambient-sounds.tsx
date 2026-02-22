"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface Sound {
  id: string;
  label: string;
  emoji: string;
}

const sounds: Sound[] = [
  { id: "rain", label: "Rain", emoji: "\u{1F327}" },
  { id: "cafe", label: "Caf\u00E9", emoji: "\u2615" },
  { id: "whitenoise", label: "White Noise", emoji: "\u{1F50A}" },
  { id: "forest", label: "Forest", emoji: "\u{1F332}" },
  { id: "ocean", label: "Ocean", emoji: "\u{1F30A}" },
];

const STORAGE_KEY = "focusflow-ambient-sounds";

export function AmbientSounds() {
  const [activeSounds, setActiveSounds] = useState<Record<string, number>>({});
  const [masterMuted, setMasterMuted] = useState(false);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setActiveSounds(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activeSounds));
  }, [activeSounds]);

  const getOrCreateAudio = useCallback((id: string) => {
    if (!audioRefs.current[id]) {
      const audio = new Audio(`/sounds/${id}.mp3`);
      audio.loop = true;
      audio.volume = 0;
      audioRefs.current[id] = audio;
    }
    return audioRefs.current[id];
  }, []);

  const toggleSound = useCallback(
    (id: string) => {
      const isActive = id in activeSounds;
      if (isActive) {
        const audio = audioRefs.current[id];
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        const next = { ...activeSounds };
        delete next[id];
        setActiveSounds(next);
      } else {
        const audio = getOrCreateAudio(id);
        audio.volume = masterMuted ? 0 : 0.5;
        audio.play().catch(() => {});
        setActiveSounds({ ...activeSounds, [id]: 0.5 });
      }
    },
    [activeSounds, masterMuted, getOrCreateAudio]
  );

  const setVolume = useCallback(
    (id: string, volume: number) => {
      const audio = audioRefs.current[id];
      if (audio) {
        audio.volume = masterMuted ? 0 : volume;
      }
      setActiveSounds({ ...activeSounds, [id]: volume });
    },
    [activeSounds, masterMuted]
  );

  const toggleMute = useCallback(() => {
    const newMuted = !masterMuted;
    setMasterMuted(newMuted);
    Object.entries(activeSounds).forEach(([id, vol]) => {
      const audio = audioRefs.current[id];
      if (audio) audio.volume = newMuted ? 0 : vol;
    });
  }, [masterMuted, activeSounds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  const hasActive = Object.keys(activeSounds).length > 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Ambient Sounds
        </h3>
        {hasActive && (
          <button
            onClick={toggleMute}
            className="rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            {masterMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {sounds.map(({ id, label, emoji }) => {
          const isActive = id in activeSounds;
          return (
            <div key={id} className="flex flex-col items-center gap-1">
              <button
                onClick={() => toggleSound(id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-all",
                  isActive
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                )}
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </button>
              {isActive && (
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={activeSounds[id]}
                  onChange={(e) =>
                    setVolume(id, parseFloat(e.target.value))
                  }
                  className="h-1 w-16 accent-indigo-600"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
