import React from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";

export function DraggableCardDemo() {
  const items = [
    {
      title: "Excellence",
      image: "https://res.cloudinary.com/dxo4ulvnf/image/upload/v1767977877/E-sports_DSC09749_nhemcg.jpg",
    },
    {
      title: "Community",
      image:
        "https://res.cloudinary.com/dxo4ulvnf/image/upload/v1767973388/WhatsApp_Image_2026-01-09_at_16.55.36_gffopg.jpg",
    },
    {
      title: "Competition",
      image:
        "https://res.cloudinary.com/dxo4ulvnf/image/upload/v1767969917/Screenshot_2026-01-09_at_7.19.05_PM_eeqkoy.png",
    },
    {
      title: "Innovation",
      image:
        "https://res.cloudinary.com/dxo4ulvnf/image/upload/v1767969919/Screenshot_2026-01-09_at_7.20.29_PM_jyqzfd.png",
    },
    {
      title: "Gaming",
      image:
        "https://res.cloudinary.com/dxo4ulvnf/image/upload/v1767976985/Aaryan_Barthwal_Aug_30_2025_2_uytioq.jpg",
    },
    {
      title: "Fair Play",
      image:
        "https://res.cloudinary.com/dxo4ulvnf/image/upload/v1767974506/WhatsApp_Image_2026-01-09_at_16.55.35_m6hwta.jpg",
    },
    {
      title: "Integrity",
      image:
        "https://res.cloudinary.com/dxo4ulvnf/image/upload/v1767969918/Screenshot_2026-01-09_at_7.18.00_PM_jamzso.png",
    },
    {
      title: "Transparency",
      image:
        "https://res.cloudinary.com/dxo4ulvnf/image/upload/v1767969916/Screenshot_2026-01-09_at_1.19.09_PM_mefufa.png",
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