import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, Volume2, Gamepad2, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function Options() {
  const navigate = useNavigate();
  const { resetSave } = useGameStore();
  const [showReset, setShowReset] = useState(false);

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#8D99AE] hover:text-[#F8F9FA] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <h1 className="text-3xl font-bold text-[#D4A843] mb-6">Options</h1>

        <div className="flex flex-col gap-3">
          <OptionButton icon={<Monitor className="w-5 h-5 text-[#4CC9F0]" />} label="Graphics" desc="Quality, shadows, particles" onClick={() => navigate('/settings/graphics')} />
          <OptionButton icon={<Volume2 className="w-5 h-5 text-[#D4A843]" />} label="Audio" desc="Music, SFX volume" onClick={() => navigate('/settings/audio')} />
          <OptionButton icon={<Gamepad2 className="w-5 h-5 text-[#E63946]" />} label="Controls" desc="Keybinds, touch layout" onClick={() => navigate('/settings/controls')} />
          <OptionButton icon={<Save className="w-5 h-5 text-[#4CC9F0]" />} label="Save / Load" desc="Manage save data" onClick={() => navigate('/save')} />

          <div className="mt-4 pt-4 border-t border-[#8D99AE]/20">
            <button onClick={() => setShowReset(true)} className="w-full flex items-center gap-3 p-4 bg-[#E63946]/10 border border-[#E63946]/20 rounded-xl text-[#E63946] hover:bg-[#E63946]/20 transition-colors">
              <RotateCcw className="w-5 h-5" />
              <div className="text-left">
                <div className="font-bold">Reset Progress</div>
                <div className="text-xs text-[#E63946]/70">Delete all save data</div>
              </div>
            </button>
          </div>
        </div>

        {showReset && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-[#2D2D3A] rounded-2xl p-6 border border-[#E63946]/30 max-w-sm w-full mx-4">
              <div className="flex items-center gap-3 text-[#E63946] mb-4">
                <AlertTriangle className="w-8 h-8" />
                <h2 className="text-xl font-bold">Reset All Progress?</h2>
              </div>
              <p className="text-[#8D99AE] mb-6">This will delete all save data including levels, coins, gems, and achievements. This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowReset(false)} className="flex-1 py-2.5 bg-[#8D99AE]/20 rounded-xl text-[#F8F9FA] hover:bg-[#8D99AE]/30 transition-colors">Cancel</button>
                <button onClick={() => { resetSave(); setShowReset(false); navigate('/'); }} className="flex-1 py-2.5 bg-[#E63946] rounded-xl text-white font-bold hover:bg-[#ff4d4d] transition-colors">Reset</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OptionButton({ icon, label, desc, onClick }: { icon: React.ReactNode; label: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-4 p-4 bg-[#2D2D3A] rounded-xl border border-[#8D99AE]/20 hover:border-[#D4A843]/30 hover:bg-[#3D3D4A] transition-all text-left">
      {icon}
      <div>
        <div className="font-bold text-[#F8F9FA]">{label}</div>
        <div className="text-xs text-[#8D99AE]">{desc}</div>
      </div>
    </button>
  );
}
