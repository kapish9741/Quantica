import { useState, useEffect } from "react";
import api from "../lib/api";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { LogOut, Users, Target, Trophy } from "lucide-react";
import PageTransition from "../components/PageTransition";
import GlitchText from "../components/GlitchText";
import AdminLogin from "../components/admin/AdminLogin";
import TeamManagement from "../components/admin/TeamManagement";
import MatchScoring from "../components/admin/MatchScoring";
import BracketManagement from "../components/admin/BracketManagement";
import LoaderLeader from "@/components/loaderleader";

const Admin = () => {
  const { isAuthenticated, isLoading, login, logout, user } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("teams");
  const [managedGameName, setManagedGameName] = useState<string | null>(null);
  const [effectiveManagedEventId, setEffectiveManagedEventId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const determineUserScope = async () => {
      try {
        const { data } = await api.get('/events');

        if (user && user.email) {
          // Check if user should be restricted to a specific event based on email
          const matchedEvent = data.find((e: any) =>
            user.email.toLowerCase().includes(e.slug.toLowerCase())
          );

          if (matchedEvent) {
            setEffectiveManagedEventId(matchedEvent.id);
            setManagedGameName(matchedEvent.name);
          } else {
            setEffectiveManagedEventId(undefined); // Super Admin
            setManagedGameName("ADMIN");
          }
        }
      } catch (error) {
        console.error("Failed to fetch game details", error);
      }
    };

    if (isAuthenticated) {
      determineUserScope();
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <LoaderLeader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  return (
    <PageTransition>
      <section className="min-h-screen pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute inset-0 scanlines pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-2">
                <GlitchText text="ADMIN PANEL" className="text-foreground" />
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                Manage leaderboard system
                {managedGameName && (
                  <span className="ml-2 px-3 py-1 bg-primary/20 border border-primary text-primary rounded text-sm font-bold uppercase">
                    {managedGameName}
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={logout}
              className="glitch-btn bg-red-500 text-white px-4 py-2 flex items-center gap-2 hover:bg-red-600"
            >
              <LogOut className="w-5 h-5" />
              <div className="hidden md:block">Logout</div>
            </button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-card border-2 border-border flex w-full gap-2">
              <TabsTrigger
                value="teams"
                className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
              >
                <Users className="w-5 h-5" />
                <span className="hidden md:inline">Teams</span>
              </TabsTrigger>

              {(!effectiveManagedEventId) || (user?.email.includes('bgmi') || user?.email.includes('freefire')) ? (
                <TabsTrigger
                  value="scoring"
                  className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
                >
                  <Target className="w-5 h-5" />
                  <span className="hidden md:inline">Scoring</span>
                </TabsTrigger>
              ) : null}

              {(!effectiveManagedEventId) || !(user?.email.includes('bgmi') || user?.email.includes('freefire')) ? (
                <TabsTrigger
                  value="brackets"
                  className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
                >
                  <Trophy className="w-5 h-5" />
                  <span className="hidden md:inline">Brackets</span>
                </TabsTrigger>
              ) : null}
            </TabsList>

            <TabsContent value="teams" className="bg-card border-2 border-border p-6 mt-6">
              <TeamManagement preSelectedEventId={effectiveManagedEventId} />
            </TabsContent>

            <TabsContent value="scoring" className="bg-card border-2 border-border p-6 mt-6">
              <MatchScoring preSelectedEventId={effectiveManagedEventId} />
            </TabsContent>

            <TabsContent value="brackets" className="bg-card border-2 border-border p-6 mt-6">
              <BracketManagement preSelectedEventId={effectiveManagedEventId} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageTransition>
  );
};

export default Admin;
