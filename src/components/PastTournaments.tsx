import { motion } from "framer-motion";
import { Trophy, Calendar, Users, Award } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const pastTournaments = [
  {
    id: 6,
    title: "Neutron",
    game: "BGMI",
    image: "https://ik.imagekit.io/vdigjljlu/WhatsApp%20Image%202026-01-09%20at%2016.55.35.jpeg?updatedAt=1769276551519",
    winner: "Signed To God",
    prize: "₹1,00,000",
    date: "Nov 2025",
    teams: "64",
  },
  {
    id: 7,
    title: "Damru - 2024",
    game: "BGMI",
    image: "https://ik.imagekit.io/vdigjljlu/WhatsApp%20Image%202026-01-09%20at%2016.55.36.jpeg?updatedAt=1769276560688",
    winner: "Team Delhi",
    prize: "₹1,50,000",
    date: "Dec 2024",
    teams: "64",
  },
  {
    id: 8,
    title: "Damru 2025",
    game: "BGMI",
    image: "https://ik.imagekit.io/vdigjljlu/WhatsApp%20Image%202026-01-09%20at%2016.55.33%20(1).jpeg?updatedAt=1769276563011",
    winner: "Gods Omen",
    prize: "₹1,50,000",
    date: "Jan 2025",
    teams: "64",
  },
  {
    id: 2,
    title: "Ganpati Mohotsav",
    game: "Free Fire",
    image: "https://ik.imagekit.io/vdigjljlu/Aaryan%20Barthwal%20Aug%2031%202025.jpg?updatedAt=1769276693316",
    winner: "C4 Gang",
    prize: "₹20,000",
    date: "Sep 2025",
    teams: "48",
  },
  {
    id: 3,
    title: "Ganpati Mohotsav",
    game: "BGMI",
    image: "https://ik.imagekit.io/vdigjljlu/Aaryan%20Barthwal%20Aug%2030%202025%20(2).jpg?updatedAt=1769276665991",
    winner: "God’s Arc",
    prize: "₹15,000",
    date: "Sep 2025",
    teams: "64",
  },
  {
    id: 4,
    title: "Delhi Open Esports Qualifiers",
    game: "E-Football",
    image: "https://ik.imagekit.io/vdigjljlu/WhatsApp%20Image%202026-01-09%20at%2016.55.37.jpeg?updatedAt=1769276551567",
    winner: "Charan",
    prize: "₹10,000",
    date: "Oct 2025",
    teams: "16",
  },
  {
    id: 1,
    title: "Rishihood Premier League",
    game: "BGMI",
    image: "https://ik.imagekit.io/vdigjljlu/Camera%20Photo%20DSC09751.JPG?updatedAt=1769276694916",
    winner: "Creonity Champions",
    prize: "₹10,000",
    date: "Jan 2025",
    teams: "64",
  },
  {
    id: 5,
    title: "Delhi Open Esports Qualifiers",
    game: "BGMI",
    image: "https://ik.imagekit.io/vdigjljlu/Aaryan%20Barthwal%20Aug%2030%202025%20(1).jpg?updatedAt=1769276693087",
    winner: "Jaat Officials",
    prize: "₹30,000",
    date: "Oct 2025",
    teams: "64",
  },
];

const PastTournaments = () => {
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
            Hall of Fame
          </p>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            PAST <span className="text-primary">GLORY</span>
          </h2>
          {/* <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Witness the history of champions. These legends conquered the arena and etched their names in eternity.
          </p> */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-7xl mx-auto"
          >
            <CarouselContent>
              {pastTournaments.map((tournament) => (
                <CarouselItem key={tournament.id} className="md:basis-1/2 lg:basis-1/3 p-4">
                  <div className="h-[500px]">
                    <Card className="bg-card border-border border hover:border-primary transition-all duration-300 overflow-hidden group h-full flex flex-col clip-corner">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={tournament.image}
                          alt={tournament.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90" />
                        <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-3 py-1">
                          Completed
                        </Badge>
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
                            {tournament.game}
                          </p>
                          <h3 className="font-bold text-2xl text-white leading-tight font-play uppercase tracking-wide">
                            {tournament.title}
                          </h3>
                        </div>
                      </div>

                      <CardContent className="p-6 flex flex-col gap-4 flex-grow relative justify-between">
                        <div className="p-4 bg-muted/20 rounded-lg border border-border/50 group-hover:border-primary/30 transition-colors">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            Champion
                          </p>
                          <p className="text-xl font-bold text-foreground flex items-center gap-2 font-play tracking-wide">
                            {tournament.winner}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center border-t border-white/5 pt-4">
                          <div>
                            <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
                            <p className="text-foreground font-bold text-sm">{tournament.date}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Date</p>
                          </div>
                          <div>
                            <Award className="w-5 h-5 text-secondary mx-auto mb-2" />
                            <p className="text-foreground font-bold text-sm">{tournament.prize}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Prize</p>
                          </div>
                          <div>
                            <Users className="w-5 h-5 text-primary mx-auto mb-2" />
                            <p className="text-foreground font-bold text-sm">{tournament.teams}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{tournament.game === "E-Football" ? "Players" : "Teams"}</p>
                          </div>
                        </div>

                        <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-shine pointer-events-none" />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground" />
            <CarouselNext className="hidden md:flex -right-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground" />
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
};

export default PastTournaments;
