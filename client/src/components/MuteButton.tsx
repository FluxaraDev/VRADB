import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isMusicMuted, setMusicMuted } from "@/lib/music";

/**
 * Mute/unmute toggle for the site's background music.
 * The choice is saved (localStorage) and applied to the hidden
 * audio player immediately.
 */
export default function MuteButton() {
  const [muted, setMuted] = useState<boolean>(() => isMusicMuted());

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setMusicMuted(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={muted}
      title={muted ? "Unmute site music" : "Mute site music"}
      className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
    >
      {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
      {muted ? "MUSIC MUTED" : "MUTE MUSIC"}
    </button>
  );
}
