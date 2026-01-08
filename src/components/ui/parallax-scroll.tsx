"use client";

import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

// shadcn/ui components live in /components/ui to standardize imports, keep tree-shaking effective, and maintain consistency.

type ParallaxScrollProps = {
  images: string[];
  className?: string;
};

function splitIntoColumns(images: string[]): [string[], string[], string[]] {
  const columns: [string[], string[], string[]] = [[], [], []];
  images.forEach((img, idx) => {
    columns[idx % 3].push(img);
  });
  return columns;
}

export default function ParallaxScroll({ images, className }: ParallaxScrollProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const [colA, colB, colC] = useMemo(() => splitIntoColumns(images), [images]);

  // Increased ranges for snappier/faster parallax movement per scroll
  const yA = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]);
  const yB = useTransform(scrollYProgress, [0, 1], ["-8%", "-75%"]);
  const yC = useTransform(scrollYProgress, [0, 1], ["-16%", "-55%"]);

  const columns = [
    { images: colA, y: yA },
    { images: colB, y: yB },
    { images: colC, y: yC },
  ];

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-[720px] overflow-hidden bg-background/70 backdrop-blur-sm clip-corner",
        "shadow-[0_15px_50px_-30px_rgba(0,0,0,0.8)]",
        "[mask-image:linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,1)_8%,rgba(0,0,0,1)_92%,rgba(0,0,0,0))]",
        className
      )}
    >
      {/* subtle scanlines / noise overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(0deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:100%_8px]" />
      <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-[0.05] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.35)_0,transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(120deg,rgba(132,56,255,0.08),transparent,rgba(0,255,255,0.06))]" />
      {/* top/bottom fade overlays */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background/95 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/95 to-transparent z-20" />

      <div className="relative h-full w-full px-4 sm:px-6">
        <div className="mx-auto flex h-full max-w-7xl gap-4 sm:gap-6">
          {columns.map((column, colIdx) => (
            <motion.div
              key={colIdx}
              style={{ y: column.y }}
              className="flex-1 space-y-4 sm:space-y-6"
            >
              {column.images.map((src, idx) => (
                <motion.div
                  key={`${src}-${idx}`}
                  whileHover={{
                    x: [0, -2, 2, -1, 1, 0],
                    filter: ["none", "hue-rotate(3deg)", "none"],
                    transition: { duration: 0.35, ease: "easeInOut" },
                  }}
                  className="group relative overflow-hidden border border-primary/40 bg-card/85 shadow-[0_20px_60px_-32px_rgba(96,54,255,0.65)] clip-corner transition-colors duration-300 hover:border-primary/80"
                >
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-200 mix-blend-screen bg-[linear-gradient(120deg,transparent,rgba(132,56,255,0.4),transparent)]" />
                  <img
                    src={src}
                    alt="Parallax item"
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:[image-rendering:pixelated] sm:h-56 md:h-64"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-70 transition duration-200"
                    style={{
                      mixBlendMode: "screen",
                      backgroundImage:
                        "repeating-linear-gradient(90deg, rgba(255,0,128,0.15), rgba(255,0,128,0.15) 1px, transparent 1px, transparent 3px)",
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-25 transition duration-150"
                    style={{
                      background:
                        "repeating-linear-gradient(0deg, rgba(255,255,255,0.12) 0, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 6px)",
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
