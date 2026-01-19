
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../lib/api';
import GlitchText from '../../components/GlitchText';

const CALogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Use standard auth login
            const response = await api.post('/auth/login', formData);

            // Verify role
            // Note: Backend might need to return role in the user object
            const user = response.data.user;

            // Note: based on backend, we might not have role immediately if we didn't update authController
            // But we can fetch /ca/me to verify if it fails

            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(user));

            // Attempt to access CA dashboard to verify CA status
            try {
                await api.get('/ca/me'); // This will fail if not a CA or logic isn't there
                navigate('/ca/dashboard');
            } catch (caError) {
                // If generic user, maybe redirect home, but for this portal we want CA only
                setError('Access denied: Not a Campus Ambassador account');
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }

        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-20" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 bg-card border border-border relative z-10 clip-corner"
            >
                <div className="text-center mb-8">
                    <GlitchText text="CA LOGIN" className="text-3xl font-bold mb-2" />
                    <p className="text-muted-foreground text-sm">Welcome back, Agent.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-wider mb-1 text-muted-foreground">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full bg-background/50 border border-border p-3 focus:border-primary outline-none transition-colors"
                            placeholder="agent@quantica.fun"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider mb-1 text-muted-foreground">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full bg-background/50 border border-border p-3 focus:border-primary outline-none transition-colors"
                            placeholder="••••••••"
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground font-bold py-3 uppercase tracking-widest hover:bg-primary/90 transition-colors clip-corner"
                    >
                        {loading ? 'Authenticating...' : 'Access Terminal'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    New here? <Link to="/ca/register" className="text-primary hover:underline">Apply now</Link>
                </p>

            </motion.div>
        </div>
    );
};

export default CALogin;
