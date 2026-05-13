import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, Gamepad2, RotateCcw } from 'lucide-react';
import { useState } from 'react';

const KEY_LABELS: Record<string, string> = {
  ArrowLeft: 'Left', ArrowRight: 'Right', ArrowUp: 'Up', Space: 'Space',
  KeyA: 'A', KeyD: 'D', KeyW: 'W', KeyX: 'X', KeyC: 'C', KeyJ: 'J', KeyK: 'K',
  KeyE: 'E', Escape: 'Esc', ShiftLeft: 'Shift',
};

export default function SettingsControls() {
  const navigate = useNavigate();
  const { settings, updateSettings, saveGame } = useGameStore();
  const c = settings.controls;
  const [listening, setListening] = useState<string | null>(null);

  const listenForKey = (action: string) => {
    setListening(action);
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      updateSettings({ controls: { ...c, [action]: e.code } });
      setListening(null);
      saveGame();
      window.removeEventListener('keydown', handler);
    };
    window.addEventListener('keydown', handler);
  };

  const resetDefaults = () => {
    updateSettings({ controls: { left: 'ArrowLeft', right: 'ArrowRight', jump: 'z', attack: 'x', dash: 'c', interact: 'e', pause: 'Escape' } });
    saveGame();
  };

  const actions = [
    { key: 'left', label: 'Move Left' },
    { key: 'right', label: 'Move Right' },
    { key: 'jump', label: 'Jump' },
    { key: 'attack', label: 'Attack' },
    { key: 'dash', label: 'Dash' },
    { key: 'interact', label: 'Interact' },
    { key: 'pause', label: 'Pause' },
  ];

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate('/options')} className="flex items-center gap-2 text-[#8D99AE] hover:text-[#F8F9FA] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <h1 className="text-3xl font-bold text-[#D4A843] mb-6 flex items-center gap-3">
          <Gamepad2 className="w-8 h-8" /> Controls
        </h1>

        {listening && (
          <div className="mb-4 p-3 bg-[#D4A843]/10 border border-[#D4A843]/30 rounded-xl text-[#D4A843] text-sm font-semibold text-center animate-pulse">
            Press any key for {actions.find(a => a.key === listening)?.label}...
          </div>
        )}

        <div className="space-y-2">
          {actions.map((action) => (
            <button key={action.key} onClick={() => listenForKey(action.key)} disabled={!!listening}
              className={`w-full flex items-center gap-4 p-4 bg-[#2D2D3A] rounded-xl border transition-all ${listening === action.key ? 'border-[#D4A843] bg-[#D4A843]/10' : 'border-[#8D99AE]/20 hover:border-[#D4A843]/30'}`}>
              <span className="font-bold flex-1 text-left">{action.label}</span>
              <kbd className="px-3 py-1 bg-[#1A1A24] rounded-lg text-sm font-mono text-[#D4A843] border border-[#8D99AE]/20">
                {KEY_LABELS[c[action.key as keyof typeof c]] || c[action.key as keyof typeof c]}
              </kbd>
            </button>
          ))}
        </div>

        <button onClick={resetDefaults} className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-[#8D99AE]/10 border border-[#8D99AE]/20 rounded-xl text-[#8D99AE] hover:bg-[#8D99AE]/20 transition-colors">
          <RotateCcw className="w-4 h-4" /> Reset to Defaults
        </button>
      </div>
    </div>
  );
}
