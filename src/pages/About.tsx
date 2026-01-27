import { motion } from "framer-motion";
import { Target, Users, Trophy, Star } from "lucide-react";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import PageTransition from "../components/PageTransition";
import GlitchText from "../components/GlitchText";
import DraggableCardDemo from "../components/Draggable";

const coreTeam = [
  {
    name: "Deepanshu Chaudhary",
    role: "Founder",
    image: "https://ik.imagekit.io/vdigjljlu/IMG_9480.JPG",
    linkedin: "https://www.linkedin.com/in/deepanshu-chaudhary17/",
    email: "deepanshu.chaudhary2024@nst.rishihood.edu.in",
  },
  {
    name: "Sarabjeet singh",
    role: "Tournament Director",
    image: "https://ik.imagekit.io/vdigjljlu/Image%20Converter%20Output.png",
    linkedin: "https://www.linkedin.com/in/sarabjeet-singh-0695a8310/",
    email: "sarabjeet.singh2024@nst.rishihood.edu.in",
  },
  {
    name: "Somil Thakur",
    role: "Operations Head",
    image: "https://ik.imagekit.io/vdigjljlu/IMG_2138.JPG",
    linkedin: "https://www.linkedin.com/in/somil-thakur-682817323/",
    email: "somil.thakur2024@makers.rishihood.edu.in",
  },
  {
    name: "Kapish Rohilla",
    role: "Technical Lead",
    image: "https://ik.imagekit.io/vdigjljlu/Screenshot%202026-01-10%20at%204.16.14%E2%80%AFPM.png?updatedAt=1769411838200",
    // image: "https://res.cloudinary.com/dxo4ulvnf/image/upload/v1768044091/Screenshot_2026-01-10_at_4.50.48_PM_dng2eg.png",
    linkedin: "https://www.linkedin.com/in/kapishrohilla/",
    email: "kapish.rohilla2024@nst.rishihood.edu.in",
  },
  {
    name: "Neelanshu karn",
    role: "Sponsorship Head",
    image: "https://ik.imagekit.io/vdigjljlu/WhatsApp%20Image%202026-01-12%20at%2000.52.58.jpeg",
    linkedin: "https://www.linkedin.com/in/neelanshu-karn-05146130a/",
    email: "neelanshu.2024@nst.rishihood.edu.in",
  },
  {
    name: "Anindya Sarkar",
    role: "Outreach Head",
    image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768237644/Picture_-_Anindya_Sarkar_y1ol4o.jpg",
    linkedin: "https://www.linkedin.com/in/anindya-sarkar2007/",
    email: "anindya.s25058@nst.rishihood.edu.in",
  },
  {
    name: "Kaustubh Singh",
    role: "Design Lead",
    image: "https://ik.imagekit.io/vdigjljlu/WhatsApp%20Image%202026-01-10%20at%2016.16.49.jpeg",
    linkedin: "https://www.linkedin.com/in/ikaustubhsingh/",
    email: "kaustubh.s25008@design.rishihood.edu.in",
  },
  {
    name: "Kushagra Maheshwari",
    role: "Content Lead",
    image: "https://ik.imagekit.io/vdigjljlu/WhatsApp%20Image%20Jan%2012%202026%20from%20Kushagra%20Maheshwari.jpeg",
    linkedin: "https://www.linkedin.com/in/kushm11/",
    email: "kushagra.maheshwari2024@nst.rishihood.edu.in",
  },
];

const additionalTeams = [
  {
    title: "Tech Team",
    subtitle: "Code. Conquer. Control the Game.",
    members: [
      {
        name: "Yuvansh Juneja",
        role: "Tech Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768410364/d9783e4b-29ce-41e6-bd7a-929dd30eca12_-_Yuvansh_Juneja_rfbh3o.jpg",
        linkedin: "https://www.linkedin.com/in/yuvansh-juneja-905679332/",
        email: "yuvansh.j25537@nst.rishihood.edu.in",
      },
      {
        name: "Yatharth Khandelwal",
        role: "Tech Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768237165/Yatharth_uwywey.png",
        linkedin: "https://www.linkedin.com/in/khandelwalyatharth/",
        email: "yatharth.k25530@nst.rishihood.edu.in",
      },
    ],
  },
  {
    title: "Design Team",
    subtitle: "Pixels with Purpose",
    members: [
      {
        name: "Prateek Girdhar",
        role: "Design Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768237639/IMG_0638_-_Prateek_Girdhar_kczc5l.jpg",
        linkedin: "https://www.linkedin.com/in/prateek-girdhar-b0250327a/",
        email: "prateek.g25035@design.rishihood.edu.in",
      },
      {
        name: "Arit Dey",
        role: "Design Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768237643/IMG_0082_-_Arit_Dey_kyn6rt.jpg",
        linkedin: "https://www.linkedin.com/in/arit-dey-39412136b/",
        email: "arit.d25002@design.rishihood.edu.in",
      },
      {
        name: "Prabhas",
        role: "Design Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768450412/IMG_20260111_014558_083_-_Prabhas_Kumar_grwrzt.jpg",
        linkedin: "https://www.linkedin.com/in/prabhas-kumar-17129237a/",
        email: "prabhas.k25056@csds.rishihood.edu.in",
      },
    ],
  },
  {
    title: "Sponsorship and Partnership Team",
    subtitle: "Partnerships That Win Games.",
    members: [
      {
        name: "Anshika Srivastava",
        role: "Sponsorship Team",
        image: "https://ik.imagekit.io/vdigjljlu/WhatsApp%20Image%202026-01-22%20at%2016.52.24.jpeg",
        linkedin: "https://www.linkedin.com/in/anshika-srivastava-b5a046356/",
        email: "anshika.s25071@nst.rishihood.edu.in",
      },
      {
        name: "Keshav Goel",
        role: "Sponsorship Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768237642/IMG_20241006_195320_-_Keshav_Goel_kuyxv0.jpg",
        linkedin: "https://www.linkedin.com/in/keshav-goel-6a7b47380/",
        email: "keshav.g25720@nst.rishihood.edu.in",
      },
      {
        name: "Rudransh Singh",
        role: "Partnership Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768237645/IMG-20260112-WA0040_-_Rudransh_Singh_jmxknf.jpg",
        linkedin: "https://www.linkedin.com/in/rudransh-singh-941a45304/",
        email: "rudransh.s25390@nst.rishihood.edu.in",
      },
      {
        name: "Sayan Bhattacharya ",
        role: "Sponsorship Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768237644/IMG-20260108-WA0218_-_Sayan_Bhattacharya_x2qpxj.jpg",
        linkedin: "https://www.linkedin.com/in/sayanbhattacharya01/",
        email: "sayan.bhattacharya2024@nst.rishihood.edu.in",
      },
    ],
  },
  {
    title: "Outreach Team",
    subtitle: "Ping Sent. Connection Made.",
    members: [
      {
        name: "Dhaval sethi",
        role: "Outreach Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768237641/20251201_004223_-_Dhaval_Sethi_d1guoj.jpg",
        linkedin: "/",
        email: "dhaval.s25141@nst.rishihood.edu.in",
      },
      {
        name: "Ansh singh",
        role: "Outreach Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768237646/Screenshot_2026-01-12-11-32-02-59_92460851df6f172a4592fca41cc2d2e6_-_Ansh_Singh_kp5f2n.jpg",
        linkedin: "https://www.linkedin.com/in/ansh-singh-nst",
        email: "ansh.s25070@nst.rishihood.edu.in",
      },
    ],
  },
  {
    title: "Marketing Team",
    subtitle: "Visibility Wins Games",
    members: [
      {
        name: "Aayush Ray",
        role: "Marketing Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768237644/PHOTO-2026-01-12-01-43-40_-_Aayush_Ray_x2outo.jpg",
        linkedin: "https://www.linkedin.com/in/aayushray/",
        email: "aayush.r25009@nst.rishihood.edu.in",
      },
      {
        name: "Alok Rawat",
        role: "Marketing Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768237641/IMG_7367_-_Alok_Rawat_zr3wan.jpg",
        linkedin: "https://www.linkedin.com/in/alok-rawat-1698172aa/",
        email: "alok.r25012@csds.rishihood.edu.in",
      },
      // {
      //   name: "Lakshay Chaudhary",
      //   role: "Marketing Team",
      //   image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768237645/IMG_20251212_182736_-_Lakshay_Chaudhary_uhohoh.jpg",
      //   linkedin: "/",
      //   email: "lakshay.c25623@nst.rishihood.edu.in",
      // },
      {
        name: "Parth Mittal",
        role: "Marketing Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768237641/IMG_4643_-_Parth_Mittal_l8hb6e.jpg",
        linkedin: "https://www.linkedin.com/in/parth-mittal-159228371/",
        email: "parth.m25657@nst.rishihood.edu.in",
      },
      // {
      //   name: "Krishna Agarwal",
      //   role: "Marketing Team",
      //   image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768237642/IMG_3337_-_Krishna_Agarwal_yivrtu.png",
      //   linkedin: "https://www.linkedin.com/in/krishna-agarwal-1a963626b/",
      //   email: "krishna.a25010@design.rishihood.edu.in",
      // },
      {
        name: "Saurav Singh",
        role: "Marketing Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768450235/WhatsApp_Image_2026-01-13_at_23.08.41_-_Saurav_Kumar_phtyyt.jpg",
        linkedin: "https://www.linkedin.com/in/saurav-singh-52971936a/",
        email: "saurav.k25020@design.rishihood.edu.in",
      },
      {
        name: "Harsh Raja",
        role: "Marketing Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768450246/IMG_20251201_131108_867_-_Harsh_Raja_z6scmv.webp",
        linkedin: "https://www.linkedin.com/in/harsh-raja-15baba354/",
        email: "harsh.r25177@nst.rishihood.edu.in",
      },
      {
        name: "Poorak Pandey",
        role: "Marketing Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768450522/20251205_135023_-_Poorak_Pandey_myparx.jpg",
        linkedin: "https://www.linkedin.com/in/poorak-pandey-038a38262/",
        email: "poorak.p25055@csds.rishihood.edu.in",
      },
    ],
  },
  {
    title: "Events Team",
    subtitle: "Orchestrating the Experience",
    members: [
      {
        name: "Aayush Kumar",
        role: "Events Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768237645/IMG-20251201-WA0161_-_Aayush_Kumar_l4pfuf.jpg",
        linkedin: "https://www.linkedin.com/in/aayush-kumar2007",
        email: "aayush.k25011@nst.rishihood.edu.in",
      },
      {
        name: "Saurabh",
        role: "Events Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768237638/8FFDD2D9-1FD4-4C8F-8846-5A29A0C52094_-_Saurabh_xqgrxi.jpg",
        linkedin: "https://www.linkedin.com/in/saurabh-yadav-53327a37a/",
        email: "saurabh.25415@nst.rishihood.edu.in",
      },
      {
        name: "Chirag Tyagi",
        role: "Events Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768237643/IMG-20250805-WA0002_-_Chirag_Tyagi_hwoxcb.jpg",
        linkedin: "https://www.linkedin.com/in/chirag-tyagi-77521037b/",
        email: "chirag.t25126@nst.rishihood.edu.in",
      },
    ],
  },
  {
    title: "Operations Team",
    subtitle: "Orchestrating the Experience",
    members: [
      {
        name: "Chirag Antil",
        role: "Operations Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768239856/IMG_20251219_013526_478_1_-_Chirag_Antil_n8mtpw.jpg",
        linkedin: "https://www.linkedin.com/in/chiragantil",
        email: "chirag.a25125@nst.rishihood.edu.in",
      },
      {
        name: "Akshay Kumar Singh",
        role: "Operations Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768237650/IMG20250617174150_-_AKSHAY_KUMAR_SINGH_ixlq6i.jpg",
        linkedin: "https://www.linkedin.com/in/akshay-kumar-singh-327280374/",
        email: "akshay.s25582@nst.rishihood.edu.in",
      },
      {
        name: "Shlok Srivastava",
        role: "Operations Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768481109/IMG-20251204-WA0062_-_Shlok_Srivastava_d2gvue.jpg",
        linkedin: "https://www.linkedin.com/in/shlok-srivastava-a65906368/",
        email: "shlok.s25434@nst.rishihood.edu.in",
      },
    ],
  },
  {
    title: "Decoration Team",
    subtitle: "Orchestrating the Experience",
    members: [
      {
        name: "Mayank Jangra",
        role: "Decor Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1768237647/Screenshot_2026-01-12_at_12.33.37_AM_-_Mayank_Jangra_mehjio.png",
        linkedin: "http://www.linkedin.com/in/mayank-jangra-a3792a387",
        email: "mayank.j25573@nst.rishihood.edu.in",
      },
      {
        name: "Yanshika Rana",
        role: "Decor Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1769018190/IMG-20251205-WA0025_2_-_Yanshika_Rana_x6zq9f.jpg",
        linkedin: "https://www.linkedin.com/in/yanshika-rana-853171374/",
        email: "yanshika.r25120@csds.rishihood.edu.in",
      },
      {
        name: "Bhavya",
        role: "Decor Team",
        image: "https://res.cloudinary.com/dqh5g2nmn/image/upload/v1769018265/88a4f051-5a6b-4a7f-94c4-fc29548f1337_-_Bhavya_l52spc.jpg",
        linkedin: "https://www.linkedin.com/in/bhavya-saini-000561373/",
        email: "bhavya.25019@csds.rishihood.edu.in",
      },
    ],
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
                  src="https://ik.imagekit.io/vdigjljlu/E-sports%20DSC09749.JPG?updatedAt=1769276693186"
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
            {coreTeam.map((member, index) => (
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

      <section className="py-24 relative">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-secondary uppercase tracking-[0.3em] text-sm mb-4">
              Extended Squad
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground uppercase">
              The Players <span className="text-primary">Behind the Game</span>
            </h2>
          </motion.div>

          <div className="space-y-20">
            {additionalTeams.map((teamGroup, groupIndex) => (
              teamGroup.members.length > 0 && (
                <motion.div
                  key={teamGroup.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: groupIndex * 0.1 }}
                >
                  <div className="text-center mb-12">
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {teamGroup.title}
                    </h3>
                    <p className="text-secondary text-sm uppercase tracking-widest">
                      {teamGroup.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-8">
                    {teamGroup.members.map((member, memberIndex) => (
                      <motion.div
                        key={member.name}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: memberIndex * 0.1 }}
                        className="group w-full max-w-[280px]"
                      >
                        <div className="relative overflow-hidden clip-corner mb-4">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-64 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h4 className="text-md font-bold text-foreground">
                          {member.name}
                        </h4>
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
                </motion.div>
              )
            ))}
          </div>

          {additionalTeams.every((team) => team.members.length === 0) && (
            <div className="text-center text-muted-foreground py-12">
              <p className="text-lg">More team members coming soon!</p>
            </div>
          )}
        </div>
      </section>
      { }
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <p className="text-4xl md:text-6xl font-bold text-primary mb-2">
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
              <p className="text-4xl md:text-6xl font-bold text-secondary mb-2">
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
              <p className="text-4xl md:text-6xl font-bold text-primary mb-2">
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
