
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import GlitchText from '../../components/GlitchText';
import { motion } from 'framer-motion';
import TaskCard from '../../components/ca/TaskCard';

const CADashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, tasksRes] = await Promise.all([
                    api.get('/ca/me'),
                    api.get('/ca/tasks')
                ]);
                setData(userRes.data);
                setTasks(tasksRes.data);
            } catch (error) {
                console.error(error);
                navigate('/ca/login');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const [referralEmail, setReferralEmail] = useState('');
    const [referralProof, setReferralProof] = useState('');
    const [submittingReferral, setSubmittingReferral] = useState(false);

    const handleReferralSubmit = async () => {
        if (!referralEmail || !referralProof) return alert("Please fill all fields");
        setSubmittingReferral(true);
        try {
            await api.post('/ca/referrals', { userEmail: referralEmail, proofUrl: referralProof });
            alert("Referral submitted successfully");
            setReferralEmail('');
            setReferralProof('');
        } catch (error: any) {
            alert(error.response?.data?.message || "Submission failed");
        } finally {
            setSubmittingReferral(false);
        }
    };

    if (loading) return <div className="min-h-screen pt-24 text-center">Loading...</div>;

    return (
        <div className="min-h-screen pt-24 px-4 container mx-auto">
            <h1 className="text-4xl font-bold mb-8">
                Agent <GlitchText text={data?.user?.email || 'Unknown'} />
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-card border border-primary/20">
                    <h3 className="text-xl font-bold mb-2">Tokens</h3>
                    <p className="text-4xl text-primary">{data?.tokens || 0}</p>
                </div>
                <div className="p-6 bg-card border border-primary/20">
                    <h3 className="text-xl font-bold mb-2">Referrals</h3>
                    <p className="text-4xl text-secondary">{data?.referrals?.length || 0}</p>
                </div>
                <div className="p-6 bg-card border border-primary/20">
                    <h3 className="text-xl font-bold mb-2">Referral Code</h3>
                    <p className="text-2xl font-mono text-primary tracking-widest">{data?.referralCode || '...'}</p>
                </div>
            </div>
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">

                {/* Tasks Column */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-8 bg-primary block" />
                        ACTIVE MISSIONS
                    </h2>

                    <div className="grid gap-6">
                        {tasks.map((task: any) => {
                            const isSubmitted = data?.submissions?.some((s: any) => s.taskId === task.id);
                            return (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    submitted={isSubmitted}
                                    onSubmit={() => window.location.reload()} // Simple reload for now to update state
                                />
                            );
                        })}
                        {tasks.length === 0 && <p className="text-muted-foreground">No active missions available.</p>}
                    </div>
                </div>

                {/* Sidebar: Referrals & Stats */}
                <div className="space-y-8">
                    {/* Referral Submission */}
                    <div className="p-6 bg-card border border-border">
                        <h3 className="text-xl font-bold mb-4">LOG REFERRAL</h3>
                        <p className="text-xs text-muted-foreground mb-4">
                            Manually log a registration if they missed your link.
                        </p>
                        <div className="space-y-3">
                            <input
                                type="email"
                                placeholder="User Email (Unstop)"
                                className="w-full bg-background border border-border p-3 text-sm focus:border-primary outline-none"
                                value={referralEmail}
                                onChange={(e) => setReferralEmail(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Proof URL (Screenshot)"
                                className="w-full bg-background border border-border p-3 text-sm focus:border-primary outline-none"
                                value={referralProof}
                                onChange={(e) => setReferralProof(e.target.value)}
                            />
                            <button
                                onClick={handleReferralSubmit}
                                disabled={submittingReferral}
                                className="w-full bg-secondary text-secondary-foreground font-bold py-3 uppercase tracking-wider hover:bg-secondary/90 disabled:opacity-50"
                            >
                                {submittingReferral ? 'Submitting...' : 'Submit Proof'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CADashboard;
