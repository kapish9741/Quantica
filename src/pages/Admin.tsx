import { useState } from "react";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { LogOut } from "lucide-react";
import PageTransition from "../components/PageTransition";
import GlitchText from "../components/GlitchText";
import AdminLogin from "../components/admin/AdminLogin";
import TeamManagement from "../components/admin/TeamManagement";
import MatchScoring from "../components/admin/MatchScoring";
import PointsSchemeEditor from "../components/admin/PointsSchemeEditor";
import LoaderLeader from "@/components/loaderleader";

const Admin = () => {
  const { isAuthenticated, isLoading, login, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("teams");

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
              </p>
            </div>
            <button
              onClick={logout}
              className="glitch-btn bg-red-500 text-white px-4 py-2 flex items-center gap-2 hover:bg-red-600"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-card border-2 border-border p-1 grid grid-cols-3 gap-2">
              <TabsTrigger
                value="teams"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <span className="hidden md:inline">Teams</span>
              </TabsTrigger>
              <TabsTrigger
                value="scoring"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <span className="hidden md:inline">Scoring</span>
              </TabsTrigger>
              <TabsTrigger
                value="points"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <span className="hidden md:inline">Points Scheme</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="teams" className="bg-card border-2 border-border p-6 mt-6">
              <TeamManagement />
            </TabsContent>

            <TabsContent value="scoring" className="bg-card border-2 border-border p-6 mt-6">
              <MatchScoring />
            </TabsContent>

            <TabsContent value="points" className="bg-card border-2 border-border p-6 mt-6">
              <PointsSchemeEditor />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageTransition>
  );
};

export default Admin;
