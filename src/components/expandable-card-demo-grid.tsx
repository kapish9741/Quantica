"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";

export default function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-xl h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h2
                      layoutId={`title-${active.title}-${id}`}
                      className="font-medium text-neutral-700 dark:text-neutral-200 text-xl"
                    >
                      {active.title}
                    </motion.h2>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-400 dark:text-neutral-400 text-base"
                    >
                      {active.description}
                    </motion.p>
                  </div>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto font-play dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-start gap-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col  hover:bg-primary/50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col  w-full">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <img
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-60 w-full  rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="flex justify-center items-center flex-col">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-neutral-400 dark:text-neutral-200 group-hover:text-neutral-800 text-center md:text-left text-base"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "Pure Sonic Chaos",
    title: "Live concert",
    src: "https://ik.imagekit.io/jbckhvkvo/7654e2d45cfe8551bba335bebc2d6481.jpg",
    content: () => {
      return (
        <p>
          Feel the bass in your chest, the lights in your eyes, and the crowd moving as one. This live concert is not just music, it is an experience. Raw vocals, electrifying instruments, and an atmosphere charged with pure energy. Every beat hits harder, every chorus gets louder, and every moment pulls you deeper in. Come for the music, stay for the vibe, and leave with memories that will echo long after the last note fades. This is where sound meets soul, live and unforgettable.
        </p>
      );
    },
  },
  {
    description: "Lights Bass Repeat",
    title: "DJ Night",
    src: "https://i.pinimg.com/736x/39/7d/13/397d13696427bd39f58cfc375173f0b4.jpg",
    content: () => {
      return (
        <p>
          Get ready for a night where the bass takes control and the energy never drops. This DJ Night is all about hard beats, flashing lights, and a crowd that moves till the last track. From deep drops to nonstop grooves, every mix is designed to keep you locked in. Lose yourself in the music, feel the rhythm hit harder, and dance like nothing else exists. This is not just a party, it is a full-power vibe till midnight and beyond.
        </p>
      );
    },
  },

  {
    description: "Rhythm Reimagined",
    title: "Fluteboxers",
    src: "https://ik.imagekit.io/jbckhvkvo/98c1dc4893d7f64dd807a5921edf3cc7.jpg",
    content: () => {
      return (
        <p>
          Fluteboxers bring together the soul of the flute and the raw energy of beatboxing in a way you have never heard before. Smooth melodies collide with heavy beats, creating a sound that is fresh, rhythmic, and insanely addictive. Every performance is a perfect balance of calm and chaos, tradition and modern vibe. This is live music redefined, unexpected, electrifying, and unforgettable.
        </p>
      );
    },
  },
  {
    description: "More Surprises",
    title: "More Fun Ahead",
    src: "https://ik.imagekit.io/jbckhvkvo/Dubai_s%20underground%20music%20scene.jpeg",
    content: () => {
      return (
        <p>
          Get ready for more activities that keep the energy high and the excitement nonstop. From interactive challenges to fun-filled moments, every activity is designed to engage, entertain, and bring people together. Whether you jump in for the thrill or just enjoy the vibe, there is always something happening. Expect laughter, competition, and memories you will not forget.
        </p>
      );
    },
  },
];
