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
  core?: string; // e.g., 'nes', 'snes', 'gba'
  name?: string;
}

const EmulatorGame = ({ gameUrl, core = 'nes', name }: EmulatorGameProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cleanup previous instances if any
    const existingScript = document.getElementById('emulatorjs-script');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Configure EmulatorJS
    window.EJS_player = '#game';
    window.EJS_core = core;
    window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
    window.EJS_gameUrl = gameUrl;
    
    // Load script
    const script = document.createElement('script');
    script.id = 'emulatorjs-script';
    script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
    script.async = true;
    
    if (containerRef.current) {
        // Ensure container is empty before appending (though EJS usually handles #game target)
        // detailed integration usually requires a specific div id. 
        // We will target the div inside this component.
    }
    
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const script = document.getElementById('emulatorjs-script');
      if (script) {
        script.remove();
      }
      // Consider if we need to clean up window.EJS_* variables
      // But re-mounting will overwrite them.
    };
  }, [gameUrl, core]);

  return (
    <div className="w-full h-full bg-black relative">
       {/* EmulatorJS requires a target div. Default is usually loose, but let's try to contain it. 
           Actually, the loader expects window.EJS_player to be the selector.
       */}
       <div id="game" className="w-full h-full"></div>
    </div>
  );
};

export default EmulatorGame;
