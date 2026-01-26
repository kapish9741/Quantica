"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { X } from "lucide-react";

export default function ExpandableCardDemo() {
    const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
        null
    );
    const id = useId();
    const ref = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setActive(false);
            }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [active]);

    useOutsideClick(ref, () => setActive(null));

    const handleMouseEnter = (card: (typeof cards)[number]) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setActive(card);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActive(null);
        }, 100);
    };

    return (
        <ul className="max-w-[90%] mx-auto w-full grid grid-cols-1 md:grid-cols-3 items-start gap-8 py-10 relative px-8">
            {cards.map((card, index) => (
                <div key={card.title} className="relative h-[450px] w-full"> {/* Placeholder wrapper */}
                    <motion.div
                        layoutId={`card-${card.title}-${id}`}
                        onMouseEnter={() => handleMouseEnter(card)}
                        onMouseLeave={handleMouseLeave}
                        className={`flex flex-col bg-[#050816] pixel-border border-white/20 cursor-pointer overflow-hidden transition-colors duration-300 group
                ${active === card ? "absolute inset-0 z-50 h-[500px] w-[110%] -left-[5%] -top-[10%] shadow-[8px_8px_0px_#9d4edd] border-[#9d4edd]" : "relative h-full w-full hover:border-[#9d4edd] shadow-none"}
            `}
                    >
                        <div className="relative z-10 flex-shrink-0">
                            <motion.div layoutId={`image-${card.title}-${id}`} className={`overflow-hidden p-1 transition-all duration-300 ${active === card ? 'pixel-border border-[#9d4edd] m-4 bg-black h-48' : 'h-80 border-transparent'}`}>
                                <img
                                    src={card.src}
                                    alt={card.title}
                                    className={`w-full object-cover object-top transition-all duration-500 ${active === card ? 'h-full scale-100' : 'h-full grayscale group-hover:grayscale-0'}`}
                                    style={{ imageRendering: 'pixelated' }}
                                />
                            </motion.div>
                        </div>

                        <div className={`flex flex-col text-center px-4 transition-all duration-300 flex-grow ${active === card ? 'pt-2 pb-6' : 'justify-between py-4'}`}>
                            <div>
                                <motion.h3
                                    layoutId={`title-${card.title}-${id}`}
                                    className={`font-bold uppercase tracking-wider text-white transition-colors leading-relaxed ${active === card ? 'text-lg mb-2' : 'text-2xl group-hover:text-primary'}`}
                                    style={{ fontFamily: '"Press Start 2P", cursive' }}
                                >
                                    {card.title}
                                </motion.h3>
                                <motion.p
                                    layoutId={`description-${card.description}-${id}`}
                                    className={`font-mono uppercase tracking-widest transition-all ${active === card ? 'text-[#9d4edd] text-[10px] mb-4' : 'text-gray-500 text-[8px] mt-2'}`}
                                >
                                    {card.description}
                                </motion.p>
                            </div>

                            {!active && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-gray-600 text-[10px] font-mono mt-2"
                                >
                                    [ CLICK TO EXPAND ]
                                </motion.div>
                            )}

                            {active === card && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col h-full"
                                >
                                    <div className="text-gray-300 font-mono text-xs leading-loose text-left overflow-auto px-2 [scrollbar-width:none] [-ms-overflow-style:none] flex-grow">
                                        {typeof card.content === "function"
                                            ? card.content()
                                            : card.content}
                                    </div>
                                    <div className="mt-4 pt-2 border-t border-white/10">
                                        <a
                                            href={card.ctaLink}
                                            className="inline-block w-full py-2 bg-[#9d4edd]/10 hover:bg-[#9d4edd]/20 border border-[#9d4edd] text-[#9d4edd] font-bold text-xs uppercase tracking-widest transition-all hover:shadow-[0_0_10px_#9d4edd]"
                                        >
                                            {card.ctaText}
                                        </a>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            ))}
        </ul>
    );
}

const cards = [
    {
        description: "Experience the vibe",
        title: "DJ Night",
        src: "/images/events/dj-night.png",
        ctaText: "Details",
        ctaLink: "#",
        content: () => {
            return (
                <p>
                    Get ready for an electrifying night of beats and rhythm. Our top DJs will be spinning the best tracks to keep you moving all night long.
                </p>
            );
        },
    },
    {
        description: "Live Performance",
        title: "Live Concert",
        src: "/images/events/live-concert.png",
        ctaText: "Details",
        ctaLink: "#",
        content: () => {
            return (
                <p>
                    Join us for a mesmerizing live concert featuring top artists. Feel the energy of live music as it reverberates through the arena.
                </p>
            );
        },
    },
    {
        description: "Beatboxing & Flute",
        title: "Fluteboxers",
        src: "/images/events/fluteboxers.png",
        ctaText: "Details",
        ctaLink: "#",
        content: () => {
            return (
                <p>
                    A unique fusion of beatboxing and flute that creates a soundscape unlike any other. Witness the innovation of music as two worlds collide.
                </p>
            );
        },
    },
];
