import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { Skull, RotateCcw, Home, Trophy, Clock } from 'lucide-react';
import { useEffect } from 'react';

export default function GameOver() {
  const navigate = useNavigate();
  const { score, levelTime, currentLevel, startGame, saveData, updateSave } = useGameStore();

  useEffect(() => {
    const newStats = { ...saveData.stats, totalDeaths: saveData.stats.totalDeaths + 1, totalPlayTime: saveData.stats.totalPlayTime + levelTime };
    const newLevels = { ...saveData.levels, [currentLevel]: { ...saveData.levels[currentLevel], deaths: (saveData.levels[currentLevel]?.deaths || 0) + 1 } };
    updateSave({ stats: newStats, levels: newLevels });
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA] flex items-center justify-center px-4">
      <div className="text-center max-w-sm w-full">
        <div className="w-20 h-20 bg-[#E63946]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E63946]/20">
          <Skull className="w-10 h-10 text-[#E63946]" />
        </div>
        <h1 className="text-4xl font-bold text-[#E63946] mb-2">Defeated</h1>
        <p className="text-[#8D99AE] mb-6">The shadows have claimed you...</p>

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
          <button onClick={() => startGame(currentLevel)} className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#D4A843] text-[#1A1A24] rounded-xl font-bold text-lg hover:bg-[#e5b94c] transition-all hover:scale-105">
            <RotateCcw className="w-5 h-5" /> Try Again
          </button>
          <button onClick={() => navigate('/levels')} className="w-full flex items-center justify-center gap-2 py-3 bg-[#2D2D3A] border border-[#8D99AE]/20 rounded-xl text-[#F8F9FA] font-bold hover:bg-[#3D3D4A] transition-colors">
            <Home className="w-5 h-5" /> Level Select
          </button>
        </div>
      </div>
    </div>
  );
}
