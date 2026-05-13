import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, Lock, Star, MapPin } from 'lucide-react';
import { LEVELS } from '@/levels/levels';

export default function WorldMap() {
  const navigate = useNavigate();
  const { saveData } = useGameStore();

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#8D99AE] hover:text-[#F8F9FA] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <h1 className="text-3xl font-bold text-[#D4A843] mb-6 flex items-center gap-3">
          <MapPin className="w-8 h-8" /> World Map
        </h1>
        {/* SVG World Map */}
        <div className="relative bg-[#2D2D3A] rounded-2xl border border-[#8D99AE]/20 p-4 overflow-hidden">
          <svg viewBox="0 0 800 500" className="w-full">
            {/* Path lines */}
            {LEVELS.map((_level, i) => {
              if (i === 0) return null;
              const prev = LEVELS[i - 1];
              const px1 = 80 + (i - 1) * 70;
              const py1 = 250 + Math.sin(i * 0.8) * 120;
              const px2 = 80 + i * 70;
              const py2 = 250 + Math.sin((i + 1) * 0.8) * 120;
              const completed = saveData.levels[prev.id]?.completed;
              return (
                <line key={`path-${i}`} x1={px1} y1={py1} x2={px2} y2={py2}
                  stroke={completed ? '#D4A843' : '#8D99AE30'} strokeWidth="3" strokeDasharray={completed ? '0' : '8 4'} />
              );
            })}
            {/* Level nodes */}
            {LEVELS.map((level, i) => {
              const cx = 80 + i * 70;
              const cy = 250 + Math.sin((i + 1) * 0.8) * 120;
              const unlocked = saveData.levels[level.id]?.unlocked ?? level.id === 1;
              const completed = saveData.levels[level.id]?.completed;
              const stars = saveData.levels[level.id]?.stars ?? 0;
              return (
                <g key={level.id} onClick={() => unlocked && navigate(`/game/${level.id}`)} className={unlocked ? 'cursor-pointer' : ''}>
                  {/* Glow for completed */}
                  {completed && (
                    <circle cx={cx} cy={cy} r="28" fill="none" stroke="#D4A843" strokeWidth="1" opacity="0.4">
                      <animate attributeName="r" values="28;32;28" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Node circle */}
                  <circle cx={cx} cy={cy} r="22"
                    fill={completed ? '#D4A843' : unlocked ? '#2D2D3A' : '#1A1A24'}
                    stroke={completed ? '#D4A843' : unlocked ? '#4CC9F0' : '#8D99AE30'} strokeWidth="2" />
                  {/* Number */}
                  <text x={cx} y={cy + 5} textAnchor="middle" fill={completed ? '#1A1A24' : unlocked ? '#F8F9FA' : '#8D99AE50'} fontSize="14" fontWeight="bold">{level.id}</text>
                  {/* Lock */}
                  {!unlocked && (
                    <text x={cx} y={cy + 5} textAnchor="middle" fill="#8D99AE50" fontSize="12">
                      <Lock className="w-4 h-4" />
                    </text>
                  )}
                  {/* Stars */}
                  {completed && (
                    <g transform={`translate(${cx - 15}, ${cy - 38})`}>
                      {[0, 1, 2].map(s => (
                        <Star key={s} x={s * 11} y={0} className={`w-2.5 h-2.5 ${s < stars ? 'text-[#D4A843] fill-[#D4A843]' : 'text-[#8D99AE]/30'}`} />
                      ))}
                    </g>
                  )}
                  {/* Level name */}
                  <text x={cx} y={cy + 42} textAnchor="middle" fill="#8D99AE" fontSize="8">{level.name}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
