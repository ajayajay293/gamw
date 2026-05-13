import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, Star, Lock, Trophy, Crosshair, MapPin, Gem, Swords } from 'lucide-react';

const ACHIEVEMENTS = [
  { id: 'first_blood', name: 'First Blood', desc: 'Defeat your first enemy', icon: <Swords className="w-5 h-5" />, category: 'combat' as const },
  { id: 'coin_collector', name: 'Coin Collector', desc: 'Collect 100 coins', icon: <Star className="w-5 h-5" />, category: 'collection' as const },
  { id: 'gem_hunter', name: 'Gem Hunter', desc: 'Collect 10 gems', icon: <Gem className="w-5 h-5" />, category: 'collection' as const },
  { id: 'level_1', name: 'Graveyard Shift', desc: 'Complete Level 1', icon: <MapPin className="w-5 h-5" />, category: 'exploration' as const },
  { id: 'level_5', name: 'Tree Climber', desc: 'Complete Level 5', icon: <MapPin className="w-5 h-5" />, category: 'exploration' as const },
  { id: 'boss_slayer', name: 'Boss Slayer', desc: 'Defeat the Gatekeeper', icon: <Crosshair className="w-5 h-5" />, category: 'combat' as const },
  { id: 'no_damage', name: 'Untouchable', desc: 'Complete a level without taking damage', icon: <Trophy className="w-5 h-5" />, category: 'challenge' as const },
  { id: 'speedrun', name: 'Speed Demon', desc: 'Complete a level under target time', icon: <Trophy className="w-5 h-5" />, category: 'challenge' as const },
  { id: 'combo_master', name: 'Combo Master', desc: 'Get a 10x combo', icon: <Swords className="w-5 h-5" />, category: 'combat' as const },
  { id: 'completionist', name: 'Completionist', desc: 'Complete all 10 levels', icon: <Trophy className="w-5 h-5" />, category: 'exploration' as const },
];

const CAT_COLORS: Record<string, string> = { combat: '#E63946', collection: '#D4A843', exploration: '#4CC9F0', challenge: '#9b59b6' };

export default function Achievements() {
  const navigate = useNavigate();
  const { saveData } = useGameStore();
  const unlocked = saveData.achievements;
  const total = ACHIEVEMENTS.length;
  const earned = Object.values(unlocked).filter((a: { unlocked: boolean }) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#8D99AE] hover:text-[#F8F9FA] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <h1 className="text-3xl font-bold text-[#D4A843] mb-2">Achievements</h1>
        <p className="text-[#8D99AE] text-sm mb-4">{earned} / {total} unlocked</p>
        <div className="w-full h-2 bg-[#2D2D3A] rounded-full overflow-hidden mb-6">
          <div className="h-full bg-[#D4A843] rounded-full transition-all" style={{ width: `${(earned / total) * 100}%` }} />
        </div>

        <div className="space-y-2">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlocked[ach.id]?.unlocked ?? false;
            return (
              <div key={ach.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isUnlocked ? 'bg-[#2D2D3A] border-[#D4A843]/20' : 'bg-[#1A1A24] border-[#8D99AE]/10 opacity-50'}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isUnlocked ? 'text-[#D4A843] bg-[#D4A843]/10' : 'text-[#8D99AE]/30 bg-[#8D99AE]/5'}`}>
                  {isUnlocked ? ach.icon : <Lock className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${isUnlocked ? 'text-[#F8F9FA]' : 'text-[#8D99AE]'}`}>{ach.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: CAT_COLORS[ach.category] + '20', color: CAT_COLORS[ach.category] }}>{ach.category}</span>
                  </div>
                  <p className="text-xs text-[#8D99AE] truncate">{ach.desc}</p>
                </div>
                {isUnlocked && <Star className="w-4 h-4 text-[#D4A843] fill-[#D4A843]" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
