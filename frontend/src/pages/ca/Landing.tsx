
import { useParams } from 'react-router-dom';
import GlitchText from '../../components/GlitchText';

const CALanding = () => {
    const { code } = useParams();

    const handleRegister = () => {
        // In real impl, track click then redirect
        window.location.href = 'https://unstop.com/competitions/xyz';
    };

    return (
        <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                INVITED BY AGENT <GlitchText text={code || 'UNKNOWN'} className="text-primary" />
            </h1>
            <p className="max-w-xl text-muted-foreground mb-8">
                You have been selected to participate in Delhi NCR's Biggest Esports Fest.
                Register now on Unstop to secure your spot.
            </p>
            <button
                onClick={handleRegister}
                className="bg-secondary text-secondary-foreground px-8 py-4 text-xl font-bold uppercase tracking-widest clip-corner hover:scale-105 transition-transform"
            >
                Register on Unstop
            </button>
        </div>
    );
};

export default CALanding;
