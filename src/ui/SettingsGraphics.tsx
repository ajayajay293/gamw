import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, Monitor, Sparkles, Vibrate } from 'lucide-react';

export default function SettingsGraphics() {
  const navigate = useNavigate();
  const { settings, updateSettings, saveGame } = useGameStore();
  const g = settings.graphics;

  const toggle = (key: keyof typeof g) => {
    updateSettings({ graphics: { ...g, [key]: !g[key] } });
    setTimeout(saveGame, 100);
  };

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate('/options')} className="flex items-center gap-2 text-[#8D99AE] hover:text-[#F8F9FA] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <h1 className="text-3xl font-bold text-[#D4A843] mb-6 flex items-center gap-3">
          <Monitor className="w-8 h-8" /> Graphics
        </h1>

        <div className="space-y-3">
          <ToggleRow icon={<Monitor className="w-5 h-5 text-[#4CC9F0]" />} label="Quality" desc="Visual fidelity" value={g.quality === 'high'} onToggle={() => updateSettings({ graphics: { ...g, quality: g.quality === 'high' ? 'medium' : 'high' } })} />
          <ToggleRow icon={<Sparkles className="w-5 h-5 text-[#D4A843]" />} label="Particles" desc="Dust, sparks, magic effects" value={g.particles} onToggle={() => toggle('particles')} />
          <ToggleRow icon={<Monitor className="w-5 h-5 text-[#8D99AE]" />} label="Shadows" desc="Dynamic shadows" value={g.shadows} onToggle={() => toggle('shadows')} />
          <ToggleRow icon={<Vibrate className="w-5 h-5 text-[#E63946]" />} label="Screen Shake" desc="Camera shake on impact" value={g.screenShake} onToggle={() => toggle('screenShake')} />

          <div className="bg-[#2D2D3A] rounded-xl p-4 border border-[#8D99AE]/20">
            <div className="flex items-center justify-between">
              <div><div className="font-bold">FPS Limit</div><div className="text-xs text-[#8D99AE]">Target frame rate</div></div>
              <div className="flex gap-2">
                {[30, 60, 120].map(fps => (
                  <button key={fps} onClick={() => { updateSettings({ graphics: { ...g, fpsLimit: fps } }); saveGame(); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${g.fpsLimit === fps ? 'bg-[#D4A843] text-[#1A1A24]' : 'bg-[#1A1A24] text-[#8D99AE]'}`}>{fps}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ icon, label, desc, value, onToggle }: { icon: React.ReactNode; label: string; desc: string; value: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-[#2D2D3A] rounded-xl border border-[#8D99AE]/20">
      {icon}
      <div className="flex-1"><div className="font-bold">{label}</div><div className="text-xs text-[#8D99AE]">{desc}</div></div>
      <button onClick={onToggle} className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-[#4CC9F0]' : 'bg-[#8D99AE]/30'}`}>
        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${value ? 'translate-x-6' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}
