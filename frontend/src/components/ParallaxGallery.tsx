import { motion } from "framer-motion";
import ParallaxScroll from "@/components/ui/parallax-scroll";

const tournamentImages = [
  "https://news.cgtn.com/news/3d3d414e7851544d79457a6333566d54/img/618047f9d4414205bae6f376785defaf/618047f9d4414205bae6f376785defaf.jpg",
  "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/560aee77c15873ac2b801c5d9b8295b844852759-1920x1280.jpg",
  "https://official.garena.com/intl/v1/config/gallery_esport01.jpg",
  "https://sm.ign.com/ign_in/screenshot/default/457-hindi-realme-bgis-2025-grand-finals-day-3-youtube-google_2bh7.jpg",
];

const extraParallaxImages = [
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1600&q=80",
];

const parallaxImages = [
  ...tournamentImages,
  ...extraParallaxImages,
  ...tournamentImages,
];

const ParallaxGallery = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 grid-bg opacity-5" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-secondary uppercase tracking-[0.3em] text-sm mb-4">
            Captured Moments
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            OUR <span className="text-primary">GALLERY</span>
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <ParallaxScroll
            images={parallaxImages}
            className="bg-background/80 border-border/60"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ParallaxGallery;
