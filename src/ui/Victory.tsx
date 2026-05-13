import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { Trophy, Star, Clock, ChevronRight, Home, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Victory() {
  const navigate = useNavigate();
  const { score, stars, levelTime, currentLevel, saveData, updateSave, nextLevel, startGame } = useGameStore();
  const [showStars, setShowStars] = useState(0);

  useEffect(() => {
    // Unlock next level
    const nextId = currentLevel + 1;
    const newLevels = { ...saveData.levels };
    if (nextId <= 10 && newLevels[nextId]) {
      newLevels[nextId] = { ...newLevels[nextId], unlocked: true };
    }
    newLevels[currentLevel] = {
      ...newLevels[currentLevel],
      completed: true,
      stars: Math.max(newLevels[currentLevel]?.stars || 0, stars),
      bestTime: newLevels[currentLevel]?.bestTime ? Math.min(newLevels[currentLevel].bestTime, levelTime) : levelTime,
      bestScore: Math.max(newLevels[currentLevel]?.bestScore || 0, score),
    };
    const newStats = {
      ...saveData.stats,
      totalCoins: saveData.stats.totalCoins + saveData.player.coins,
      totalGems: saveData.stats.totalGems + saveData.player.gems,
      totalPlayTime: saveData.stats.totalPlayTime + levelTime,
      levelsCompleted: Math.max(saveData.stats.levelsCompleted, currentLevel),
    };
    const newPlayer = { ...saveData.player, coins: saveData.player.coins + Math.floor(score / 10), xp: saveData.player.xp + Math.floor(score / 20) };
    updateSave({ levels: newLevels, stats: newStats, player: newPlayer });

    // Animate stars
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= stars; i++) {
      timers.push(setTimeout(() => setShowStars(i), i * 400));
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  const hasNext = currentLevel < 10;

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA] flex items-center justify-center px-4">
      <div className="text-center max-w-sm w-full">
        <div className="w-20 h-20 bg-[#D4A843]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4A843]/20">
          <Trophy className="w-10 h-10 text-[#D4A843]" />
        </div>
        <h1 className="text-4xl font-bold text-[#D4A843] mb-2">Victory!</h1>
        <p className="text-[#8D99AE] mb-4">Level {currentLevel} Complete</p>

        {/* Stars */}
        <div className="flex justify-center gap-3 mb-6">
          {[1, 2, 3].map((s) => (
            <Star key={s} className={`w-12 h-12 transition-all duration-500 ${s <= showStars ? 'text-[#D4A843] fill-[#D4A843] scale-100' : 'text-[#8D99AE]/20 scale-75'}`}
              style={{ transitionDelay: `${s * 200}ms` }} />
          ))}
        </div>

        {/* Stats */}
        <div className="bg-[#2D2D3A] rounded-xl p-4 border border-[#8D99AE]/20 mb-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-[#8D99AE] text-xs mb-1"><Trophy className="w-3 h-3" /> Score</div>
              <div className="text-xl font-bold text-[#D4A843] font-mono">{score.toLocaleString()}</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-[#8D99AE] text-xs mb-1"><Clock className="w-3 h-3" /> Time</div>
              <div className="text-xl font-bold text-[#F8F9FA] font-mono">{Math.floor(levelTime / 60)}:{String(Math.floor(levelTime % 60)).padStart(2, '0')}</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {hasNext && (
            <button onClick={nextLevel} className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#D4A843] text-[#1A1A24] rounded-xl font-bold text-lg hover:bg-[#e5b94c] transition-all hover:scale-105">
              Next Level <ChevronRight className="w-5 h-5" />
            </button>
          )}
          <button onClick={() => startGame(currentLevel)} className="w-full flex items-center justify-center gap-2 py-3 bg-[#2D2D3A] border border-[#8D99AE]/20 rounded-xl text-[#F8F9FA] font-bold hover:bg-[#3D3D4A] transition-colors">
            <RotateCcw className="w-5 h-5" /> Replay
          </button>
          <button onClick={() => navigate('/levels')} className="w-full flex items-center justify-center gap-2 py-3 bg-[#2D2D3A] border border-[#8D99AE]/20 rounded-xl text-[#F8F9FA] font-bold hover:bg-[#3D3D4A] transition-colors">
            <Home className="w-5 h-5" /> Level Select
          </button>
        </div>
      </div>
    </div>
  );
}
