"use client";

import { useState } from "react";

const STOPS = [
  {
    id: "midnight",
    label: "Midnight",
    color: "#12233f",
    sectionClass: "svc-hero-bg-midnight",
  },
  {
    id: "amber",
    label: "Amber",
    color: "#f2c94c",
    sectionClass: "svc-hero-bg-amber",
  },
  {
    id: "frost",
    label: "Frost",
    color: "#eef3f5",
    sectionClass: "svc-hero-bg-frost",
  },
] as const;

const LABEL_COLOR_ON_DARK = "#f3f1ea";
const LABEL_COLOR_ON_LIGHT = "#20242b";

type Props = {
  children: React.ReactNode;
};

/**
 * Color Choice Slider: a glowing-glass horizontal track with 3 fixed stops.
 * Each stop tiles one third of the track, so a click anywhere on it always
 * lands on one of them and snaps the thumb there — no drag math needed.
 * Content/animation stay untouched in `children`; this only ever swaps the
 * section's background class and the `data-hero-bg` attribute that
 * globals.css reads to repaint the copy's text color per stop.
 */
export function ServicesHeroBackgroundStage({ children }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = STOPS[activeIndex];
  const labelColor =
    active.id === "midnight" ? LABEL_COLOR_ON_DARK : LABEL_COLOR_ON_LIGHT;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, STOPS.length - 1));
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    }
  };

  return (
    <section
      aria-labelledby="services-hero-title"
      data-hero-bg={active.id}
      className={`relative overflow-hidden transition-[background] duration-500 ${active.sectionClass}`}
    >
      <div aria-hidden="true" className="svc-grid-lines absolute inset-0" />

      <div
        role="radiogroup"
        aria-label="Preview hero background"
        onKeyDown={handleKeyDown}
        className="absolute right-4 top-24 z-20 grid h-14 w-[264px] grid-cols-3 rounded-full border border-white/25 bg-black/25 p-1 backdrop-blur-md sm:right-6 sm:top-28 lg:right-8"
      >
        <div
          aria-hidden="true"
          className="svc-bg-slider-thumb pointer-events-none absolute inset-y-1 left-1 w-[calc((100%-8px)/3)] rounded-full transition-transform duration-500 ease-out"
          style={
            {
              transform: `translateX(${activeIndex * 100}%)`,
              backgroundColor: active.color,
              "--svc-slider-glow": active.color,
            } as React.CSSProperties
          }
        />

        {STOPS.map((stop, index) => (
          <button
            key={stop.id}
            type="button"
            role="radio"
            aria-checked={activeIndex === index}
            aria-label={`Preview on ${stop.label} background`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            className="relative z-10 flex flex-col items-center justify-center gap-1 focus-visible:outline-none"
          >
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full transition-opacity duration-300"
              style={{
                backgroundColor: stop.color,
                opacity: activeIndex === index ? 0 : 1,
              }}
            />
            <span
              className="text-[10px] font-semibold uppercase tracking-wide transition-colors duration-500"
              style={{ color: labelColor }}
            >
              {stop.label}
            </span>
          </button>
        ))}
      </div>

      {children}
    </section>
  );
}
