import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, User, Sword, Shield, Zap, Heart } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { saveData } = useGameStore();
  const p = saveData.player;

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#8D99AE] hover:text-[#F8F9FA] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <h1 className="text-3xl font-bold text-[#D4A843] mb-6 flex items-center gap-3">
          <User className="w-8 h-8" /> Profile
        </h1>
        {/* Character Card */}
        <div className="bg-[#2D2D3A] rounded-xl p-6 border border-[#D4A843]/20 mb-4 text-center">
          <div className="w-24 h-24 bg-[#7f1d1d] rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-[#D4A843]">
            <Sword className="w-10 h-10 text-[#D4A843]" />
          </div>
          <h2 className="text-xl font-bold text-[#F8F9FA]">Seraph</h2>
          <p className="text-[#8D99AE] text-sm">Level {p.level} Shadow Warrior</p>
          <div className="mt-3 w-full h-2 bg-[#1A1A24] rounded-full overflow-hidden">
            <div className="h-full bg-[#D4A843] rounded-full" style={{ width: `${(p.xp % 100)}%` }} />
          </div>
          <p className="text-xs text-[#8D99AE] mt-1">{p.xp} / {((p.level) * 100)} XP</p>
        </div>
        {/* Stats */}
        <div className="bg-[#2D2D3A] rounded-xl p-4 border border-[#8D99AE]/20 mb-4">
          <h3 className="text-[#4CC9F0] font-semibold mb-3">Base Stats</h3>
          <div className="space-y-3">
            <StatBar icon={<Heart className="w-4 h-4 text-[#E63946]" />} label="HP" value={p.maxHp} max={200} color="#E63946" />
            <StatBar icon={<Zap className="w-4 h-4 text-[#4CC9F0]" />} label="Energy" value={100} max={150} color="#4CC9F0" />
            <StatBar icon={<Sword className="w-4 h-4 text-[#FF4800]" />} label="Attack" value={15 + p.upgrades.attackLevel * 5} max={50} color="#FF4800" />
            <StatBar icon={<Shield className="w-4 h-4 text-[#8D99AE]" />} label="Defense" value={p.upgrades.hpLevel * 5} max={50} color="#8D99AE" />
          </div>
        </div>
        {/* Upgrades */}
        <div className="bg-[#2D2D3A] rounded-xl p-4 border border-[#8D99AE]/20">
          <h3 className="text-[#D4A843] font-semibold mb-3">Upgrades</h3>
          <div className="grid grid-cols-2 gap-3">
            <UpgradeItem label="HP" level={p.upgrades.hpLevel} max={10} />
            <UpgradeItem label="ATK" level={p.upgrades.attackLevel} max={10} />
            <UpgradeItem label="SPD" level={p.upgrades.speedLevel} max={10} />
            <UpgradeItem label="DASH" level={p.upgrades.dashLevel} max={10} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBar({ icon, label, value, max, color }: { icon: React.ReactNode; label: string; value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-xs text-[#8D99AE] w-16">{label}</span>
      <div className="flex-1 h-2 bg-[#1A1A24] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-mono w-8 text-right">{value}</span>
    </div>
  );
}

function UpgradeItem({ label, level, max }: { label: string; level: number; max: number }) {
  return (
    <div className="bg-[#1A1A24] rounded-lg p-2.5">
      <div className="text-xs text-[#8D99AE]">{label}</div>
      <div className="text-lg font-bold text-[#D4A843]">Lv.{level}</div>
      <div className="flex gap-0.5 mt-1">
        {Array.from({ length: max }, (_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i < level ? 'bg-[#D4A843]' : 'bg-[#8D99AE]/20'}`} />
        ))}
      </div>
    </div>
  );
}
