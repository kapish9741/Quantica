import { motion } from "framer-motion";
import { useState } from "react";
import { Lock, AlertCircle, Mail } from "lucide-react";
import GlitchText from "../GlitchText";

interface AdminLoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await onLogin(email, password);
      if (!success) {
        setError("Invalid credentials. Please check your email and password.");
        setPassword("");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute inset-0 scanlines pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="bg-card border-2 border-border clip-corner p-8">
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <GlitchText text="ADMIN ACCESS" className="text-foreground" />
            </h1>
            <p className="text-muted-foreground">
              Sign in with your authorized credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold uppercase tracking-wider text-primary mb-2"
              >
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border focus:border-primary outline-none transition-colors text-foreground"
                  placeholder="admin@example.com"
                  required
                  autoFocus
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold uppercase tracking-wider text-primary mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border focus:border-primary outline-none transition-colors text-foreground"
                  placeholder="Enter password"
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500 text-red-500 text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full glitch-btn bg-primary text-primary-foreground py-3 px-6 font-bold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground"></div>
                  Verifying...
                </span>
              ) : (
                "Authenticate"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Authorized personnel only
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
