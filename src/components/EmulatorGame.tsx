import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    EJS_player: any;
    EJS_core: string;
    EJS_pathtodata: string;
    EJS_gameUrl: string;
    EJS_defaultControls: any;
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
    
    // Player 1
    window.EJS_defaultControls = {
      0: {
        'LEFT': 37, 'RIGHT': 39, 'UP': 38, 'DOWN': 40, // Arrow Keys
        'A': 32,    // Space
        'B': 88,    // X
        'START': 13,// Enter
        'SELECT': 16,// Shift
        'L': 81,    // Q
        'R': 69     // E
      },
      // Player 2
      1: {
        'LEFT': 65, 'RIGHT': 68, 'UP': 87, 'DOWN': 83, // WASD
        'A': 32,    // Space
        'B': 88,    // X
        'START': 13,// Enter
        'SELECT': 16,// Shift
        'L': 81,    // Q
        'R': 69     // E
      }
    };
    
    window.EJS_gameUrl = gameUrl;
    
    const script = document.createElement('script');
    script.id = 'emulatorjs-script';
    script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
    script.async = true;
    
    if (containerRef.current) {
      //Temp fix
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
