"use client";

import { useEffect, useRef, useState } from "react";
import { InstagramGlyph } from "@/components/ig-glyph";

// One reel: muted, looping, inline. It starts only while it is on screen and pauses when it leaves.
// With prefers-reduced-motion it never starts by itself: the poster shows with a play button.
export function ReelVideo({ src, poster, label, igHref, igHandle }: { src: string; poster?: string; label: string; igHref: string; igHandle: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) {
          v.muted = true;
          v.play().catch(() => setPlaying(false));
        } else if (!entry.isIntersecting) v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.muted = true;
      void v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-media bg-ink">
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="aspect-[9/16] w-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>

      {!playing && reduced ? (
        <button type="button" onClick={toggle} aria-label={`Play ${label}`} className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-7 w-7" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-3 pb-3 pt-16">
        <div className="pointer-events-auto flex items-center justify-between gap-2">
          <a href={igHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-w-0 items-center gap-2 rounded-pill bg-white/15 px-3 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-white/25 sm:text-sm">
            <InstagramGlyph className="h-4 w-4 shrink-0" />
            <span className="truncate">Watch more @{igHandle}</span>
          </a>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? `Pause ${label}` : `Play ${label}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25"
          >
            {playing ? (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-0.5 h-4 w-4" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <span className="pointer-events-none absolute left-3 top-3 rounded-pill bg-black/45 px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-white/90">Muted</span>
    </div>
  );
}
