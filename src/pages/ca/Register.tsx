
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../lib/api';
import GlitchText from '../../components/GlitchText';

const CARegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        college: '',
        year: '',
        phone: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/ca/register', formData);
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/ca/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
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
                    <GlitchText text="CA REGISTRATION" className="text-3xl font-bold mb-2" />
                    <p className="text-muted-foreground text-sm">Join the elite squad of Campus Ambassadors</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider mb-1 text-muted-foreground">Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full bg-background/50 border border-border p-3 focus:border-primary outline-none transition-colors"
                            placeholder="YOUR CODE NAME"
                            onChange={handleChange}
                        />
                    </div>

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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider mb-1 text-muted-foreground">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                className="w-full bg-background/50 border border-border p-3 focus:border-primary outline-none transition-colors"
                                placeholder="9876543210"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider mb-1 text-muted-foreground">Year</label>
                            <select
                                name="year"
                                required
                                className="w-full bg-background/50 border border-border p-3 focus:border-primary outline-none transition-colors"
                                onChange={handleChange}
                                defaultValue=""
                            >
                                <option value="" disabled>Select</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider mb-1 text-muted-foreground">College</label>
                        <input
                            type="text"
                            name="college"
                            required
                            className="w-full bg-background/50 border border-border p-3 focus:border-primary outline-none transition-colors"
                            placeholder="Institute of Quantica"
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground font-bold py-3 uppercase tracking-widest hover:bg-primary/90 transition-colors clip-corner mt-6"
                    >
                        {loading ? 'Booting Up...' : 'Initialize Profile'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already an agent? <Link to="/ca/login" className="text-primary hover:underline">Login here</Link>
                </p>

            </motion.div>
        </div>
    );
};

export default CARegister;
