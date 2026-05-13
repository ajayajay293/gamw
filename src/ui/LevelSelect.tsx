import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, Lock, Star, Clock } from 'lucide-react';
import { LEVELS } from '@/levels/levels';

export default function LevelSelect() {
  const navigate = useNavigate();
  const { saveData } = useGameStore();

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA]">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#8D99AE] hover:text-[#F8F9FA] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <h1 className="text-3xl font-bold text-[#D4A843] mb-6">Select Level</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {LEVELS.map((level) => {
            const prog = saveData.levels[level.id];
            const unlocked = prog?.unlocked ?? level.id === 1;
            const completed = prog?.completed ?? false;
            const stars = prog?.stars ?? 0;

            return (
              <button
                key={level.id}
                onClick={() => unlocked && navigate(`/game/${level.id}`)}
                disabled={!unlocked}
                className={`relative rounded-xl p-4 border transition-all ${
                  unlocked
                    ? 'bg-[#2D2D3A] border-[#8D99AE]/20 hover:border-[#D4A843]/50 hover:scale-105 hover:shadow-lg hover:shadow-[#D4A843]/10 cursor-pointer'
                    : 'bg-[#1A1A24] border-[#8D99AE]/10 opacity-50 cursor-not-allowed'
                }`}
              >
                {!unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Lock className="w-8 h-8 text-[#8D99AE]/50" />
                  </div>
                )}
                <div className="text-2xl font-bold text-[#D4A843] mb-1">{level.id}</div>
                <div className="text-xs text-[#8D99AE] truncate mb-2">{level.name}</div>
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3].map((s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= stars ? 'text-[#D4A843] fill-[#D4A843]' : 'text-[#8D99AE]/30'}`} />
                  ))}
                </div>
                {completed && (
                  <div className="flex items-center gap-1 text-[10px] text-[#4CC9F0]">
                    <Clock className="w-3 h-3" />
                    <span className="font-mono">{prog?.bestTime ? `${Math.floor(prog.bestTime / 60)}:${String(Math.floor(prog.bestTime % 60)).padStart(2, '0')}` : '--:--'}</span>
                  </div>
                )}
                {/* Biome indicator */}
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                  level.biome === 'graveyard' ? 'bg-[#8D99AE]' :
                  level.biome === 'castle' ? 'bg-[#4CC9F0]' :
                  level.biome === 'underground' ? 'bg-[#7c3aed]' :
                  level.biome === 'snow' ? 'bg-[#a8d8ea]' :
                  level.biome === 'volcano' ? 'bg-[#FF4800]' :
                  level.biome === 'forest' ? 'bg-[#4ade80]' :
                  level.biome === 'desert' ? 'bg-[#D4A843]' : 'bg-[#F8F9FA]'
                }`} />
              </button>
            );
          })}
        </div>

        {/* Boss Rush unlock info */}
        <div className="mt-6 bg-[#2D2D3A] rounded-xl p-4 border border-[#FF4800]/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#FF4800] font-bold text-lg">Boss Rush</h3>
              <p className="text-[#8D99AE] text-sm">Defeat all bosses in sequence</p>
            </div>
            <button
              onClick={() => navigate('/bossrush')}
              disabled={!saveData.levels[9]?.completed}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                saveData.levels[9]?.completed
                  ? 'bg-[#FF4800] text-white hover:bg-[#ff5a1f] hover:scale-105'
                  : 'bg-[#2D2D3A] text-[#8D99AE]/50 border border-[#8D99AE]/20 cursor-not-allowed'
              }`}
            >
              {saveData.levels[9]?.completed ? 'Play' : 'Locked'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
