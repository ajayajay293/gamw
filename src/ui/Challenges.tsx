import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, Zap, Timer, Heart, Coins, Trophy } from 'lucide-react';

const CHALLENGES = [
  { id: 'time_l1', name: 'Speed Run L1', desc: 'Complete Level 1 under 30s', type: 'time_attack' as const, levelId: 1, target: 30, reward: { coins: 50, gems: 2 } },
  { id: 'no_dmg_l1', name: 'Untouchable L1', desc: 'Beat Level 1 without damage', type: 'no_damage' as const, levelId: 1, target: 0, reward: { coins: 100, gems: 5 } },
  { id: 'coin_l1', name: 'Coin Rush L1', desc: 'Collect all coins in Level 1', type: 'coin_rush' as const, levelId: 1, target: 16, reward: { coins: 75, gems: 3 } },
  { id: 'time_l5', name: 'Speed Run L5', desc: 'Complete Level 5 under 50s', type: 'time_attack' as const, levelId: 5, target: 50, reward: { coins: 100, gems: 5 } },
  { id: 'survival', name: 'Survival', desc: 'Beat Level 9 with half HP', type: 'survival' as const, levelId: 9, target: 1, reward: { coins: 200, gems: 10 } },
  { id: 'hardcore', name: 'Hardcore', desc: 'Beat Level 10 in one life', type: 'hardcore' as const, levelId: 10, target: 1, reward: { coins: 500, gems: 25 } },
];

export default function Challenges() {
  const navigate = useNavigate();
  const { saveData } = useGameStore();
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');

  const filtered = CHALLENGES.filter(c => {
    const completed = saveData.achievements[c.id]?.unlocked;
    if (filter === 'completed') return completed;
    if (filter === 'active') return !completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#8D99AE] hover:text-[#F8F9FA] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#D4A843] flex items-center gap-3">
            <Trophy className="w-8 h-8" /> Challenges
          </h1>
        </div>

        <div className="flex gap-2 mb-4">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${filter === f ? 'bg-[#D4A843] text-[#1A1A24]' : 'bg-[#2D2D3A] text-[#8D99AE] hover:text-[#F8F9FA]'}`}>{f}</button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map(c => {
            const completed = saveData.achievements[c.id]?.unlocked;
            return (
              <div key={c.id} className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${completed ? 'bg-[#D4A843]/5 border-[#D4A843]/20' : 'bg-[#2D2D3A] border-[#8D99AE]/20'}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${completed ? 'bg-[#D4A843]/20 text-[#D4A843]' : 'bg-[#8D99AE]/10 text-[#8D99AE]'}`}>
                  {c.type === 'time_attack' ? <Timer className="w-5 h-5" /> :
                   c.type === 'no_damage' ? <Heart className="w-5 h-5" /> :
                   c.type === 'coin_rush' ? <Coins className="w-5 h-5" /> :
                   <Zap className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${completed ? 'text-[#D4A843]' : 'text-[#F8F9FA]'}`}>{c.name}</span>
                    {completed && <CheckMini />}
                  </div>
                  <p className="text-xs text-[#8D99AE]">{c.desc}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-[#D4A843]"><Coins className="w-3 h-3" />{c.reward.coins}</div>
                  <div className="flex items-center gap-1 text-xs text-[#4CC9F0]"><Zap className="w-3 h-3" />{c.reward.gems}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CheckMini() { return <div className="w-4 h-4 bg-[#D4A843] rounded-full flex items-center justify-center"><svg className="w-2.5 h-2.5 text-[#1A1A24]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>; }
