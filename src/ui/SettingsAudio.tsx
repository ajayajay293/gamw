import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, Volume2, Music, AudioLines } from 'lucide-react';

export default function SettingsAudio() {
  const navigate = useNavigate();
  const { settings, updateSettings, saveGame } = useGameStore();
  const a = settings.audio;

  const updateVolume = (key: 'masterVolume' | 'musicVolume' | 'sfxVolume', val: number) => {
    updateSettings({ audio: { ...a, [key]: val } });
    setTimeout(saveGame, 100);
  };

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate('/options')} className="flex items-center gap-2 text-[#8D99AE] hover:text-[#F8F9FA] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <h1 className="text-3xl font-bold text-[#D4A843] mb-6 flex items-center gap-3"><Volume2 className="w-8 h-8" /> Audio</h1>

        <div className="space-y-4">
          <VolumeSlider icon={<Volume2 className="w-5 h-5 text-[#4CC9F0]" />} label="Master Volume" value={a.masterVolume} onChange={(v) => updateVolume('masterVolume', v)} />
          <VolumeSlider icon={<Music className="w-5 h-5 text-[#D4A843]" />} label="Music" value={a.musicVolume} onChange={(v) => updateVolume('musicVolume', v)} />
          <VolumeSlider icon={<AudioLines className="w-5 h-5 text-[#E63946]" />} label="SFX" value={a.sfxVolume} onChange={(v) => updateVolume('sfxVolume', v)} />
        </div>
      </div>
    </div>
  );
}

function VolumeSlider({ icon, label, value, onChange }: { icon: React.ReactNode; label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="bg-[#2D2D3A] rounded-xl p-4 border border-[#8D99AE]/20">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="font-bold">{label}</span>
        <span className="ml-auto text-sm text-[#8D99AE] font-mono">{Math.round(value * 100)}%</span>
      </div>
      <input type="range" min="0" max="100" value={value * 100} onChange={(e) => onChange(Number(e.target.value) / 100)}
        className="w-full h-2 bg-[#1A1A24] rounded-full appearance-none cursor-pointer accent-[#D4A843]" />
    </div>
  );
}
