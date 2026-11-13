"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

export type LightboxItem = { src: string; srcSet?: string; width?: number; height?: number; alt: string; caption?: string };

// Full screen photo viewer. Children render the grid; any element inside with data-lb-index opens
// that photo. Esc or the close button closes, arrow keys and swipes move, focus stays inside while
// open and returns to the photo that opened it, and the page behind does not scroll.
// Uses the static optimized files (public/images/_opt) only, never /_next/image.
export function Lightbox({ items, children }: { items: LightboxItem[]; children: ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const dialog = useRef<HTMLDivElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const count = items.length;

  const close = useCallback(() => setIndex(null), []);
  const go = useCallback((step: number) => setIndex((i) => (i === null ? i : (i + step + count) % count)), [count]);

  // Open on click of any [data-lb-index] inside the grid (event delegation keeps the grid server rendered).
  const onGridClick = (e: MouseEvent<HTMLDivElement>) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-lb-index]");
    if (!el) return;
    e.preventDefault();
    opener.current = el;
    setIndex(Number(el.dataset.lbIndex) || 0);
  };

  const open = index !== null;

  // Scroll lock, initial focus, and focus return.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const prevPad = document.body.style.paddingRight;
    const gap = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    closeBtn.current?.focus();
    const back = opener.current;
    return () => {
      html.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
      back?.focus();
    };
  }, [open]);

  // Keyboard: Esc, arrows, and a Tab focus trap.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Tab" && dialog.current) {
        const f = Array.from(dialog.current.querySelectorAll<HTMLElement>("button, a[href]")).filter((el) => !el.hasAttribute("disabled"));
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && (document.activeElement === first || !dialog.current.contains(document.activeElement))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close, go]);

  // Warm the next and previous photos so moving feels instant.
  useEffect(() => {
    if (index === null || count < 2) return;
    [index + 1, index - 1].forEach((i) => {
      const it = items[(i + count) % count];
      const img = new window.Image();
      if (it.srcSet) {
        img.sizes = "100vw";
        img.srcset = it.srcSet;
      }
      img.src = it.src;
    });
  }, [index, items, count]);

  const item = index !== null ? items[index] : null;

  return (
    <div onClick={onGridClick}>
      {children}
      {item && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={dialog}
              role="dialog"
              aria-modal="true"
              aria-label={`Photo ${index! + 1} of ${count}`}
              className="fixed inset-0 z-[60] flex flex-col bg-black/90 text-white backdrop-blur-sm"
              onClick={(e) => {
                if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.lbBackdrop) close();
              }}
              onTouchStart={(e) => {
                const t = e.touches[0];
                touch.current = { x: t.clientX, y: t.clientY };
              }}
              onTouchEnd={(e) => {
                const start = touch.current;
                touch.current = null;
                if (!start) return;
                const t = e.changedTouches[0];
                const dx = t.clientX - start.x;
                const dy = t.clientY - start.y;
                if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) go(dx < 0 ? 1 : -1);
                else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.5) close();
              }}
            >
              <div className="flex items-center justify-between px-4 py-3 text-sm text-white/80 sm:px-6">
                <span aria-live="polite">
                  {index! + 1} / {count}
                </span>
                <button ref={closeBtn} type="button" onClick={close} aria-label="Close photo" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <div data-lb-backdrop="1" className="relative flex min-h-0 flex-1 items-center justify-center px-3 sm:px-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={item.src}
                  src={item.src}
                  srcSet={item.srcSet}
                  sizes="100vw"
                  width={item.width}
                  height={item.height}
                  alt={item.alt}
                  decoding="async"
                  className="h-auto max-h-[calc(100svh-8.5rem)] w-auto max-w-full select-none rounded-md object-contain"
                  draggable={false}
                />
                {count > 1 ? (
                  <>
                    <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 hover:bg-black/65 sm:left-4 sm:bg-white/10 sm:hover:bg-white/20">
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 5l-7 7 7 7" />
                      </svg>
                    </button>
                    <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 hover:bg-black/65 sm:right-4 sm:bg-white/10 sm:hover:bg-white/20">
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                ) : null}
              </div>
              <p className="min-h-12 px-5 py-3 text-center text-sm text-white/80">{item.caption ?? ""}</p>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
