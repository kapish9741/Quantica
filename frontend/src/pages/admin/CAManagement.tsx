
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { motion } from 'framer-motion';

const CAManagement = () => {
    const [activeTab, setActiveTab] = useState<'submissions' | 'referrals' | 'create-task' | 'leaderboard'>('submissions');
    const [submissions, setSubmissions] = useState([]);
    const [referrals, setReferrals] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(false);

    // Create Task Form
    const [taskForm, setTaskForm] = useState({
        title: '',
        description: '',
        instructions: '',
        points: 10,
        deadline: '',
        type: 'social'
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [subRes, refRes, leadRes] = await Promise.all([
                api.get('/admin/submissions?status=pending'),
                api.get('/admin/referrals?status=pending'),
                api.get('/admin/leaderboard')
            ]);
            setSubmissions(subRes.data);
            setReferrals(refRes.data);
            setLeaderboard(leadRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleVerifySubmission = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await api.post(`/admin/submissions/${id}/verify`, {
                status,
                reason: status === 'rejected' ? 'Admin rejected' : undefined
            });
            fetchData(); // Refresh
        } catch (error) {
            alert('Action failed');
        }
    };

    const handleVerifyReferral = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await api.post(`/admin/referrals/${id}/verify`, {
                status,
                reason: status === 'rejected' ? 'Admin rejected' : undefined
            });
            fetchData(); // Refresh
        } catch (error) {
            alert('Action failed');
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/admin/tasks', taskForm);
            alert('Task created!');
            setTaskForm({ title: '', description: '', instructions: '', points: 10, deadline: '', type: 'social' });
        } catch (error) {
            alert('Failed to create task');
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 container mx-auto">
            <h1 className="text-3xl font-bold mb-8">CA Management Console</h1>

            <div className="flex gap-4 mb-8 border-b border-border pb-4 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('submissions')}
                    className={`uppercase tracking-wider whitespace-nowrap ${activeTab === 'submissions' ? 'text-primary font-bold' : 'text-muted-foreground'}`}
                >
                    Task Submissions ({submissions.length})
                </button>
                <button
                    onClick={() => setActiveTab('referrals')}
                    className={`uppercase tracking-wider whitespace-nowrap ${activeTab === 'referrals' ? 'text-primary font-bold' : 'text-muted-foreground'}`}
                >
                    Referrals ({referrals.length})
                </button>
                <button
                    onClick={() => setActiveTab('create-task')}
                    className={`uppercase tracking-wider whitespace-nowrap ${activeTab === 'create-task' ? 'text-primary font-bold' : 'text-muted-foreground'}`}
                >
                    Create Task
                </button>
                <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={`uppercase tracking-wider whitespace-nowrap ${activeTab === 'leaderboard' ? 'text-primary font-bold' : 'text-muted-foreground'}`}
                >
                    Leaderboard
                </button>
            </div>

            {/* TAB CONTENT */}

            {activeTab === 'submissions' && (
                <div className="space-y-4">
                    {submissions.length === 0 ? <p className="text-muted-foreground">No pending submissions.</p> :
                        submissions.map((sub: any) => (
                            <div key={sub.id} className="p-4 border border-border bg-card flex flex-col md:flex-row gap-4 justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg">{sub.task?.title}</p>
                                    <p className="text-sm text-muted-foreground">By: {sub.mbassador?.user?.email}</p>
                                    <a href={sub.proofUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm break-all">
                                        View Proof
                                    </a>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleVerifySubmission(sub.id, 'approved')}
                                        className="bg-green-500/20 text-green-500 border border-green-500/50 px-4 py-2 text-xs uppercase font-bold hover:bg-green-500/30"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleVerifySubmission(sub.id, 'rejected')}
                                        className="bg-red-500/20 text-red-500 border border-red-500/50 px-4 py-2 text-xs uppercase font-bold hover:bg-red-500/30"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )}

            {activeTab === 'referrals' && (
                <div className="space-y-4">
                    {referrals.length === 0 ? <p className="text-muted-foreground">No pending referrals.</p> :
                        referrals.map((ref: any) => (
                            <div key={ref.id} className="p-4 border border-border bg-card flex flex-col md:flex-row gap-4 justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg">Referral: {ref.userEmail}</p>
                                    <p className="text-sm text-muted-foreground">By: {ref.mbassador?.user?.email}</p>
                                    <a href={ref.proofUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm break-all">
                                        View Proof
                                    </a>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleVerifyReferral(ref.id, 'approved')}
                                        className="bg-green-500/20 text-green-500 border border-green-500/50 px-4 py-2 text-xs uppercase font-bold hover:bg-green-500/30"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleVerifyReferral(ref.id, 'rejected')}
                                        className="bg-red-500/20 text-red-500 border border-red-500/50 px-4 py-2 text-xs uppercase font-bold hover:bg-red-500/30"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )}

            {activeTab === 'create-task' && (
                <div className="max-w-2xl bg-card border border-border p-6">
                    <form onSubmit={handleCreateTask} className="space-y-4">
                        <input
                            className="w-full bg-background border border-border p-3 outline-none focus:border-primary"
                            placeholder="Task Title"
                            value={taskForm.title}
                            onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                            required
                        />
                        <textarea
                            className="w-full bg-background border border-border p-3 outline-none focus:border-primary h-20"
                            placeholder="Short Description"
                            value={taskForm.description}
                            onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                            required
                        />
                        <textarea
                            className="w-full bg-background border border-border p-3 outline-none focus:border-primary h-32"
                            placeholder="Detailed Instructions"
                            value={taskForm.instructions}
                            onChange={e => setTaskForm({ ...taskForm, instructions: e.target.value })}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                className="w-full bg-background border border-border p-3 outline-none focus:border-primary"
                                placeholder="Points"
                                value={taskForm.points}
                                onChange={e => setTaskForm({ ...taskForm, points: parseInt(e.target.value) })}
                                required
                            />
                            <input
                                type="date"
                                className="w-full bg-background border border-border p-3 outline-none focus:border-primary"
                                value={taskForm.deadline}
                                onChange={e => setTaskForm({ ...taskForm, deadline: e.target.value })}
                            />
                        </div>
                        <select
                            className="w-full bg-background border border-border p-3 outline-none focus:border-primary"
                            value={taskForm.type}
                            onChange={e => setTaskForm({ ...taskForm, type: e.target.value })}
                        >
                            <option value="social">Social Media</option>
                            <option value="referral">Referral</option>
                            <option value="content">Content Creation</option>
                        </select>
                        <button className="w-full bg-primary text-primary-foreground font-bold py-3 uppercase hover:bg-primary/90">
                            Create Mission
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'leaderboard' && (
                <div className="space-y-4">
                    <button
                        onClick={() => {
                            const csvContent = "data:text/csv;charset=utf-8,"
                                + "Rank,Name,Email,College,Tokens,Referrals\n"
                                + leaderboard.map((c: any, i: number) => `${i + 1},${c.user?.email},${c.user?.email},${c.college},${c.tokens},${c.referrals?.length || 0}`).join("\n");
                            const encodedUri = encodeURI(csvContent);
                            const link = document.createElement("a");
                            link.setAttribute("href", encodedUri);
                            link.setAttribute("download", "ca_leaderboard.csv");
                            document.body.appendChild(link);
                            link.click();
                        }}
                        className="bg-primary text-primary-foreground px-4 py-2 uppercase tracking-widest font-bold mb-4"
                    >
                        Export CSV
                    </button>

                    <div className="bg-card border border-border overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="p-3">Rank</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">College</th>
                                    <th className="p-3">Tokens</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((ca: any, index: number) => (
                                    <tr key={ca.id} className="border-t border-border">
                                        <td className="p-3 font-mono">#{index + 1}</td>
                                        <td className="p-3">{ca.user?.email}</td>
                                        <td className="p-3">{ca.college}</td>
                                        <td className="p-3 font-bold text-primary">{ca.tokens}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CAManagement;
