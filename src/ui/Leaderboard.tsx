import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Clock, Star } from 'lucide-react';

const DUMMY_LEADERBOARD = [
  { rank: 1, name: 'ShadowKing', score: 28500, level: 10, time: 320, stars: 30 },
  { rank: 2, name: 'VeilWalker', score: 24100, level: 10, time: 380, stars: 28 },
  { rank: 3, name: 'NightBlade', score: 22300, level: 9, time: 290, stars: 25 },
  { rank: 4, name: 'CrimsonF', score: 19800, level: 9, time: 340, stars: 22 },
  { rank: 5, name: 'GhostStep', score: 17600, level: 8, time: 280, stars: 20 },
  { rank: 6, name: 'DarkSoul', score: 15400, level: 8, time: 310, stars: 18 },
  { rank: 7, name: 'FrostBit', score: 13200, level: 7, time: 250, stars: 16 },
  { rank: 8, name: 'EmberAsh', score: 11500, level: 7, time: 270, stars: 14 },
  { rank: 9, name: 'StarFall', score: 9800, level: 6, time: 220, stars: 12 },
  { rank: 10, name: 'You', score: 8200, level: 5, time: 200, stars: 10 },
];

export default function Leaderboard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'week' | 'today'>('all');

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#8D99AE] hover:text-[#F8F9FA] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div className="text-center mb-6">
          <Trophy className="w-12 h-12 text-[#D4A843] mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-[#D4A843]">Leaderboard</h1>
        </div>

        <div className="flex gap-2 mb-4">
          {(['all', 'week', 'today'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-colors ${filter === f ? 'bg-[#D4A843] text-[#1A1A24]' : 'bg-[#2D2D3A] text-[#8D99AE]'}`}>{f === 'all' ? 'All Time' : f}</button>
          ))}
        </div>

        <div className="space-y-1">
          {DUMMY_LEADERBOARD.map((entry) => (
            <div key={entry.rank} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${entry.name === 'You' ? 'bg-[#D4A843]/10 border-[#D4A843]/30' : entry.rank <= 3 ? 'bg-[#2D2D3A] border-[#D4A843]/20' : 'bg-[#2D2D3A]/50 border-[#8D99AE]/10'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${entry.rank === 1 ? 'bg-[#D4A843] text-[#1A1A24]' : entry.rank === 2 ? 'bg-[#8D99AE] text-[#1A1A24]' : entry.rank === 3 ? 'bg-[#cd7f32] text-[#1A1A24]' : 'bg-[#1A1A24] text-[#8D99AE]'}`}>
                {entry.rank <= 3 ? <Medal className="w-4 h-4" /> : entry.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-bold text-sm truncate ${entry.name === 'You' ? 'text-[#D4A843]' : ''}`}>{entry.name}</div>
                <div className="flex items-center gap-2 text-[10px] text-[#8D99AE]">
                  <span>Lv.{entry.level}</span>
                  <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-[#D4A843]" />{entry.stars}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-[#D4A843] font-mono">{entry.score.toLocaleString()}</div>
                <div className="text-[10px] text-[#8D99AE] flex items-center gap-0.5 justify-end"><Clock className="w-2.5 h-2.5" />{Math.floor(entry.time / 60)}:{String(entry.time % 60).padStart(2, '0')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
