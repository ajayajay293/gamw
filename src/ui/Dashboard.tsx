import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, User, Coins, Gem, Star, Skull, Clock, Crosshair, Swords } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { saveData } = useGameStore();
  const s = saveData.stats;
  const p = saveData.player;

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#8D99AE] hover:text-[#F8F9FA] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <h1 className="text-3xl font-bold text-[#D4A843] mb-6 flex items-center gap-3">
          <User className="w-8 h-8" /> Player Dashboard
        </h1>

        {/* Level & XP */}
        <div className="bg-[#2D2D3A] rounded-xl p-4 border border-[#8D99AE]/20 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#8D99AE]">Level {p.level}</span>
            <span className="text-[#D4A843] font-mono">{p.xp} XP</span>
          </div>
          <div className="w-full h-2 bg-[#1A1A24] rounded-full overflow-hidden">
            <div className="h-full bg-[#D4A843] rounded-full" style={{ width: `${(p.xp % 100)}%` }} />
          </div>
        </div>

        {/* Currency */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#2D2D3A] rounded-xl p-4 border border-[#D4A843]/20 flex items-center gap-3">
            <Coins className="w-8 h-8 text-[#D4A843]" />
            <div>
              <div className="text-sm text-[#8D99AE]">Coins</div>
              <div className="text-xl font-bold text-[#D4A843] font-mono">{p.coins.toLocaleString()}</div>
            </div>
          </div>
          <div className="bg-[#2D2D3A] rounded-xl p-4 border border-[#4CC9F0]/20 flex items-center gap-3">
            <Gem className="w-8 h-8 text-[#4CC9F0]" />
            <div>
              <div className="text-sm text-[#8D99AE]">Gems</div>
              <div className="text-xl font-bold text-[#4CC9F0] font-mono">{p.gems}</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="bg-[#2D2D3A] rounded-xl p-4 border border-[#8D99AE]/20 mb-4">
          <h2 className="text-lg font-semibold text-[#4CC9F0] mb-3 flex items-center gap-2">
            <Swords className="w-5 h-5" /> Statistics
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <StatItem icon={<Star className="w-4 h-4 text-[#D4A843]" />} label="Levels Completed" value={`${s.levelsCompleted}/10`} />
            <StatItem icon={<Crosshair className="w-4 h-4 text-[#E63946]" />} label="Total Kills" value={s.totalKills.toLocaleString()} />
            <StatItem icon={<Skull className="w-4 h-4 text-[#8D99AE]" />} label="Total Deaths" value={s.totalDeaths.toLocaleString()} />
            <StatItem icon={<Clock className="w-4 h-4 text-[#4CC9F0]" />} label="Play Time" value={`${Math.floor(s.totalPlayTime / 60)}m`} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/levels')} className="py-3 bg-[#D4A843] text-[#1A1A24] rounded-xl font-bold hover:bg-[#e5b94c] transition-colors">
            Play
          </button>
          <button onClick={() => navigate('/inventory')} className="py-3 bg-[#2D2D3A] border border-[#8D99AE]/20 rounded-xl font-bold text-[#F8F9FA] hover:bg-[#3D3D4A] transition-colors">
            Inventory
          </button>
          <button onClick={() => navigate('/shop')} className="py-3 bg-[#2D2D3A] border border-[#8D99AE]/20 rounded-xl font-bold text-[#F8F9FA] hover:bg-[#3D3D4A] transition-colors">
            Shop
          </button>
          <button onClick={() => navigate('/achievements')} className="py-3 bg-[#2D2D3A] border border-[#8D99AE]/20 rounded-xl font-bold text-[#F8F9FA] hover:bg-[#3D3D4A] transition-colors">
            Achievements
          </button>
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A1A24] rounded-lg p-2.5">
      {icon}
      <div className="min-w-0">
        <div className="text-[10px] text-[#8D99AE] truncate">{label}</div>
        <div className="text-sm font-bold font-mono">{value}</div>
      </div>
    </div>
  );
}
