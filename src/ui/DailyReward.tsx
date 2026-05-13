import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, Gift, Coins, Gem, Star, Check } from 'lucide-react';

const REWARDS = [
  { day: 1, reward: '50 Coins', amount: { coins: 50 }, icon: <Coins className="w-5 h-5 text-[#D4A843]" /> },
  { day: 2, reward: '100 Coins', amount: { coins: 100 }, icon: <Coins className="w-5 h-5 text-[#D4A843]" /> },
  { day: 3, reward: '5 Gems', amount: { gems: 5 }, icon: <Gem className="w-5 h-5 text-[#4CC9F0]" /> },
  { day: 4, reward: '150 Coins', amount: { coins: 150 }, icon: <Coins className="w-5 h-5 text-[#D4A843]" /> },
  { day: 5, reward: '10 Gems', amount: { gems: 10 }, icon: <Gem className="w-5 h-5 text-[#4CC9F0]" /> },
  { day: 6, reward: '250 Coins', amount: { coins: 250 }, icon: <Coins className="w-5 h-5 text-[#D4A843]" /> },
  { day: 7, reward: '20 Gems', amount: { gems: 20 }, icon: <Star className="w-5 h-5 text-[#FF4800]" /> },
];

export default function DailyReward() {
  const navigate = useNavigate();
  const { saveData, updateSave } = useGameStore();
  const [claimed, setClaimed] = useState(false);
  const [msg, setMsg] = useState('');
  const today = new Date().toDateString();
  const canClaim = saveData.dailyReward.lastClaimed !== today;
  const streak = saveData.dailyReward.streak;

  const claim = () => {
    if (!canClaim || claimed) return;
    const dayIndex = (streak % 7);
    const reward = REWARDS[dayIndex];
    const newPlayer = { ...saveData.player };
    if (reward.amount.coins) newPlayer.coins += reward.amount.coins;
    if (reward.amount.gems) newPlayer.gems += reward.amount.gems;
    updateSave({ player: newPlayer, dailyReward: { lastClaimed: today, streak: streak + 1 } });
    setClaimed(true);
    setMsg(`Claimed ${reward.reward}! Streak: ${streak + 1} days`);
  };

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#8D99AE] hover:text-[#F8F9FA] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div className="text-center mb-6">
          <Gift className="w-12 h-12 text-[#D4A843] mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-[#D4A843]">Daily Reward</h1>
          <p className="text-[#8D99AE] text-sm mt-1">Streak: <span className="text-[#FF4800] font-bold">{streak} days</span></p>
        </div>

        {msg && <div className="mb-4 p-3 bg-[#4CC9F0]/10 border border-[#4CC9F0]/30 rounded-xl text-[#4CC9F0] text-sm font-semibold text-center">{msg}</div>}

        {/* Claim Button */}
        <button onClick={claim} disabled={!canClaim || claimed}
          className={`w-full py-4 rounded-xl font-bold text-lg mb-6 transition-all ${
            canClaim && !claimed ? 'bg-[#D4A843] text-[#1A1A24] hover:bg-[#e5b94c] hover:scale-105 shadow-lg shadow-[#D4A843]/20' :
            'bg-[#8D99AE]/10 text-[#8D99AE]/50 cursor-not-allowed'
          }`}>
          {claimed ? 'Claimed!' : canClaim ? 'Claim Reward' : 'Come back tomorrow'}
        </button>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {REWARDS.map((r, i) => {
            const isPast = i < (streak % 7);
            const isToday = i === (streak % 7) && canClaim;
            return (
              <div key={r.day} className={`rounded-xl p-2 border text-center transition-all ${
                isToday ? 'bg-[#D4A843]/10 border-[#D4A843]/40' :
                isPast ? 'bg-[#4CC9F0]/5 border-[#4CC9F0]/20' :
                'bg-[#2D2D3A] border-[#8D99AE]/10'
              }`}>
                <div className="text-[10px] text-[#8D99AE]">Day {r.day}</div>
                <div className="flex justify-center my-1">{r.icon}</div>
                <div className="text-[10px] font-semibold truncate">{r.reward}</div>
                {isPast && <Check className="w-3 h-3 text-[#4CC9F0] mx-auto mt-0.5" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
