import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, Palette, Check, Coins, Gem } from 'lucide-react';

const SKINS = [
  { id: 'default', name: 'Shadow Veil', desc: 'The default dark warrior', rarity: 'common', cost: { coins: 0, gems: 0 }, color: '#7f1d1d' },
  { id: 'crimson', name: 'Crimson Knight', desc: 'Blood-red armor set', rarity: 'uncommon', cost: { coins: 200, gems: 0 }, color: '#dc2626' },
  { id: 'frost', name: 'Frost Walker', desc: 'Ice-blue crystalline form', rarity: 'rare', cost: { coins: 0, gems: 15 }, color: '#38bdf8' },
  { id: 'golden', name: 'Golden Hero', desc: 'Legendary gold armor', rarity: 'legendary', cost: { coins: 1000, gems: 50 }, color: '#D4A843' },
  { id: 'void', name: 'Void Walker', desc: 'Pure darkness manifest', rarity: 'epic', cost: { coins: 0, gems: 30 }, color: '#581c87' },
];

const RARITY_COLORS: Record<string, string> = { common: '#8D99AE', uncommon: '#4CC9F0', rare: '#D4A843', epic: '#9b59b6', legendary: '#FF4800' };

export default function Skins() {
  const navigate = useNavigate();
  const { saveData, updateSave } = useGameStore();
  const [msg, setMsg] = useState('');
  const currentSkin = saveData.player.currentSkin;
  const unlocked = saveData.player.unlockedSkins;
  const p = saveData.player;

  const unlock = (skin: typeof SKINS[0]) => {
    if (unlocked.includes(skin.id)) {
      updateSave({ player: { ...p, currentSkin: skin.id } });
      setMsg(`Equipped ${skin.name}!`);
      setTimeout(() => setMsg(''), 2000);
      return;
    }
    if (p.coins < (skin.cost.coins ?? 0) || p.gems < (skin.cost.gems ?? 0)) {
      setMsg('Not enough currency!'); setTimeout(() => setMsg(''), 2000); return;
    }
    updateSave({ player: { ...p, coins: p.coins - (skin.cost.coins ?? 0), gems: p.gems - (skin.cost.gems ?? 0), unlockedSkins: [...unlocked, skin.id], currentSkin: skin.id } });
    setMsg(`Unlocked ${skin.name}!`);
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#8D99AE] hover:text-[#F8F9FA] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <h1 className="text-3xl font-bold text-[#D4A843] mb-6 flex items-center gap-3">
          <Palette className="w-8 h-8" /> Skins
        </h1>
        {msg && <div className="mb-4 p-3 bg-[#D4A843]/10 border border-[#D4A843]/30 rounded-xl text-[#D4A843] text-sm font-semibold text-center">{msg}</div>}

        <div className="space-y-3">
          {SKINS.map((skin) => {
            const isUnlocked = unlocked.includes(skin.id);
            const isEquipped = currentSkin === skin.id;
            return (
              <div key={skin.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${isEquipped ? 'bg-[#D4A843]/10 border-[#D4A843]/30' : 'bg-[#2D2D3A] border-[#8D99AE]/20'}`}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: skin.color + '20' }}>
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: skin.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{skin.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: RARITY_COLORS[skin.rarity] + '20', color: RARITY_COLORS[skin.rarity] }}>{skin.rarity}</span>
                  </div>
                  <p className="text-xs text-[#8D99AE]">{skin.desc}</p>
                </div>
                <button onClick={() => unlock(skin)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isEquipped ? 'bg-[#4CC9F0]/20 text-[#4CC9F0] border border-[#4CC9F0]/30 cursor-default' :
                    isUnlocked ? 'bg-[#2D2D3A] text-[#F8F9FA] border border-[#8D99AE]/20 hover:bg-[#3D3D4A]' :
                    'bg-[#D4A843] text-[#1A1A24] hover:bg-[#e5b94c]'
                  }`}>
                  {isEquipped ? <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Equipped</span> :
                   isUnlocked ? 'Equip' :
                   <span className="flex items-center gap-1">
                     {skin.cost.coins ? <><Coins className="w-3 h-3" />{skin.cost.coins}</> : <><Gem className="w-3 h-3" />{skin.cost.gems}</>}
                   </span>}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
