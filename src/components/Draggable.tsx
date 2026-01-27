import React from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";

export function DraggableCardDemo() {
  const items = [
    {
      title: "Excellence",
      image: "https://ik.imagekit.io/vdigjljlu/Aaryan%20Barthwal%20Aug%2030%202025.jpg?updatedAt=1769276670077",
    },
    {
      title: "Community",
      image:
        "https://ik.imagekit.io/vdigjljlu/Aaryan%20Barthwal%20Aug%2030%202025%20(1).jpg?updatedAt=1769276693087",
    },
    {
      title: "Competition",
      image:
        "https://ik.imagekit.io/vdigjljlu/Screenshot%202026-01-09%20at%207.20.10%E2%80%AFPM.png?updatedAt=1769411913176",
    },
    {
      title: "Innovation",
      image:
        "https://ik.imagekit.io/vdigjljlu/Screenshot%202026-01-09%20at%207.20.29%E2%80%AFPM.png?updatedAt=1769411914324",
    },
    {
      title: "Gaming",
      image:
        "https://ik.imagekit.io/vdigjljlu/20250830_115438.jpg?updatedAt=1769276686027",
    },
    {
      title: "Fair Play",
      image:
        "https://ik.imagekit.io/vdigjljlu/Aaryan%20Barthwal%20Aug%2030%202025%20(2).jpg?updatedAt=1769276665991",
    },
    {
      title: "Integrity",
      image:
        "https://ik.imagekit.io/vdigjljlu/Screenshot%202026-01-09%20at%209.54.14%E2%80%AFPM.png?updatedAt=1769411871209",
    },
    {
      title: "Transparency",
      image:
        "https://ik.imagekit.io/vdigjljlu/Camera%20Photo%20DSC09751.JPG?updatedAt=1769276694916",
    },
  ];

  const [positions, setPositions] = React.useState<
    Array<{ top: number; left: number; rotate: number }>
  >([]);

  React.useEffect(() => {
    const newPositions = items.map(() => ({
      top: Math.random() * 40,
      left: Math.random() * 60 + 10,
      rotate: Math.random() * 20 - 10,
    }));
    setPositions(newPositions);
  }, []);

  return (
    <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
      <p className="absolute top-80 mx-auto max-w-md -translate-y-3/4 text-center text-2xl font-black text-neutral-400 md:text-4xl dark:text-neutral-800">
        No warm-ups. No excuses. If you are here, you compete.
      </p>
      {items.map((item, index) => (
        <DraggableCardBody
          key={item.title}
          className="absolute min-h-[18rem] w-48 md:min-h-96 md:w-80"
          style={{
            top: positions[index] ? `${positions[index].top}%` : "50%",
            left: positions[index] ? `${positions[index].left}%` : "50%",
            rotate: positions[index] ? `${positions[index].rotate}deg` : "0deg",
            zIndex: index,
          }}
        >
          <img
            src={item.image}
            alt={item.title}
            className="pointer-events-none relative z-10 h-40 w-40 object-cover md:h-80 md:w-80"
          />
          <h3 className="mt-4 text-center text-sm font-bold text-white md:text-2xl dark:text-neutral-300">
            {item.title}
          </h3>
        </DraggableCardBody>
      ))}
    </DraggableCardContainer>
  );
}

export default DraggableCardDemo;