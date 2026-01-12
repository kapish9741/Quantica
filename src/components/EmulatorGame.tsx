import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    EJS_player: any;
    EJS_core: string;
    EJS_pathtodata: string;
    EJS_gameUrl: string;
  }
}

interface EmulatorGameProps {
  gameUrl: string;
  core?: string; 
  name?: string;
}

const EmulatorGame = ({ gameUrl, core = 'nes', name }: EmulatorGameProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existingScript = document.getElementById('emulatorjs-script');
    if (existingScript) {
      existingScript.remove();
    }
    
    window.EJS_player = '#game';
    window.EJS_core = core;
    window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
    window.EJS_gameUrl = gameUrl;
    
    const script = document.createElement('script');
    script.id = 'emulatorjs-script';
    script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
    script.async = true;
    
    if (containerRef.current) {
    }
    
    document.body.appendChild(script);

    return () => {
      const script = document.getElementById('emulatorjs-script');
      if (script) {
        script.remove();
      }
    };
  }, [gameUrl, core]);

  return (
    <div className="w-full h-full bg-black relative">
       <div id="game" className="w-full h-full"></div>
    </div>
  );
};

export default EmulatorGame;
