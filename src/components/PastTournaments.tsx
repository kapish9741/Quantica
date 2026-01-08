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
    id: 1,
    title: "Winter Championship 2025",
    game: "BGMI",
    image: "https://news.cgtn.com/news/3d3d414e7851544d79457a6333566d54/img/618047f9d4414205bae6f376785defaf/618047f9d4414205bae6f376785defaf.jpg",
    winner: "Team Soul",
    prize: "₹15,00,000",
    date: "Dec 2025",
    teams: "64",
  },
  {
    id: 2,
    title: "Valorant Championship",
    game: "Valorant",
    image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/560aee77c15873ac2b801c5d9b8295b844852759-1920x1280.jpg",
    winner: "Global Esports",
    prize: "₹10,00,000",
    date: "Oct 2025",
    teams: "32",
  },
  {
    id: 3,
    title: "Free Fire League",
    game: "Free Fire",
    image: "https://official.garena.com/intl/v1/config/gallery_esport01.jpg",
    winner: "Total Gaming",
    prize: "₹8,00,000",
    date: "Aug 2025",
    teams: "48",
  },
  {
    id: 4,
    title: "Summer Showdown",
    game: "BGMI",
    image: "https://sm.ign.com/ign_in/screenshot/default/457-hindi-realme-bgis-2025-grand-finals-day-3-youtube-google_2bh7.jpg",
    winner: "GodLike",
    prize: "₹5,00,000",
    date: "June 2025",
    teams: "100+",
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
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Witness the history of champions. These legends conquered the arena and etched their names in eternity.
          </p>
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
                        {/* Winner Section */}
                         <div className="p-4 bg-muted/20 rounded-lg border border-border/50 group-hover:border-primary/30 transition-colors">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-yellow-500" />
                                Champion
                            </p>
                            <p className="text-xl font-bold text-foreground flex items-center gap-2 font-play tracking-wide">
                                {tournament.winner}
                            </p>
                         </div>

                         {/* Stats Grid */}
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
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Teams</p>
                            </div>
                         </div>
                         
                         {/* Hover Shine Effect */}
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
