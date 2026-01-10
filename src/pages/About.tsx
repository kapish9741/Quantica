import { motion } from "framer-motion";
import { Target, Users, Trophy, Star } from "lucide-react";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import PageTransition from "../components/PageTransition";
import GlitchText from "../components/GlitchText";
import DraggableCardDemo from "../components/Draggable";

const team = [
  {
    name: "Deepanshu Chaudhary",
    role: "Founder",
    image: "https://res.cloudinary.com/dxo4ulvnf/image/upload/v1768044124/IMG_9480_bdbhb9.jpg",
    linkedin: "https://www.linkedin.com/in/deepanshu-chaudhary17/",
    email: "deepanshu.chaudhary2024@nst.rishihood.edu.in",
  },
  {
    name: "Sarabjeet singh",
    role: "Tournament Director",
    image: "https://res.cloudinary.com/dxo4ulvnf/image/upload/v1768042995/Image_Converter_Output_u6ovyq.png",
    linkedin: "https://www.linkedin.com/in/sarabjeet-singh-0695a8310/",
    email: "sarabjeet.singh2024@nst.rishihood.edu.in",
  },
  {
    name: "Somil Thakur",
    role: "Marketing Head",
    image: "https://res.cloudinary.com/dxo4ulvnf/image/upload/v1768042608/IMG_2138_s3t05c.jpg",
    linkedin: "https://www.linkedin.com/in/somil-thakur-682817323/",
    email: "somil.thakur2024@makers.rishihood.edu.in",
  },
  {
    name: "Kapish Rohilla",
    role: "Technical Lead",
    image: "https://res.cloudinary.com/dxo4ulvnf/image/upload/v1768042237/Screenshot_2026-01-10_at_4.16.14_PM_kgcctf.png",
    // image: "https://res.cloudinary.com/dxo4ulvnf/image/upload/v1768044091/Screenshot_2026-01-10_at_4.50.48_PM_dng2eg.png",
    linkedin: "https://www.linkedin.com/in/kapishrohilla/",
    email: "kapish.rohilla2024@nst.rishihood.edu.in",
  },
  {
    name: "Neelanshu karn",
    role: "Sponsorship Head",
    image: "https://media.licdn.com/dms/image/v2/D4E03AQG5IMAd_OxYLg/profile-displayphoto-shrink_400_400/B4EZWOxzmZH0Ag-/0/1741857176517?e=1769644800&v=beta&t=fYKbhOSEA5sgBhUWYUe5JHIzuftC46Nkjna8l-WrIfk",
    linkedin: "https://www.linkedin.com/in/neelanshu-karn-05146130a/",
    email: "neelanshu.2024@nst.rishihood.edu.in",
  },
  {
    name: "Saumya Verma",
    role: "Outreach Head",
    image: "https://res.cloudinary.com/dxo4ulvnf/image/upload/v1768043928/IMG_0272_vf1xci.jpg",
    linkedin: "https://www.linkedin.com/in/saumya-verma-bab439365/",
    email: "saumya.v25413@nst.rishihood.edu.in",
  },
  {
    name: "Kaustubh Singh",
    role: "Design Lead",
    image: "https://res.cloudinary.com/dxo4ulvnf/image/upload/v1768042241/WhatsApp_Image_2026-01-10_at_16.16.49_qyfd44.jpg",
    linkedin: "https://www.linkedin.com/in/ikaustubhsingh/",
    email: "kaustubh.s25008@design.rishihood.edu.in",
  },
];
const values = [
  {
    icon: Target,
    title: "Excellence",
    description:
      "We strive for perfection in every tournament we organize, ensuring world-class experiences.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Building a thriving esports community in Delhi NCR where gamers can connect and grow.",
  },
  {
    icon: Trophy,
    title: "Competition",
    description:
      "Fair play and healthy competition are the foundations of our tournaments.",
  },
  {
    icon: Star,
    title: "Innovation",
    description:
      "Pushing boundaries with cutting-edge production and unique gaming experiences.",
  },
];
const About = () => {
  return (
    <PageTransition>
      { }
      <section className="pt-32 pb-24 relative">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <p className="text-primary uppercase tracking-[0.3em] text-sm mb-4">
              About Us
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-8">
              <GlitchText text="WE ARE QUANTICA" className="text-[40px] md:text-7xl" />
            </h1>
          </motion.div>
        </div>
      </section>
      { }
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                OUR <span className="text-secondary">STORY</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Team Sage emerged in September 2025 with a single, unwavering purpose: to redefine the gaming experience. More than an organization, we became a collective driven by passion, precision, and the relentless pursuit of competitive excellence.
                </p>
                <p>
                  By December 2025, that drive evolved into a vision called QUANTICA—a tournament imagined as the ultimate proving ground for gamers across Delhi NCR. What began as an ambitious concept quickly transformed into an obsession: to build something bigger, bolder, and unforgettable.
                </p>
                <p>
                  Defying limitations and expectations, Team Sage turned vision into reality. Now, in February 2026, QUANTICA rises as one of the most anticipated esports spectacles in the region—powered by resilience, fueled by passion, and built for those who live for the game.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="clip-corner overflow-hidden border border-primary">
                <img
                  src="https://res.cloudinary.com/dxo4ulvnf/image/upload/v1768039904/image_te3zex.png"
                  alt="Gaming Setup"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-secondary" />
            </motion.div>
          </div>
        </div>
      </section>
      { }
      <section className="py-24 relative">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-primary uppercase tracking-[0.3em] text-sm mb-4">
              What Drives Us
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              OUR <span className="text-secondary">VALUES</span>
            </h2>
          </motion.div>
          <div className="gap-8">
            <DraggableCardDemo />
            {/* {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 border border-border hover:border-primary transition-colors clip-corner-sm"
              >
                <value.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))} */}
          </div>
        </div>
      </section>
      { }
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-secondary uppercase tracking-[0.3em] text-sm mb-4">
              Meet The Squad
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground uppercase">
              Meet <span className="text-primary">Our Core Team</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden clip-corner mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {member.name}
                </h3>
                <p className="text-primary text-sm mb-3">{member.role}</p>
                <div className="flex gap-4 justify-center mt-2">
                  <a
                    href={member.email ? `mailto:${member.email}` : "#"}
                    className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform duration-200"
                  >
                    <FaEnvelope size={20} />
                  </a>
                  <a
                    href={member.linkedin || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[#0077b5] transition-colors hover:scale-110 transform duration-200"
                  >
                    <FaLinkedin size={20} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      { }
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <p className="text-3xl md:text-6xl font-bold text-primary mb-2">
                10+
              </p>
              <p className="text-muted-foreground uppercase tracking-wider text-sm">
                Events Hosted
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-3xl md:text-6xl font-bold text-secondary mb-2">
                2K+
              </p>
              <p className="text-muted-foreground uppercase tracking-wider text-sm">
                Players
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-3xl md:text-6xl font-bold text-primary mb-2">
                ₹4L+
              </p>
              <p className="text-muted-foreground uppercase tracking-wider text-sm">
                Prize Distributed
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};
export default About;
