
import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../lib/api';

interface Task {
    id: string;
    title: string;
    description: string; // Brief
    instructions: string; // Detailed
    points: number;
    deadline: string;
    type: string;
    status: string;
}

interface TaskCardProps {
    task: Task;
    submitted: boolean;
    onSubmit?: () => void;
}

const TaskCard = ({ task, submitted, onSubmit }: TaskCardProps) => {
    const [uploading, setUploading] = useState(false);
    const [proofUrl, setProofUrl] = useState('');
    const [showInstructions, setShowInstructions] = useState(false);

    const handleSubmit = async () => {
        if (!proofUrl) return alert("Please enter a proof URL");
        setUploading(true);
        try {
            await api.post(`/ca/tasks/${task.id}/submit`, { proofUrl });
            alert("Submission successful!");
            if (onSubmit) onSubmit();
        } catch (error: any) {
            alert(error.response?.data?.message || "Submission failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 border ${submitted ? 'border-green-500/50 bg-green-500/10' : 'border-border bg-card'} relative overflow-hidden`}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-foreground">{task.title}</h3>
                    <div className="flex gap-2 mt-2">
                        <span className="text-xs uppercase px-2 py-1 bg-primary/20 text-primary border border-primary/50">
                            +{task.points} Tokens
                        </span>
                        <span className="text-xs uppercase px-2 py-1 bg-secondary/20 text-secondary border border-secondary/50">
                            {task.type}
                        </span>
                    </div>
                </div>
                {submitted && (
                    <span className="text-green-500 font-bold uppercase tracking-widest text-sm border border-green-500 px-2 py-1">
                        Completed
                    </span>
                )}
            </div>

            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {task.description}
            </p>

            <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="text-xs text-primary uppercase tracking-wider mb-4 hover:underline"
            >
                {showInstructions ? 'Hide Briefing' : 'Read Briefing'}
            </button>

            {showInstructions && (
                <div className="mb-4 p-4 bg-background/50 text-sm border-l-2 border-primary">
                    <p className="whitespace-pre-wrap">{task.instructions || task.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                </div>
            )}

            {!submitted && (
                <div className="mt-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="Paste proof URL (Screenshot/Link)"
                        className="flex-1 bg-background/50 border border-border p-2 text-sm focus:border-primary outline-none"
                        value={proofUrl}
                        onChange={(e) => setProofUrl(e.target.value)}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={uploading}
                        className="bg-primary text-primary-foreground px-4 py-2 text-sm font-bold uppercase hover:bg-primary/90 disabled:opacity-50"
                    >
                        {uploading ? '...' : 'Submit'}
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default TaskCard;
