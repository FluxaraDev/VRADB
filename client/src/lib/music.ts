/**
 * Site music mute state — saved in localStorage so the choice
 * survives reloads and page changes.
 */
export const MUSIC_MUTE_KEY = "nova-music-muted";

export function isMusicMuted(): boolean {
  try {
    return localStorage.getItem(MUSIC_MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function storeMusicMuted(muted: boolean) {
  try {
    localStorage.setItem(MUSIC_MUTE_KEY, muted ? "1" : "0");
  } catch {
    /* storage unavailable — mute just won't persist */
  }
}

function playerWindow(): any {
  const iframe = document.getElementById(
    "hiddenAudioIframe"
  ) as HTMLIFrameElement | null;
  return iframe?.contentWindow as any;
}

/** Push the mute state into the hidden audio player (volume 0 = muted). */
export function applyMuteToPlayer(muted: boolean) {
  const win = playerWindow();
  if (!win) return;
  if (typeof win.setHiddenAudioVolume === "function") {
    win.setHiddenAudioVolume(muted ? 0 : 1);
  } else {
    win.postMessage?.(
      { type: "MANUS_HIDDEN_AUDIO", action: "setVolume", volume: muted ? 0 : 1 },
      "*"
    );
  }
}

export function setMusicMuted(muted: boolean) {
  storeMusicMuted(muted);
  applyMuteToPlayer(muted);
}
