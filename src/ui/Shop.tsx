import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, ShoppingBag, Coins, Gem, Heart, Zap, Shield, Sword, ChevronUp } from 'lucide-react';

interface ShopItemData {
  id: string; name: string; desc: string;
  cost: { coins: number; gems?: number };
  icon: React.ReactNode; color: string;
}

const SHOP_ITEMS: ShopItemData[] = [
  { id: 'hp_up', name: 'HP Upgrade', desc: '+15 Max HP', cost: { coins: 100 }, icon: <Heart className="w-5 h-5" />, color: '#E63946' },
  { id: 'atk_up', name: 'Attack Upgrade', desc: '+3 Attack Power', cost: { coins: 150 }, icon: <Sword className="w-5 h-5" />, color: '#FF4800' },
  { id: 'spd_up', name: 'Speed Upgrade', desc: '+5% Move Speed', cost: { coins: 120 }, icon: <ChevronUp className="w-5 h-5" />, color: '#4CC9F0' },
  { id: 'dash_up', name: 'Dash Upgrade', desc: '-0.1s Dash CD', cost: { coins: 200 }, icon: <Zap className="w-5 h-5" />, color: '#9b59b6' },
  { id: 'potion_hp', name: 'Health Potion', desc: 'Restore 25 HP', cost: { coins: 20 }, icon: <Heart className="w-5 h-5" />, color: '#E63946' },
  { id: 'potion_en', name: 'Energy Potion', desc: 'Restore 20 Energy', cost: { coins: 15 }, icon: <Zap className="w-5 h-5" />, color: '#4CC9F0' },
  { id: 'shield_boost', name: 'Shield Boost', desc: '+5 Defense', cost: { coins: 80 }, icon: <Shield className="w-5 h-5" />, color: '#8D99AE' },
  { id: 'gem_pack', name: 'Gem Pack', desc: '5 Gems', cost: { coins: 500, gems: 0 }, icon: <Gem className="w-5 h-5" />, color: '#4CC9F0' },
];

export default function Shop() {
  const navigate = useNavigate();
  const { saveData, updateSave } = useGameStore();
  const [msg, setMsg] = useState('');
  const p = saveData.player;

  const buy = (item: typeof SHOP_ITEMS[0]) => {
    if (p.coins < (item.cost.coins ?? 0)) { setMsg('Not enough coins!'); setTimeout(() => setMsg(''), 2000); return; }
    if (p.gems < (item.cost.gems ?? 0)) { setMsg('Not enough gems!'); setTimeout(() => setMsg(''), 2000); return; }

    const newCoins = p.coins - (item.cost.coins ?? 0);
    const newGems = p.gems - (item.cost.gems ?? 0);
    const newSave = { ...saveData, player: { ...p, coins: newCoins, gems: newGems } };

    if (item.id === 'hp_up') newSave.player.maxHp += 15;
    else if (item.id === 'atk_up') { /* applied in engine */ }
    else if (item.id === 'spd_up') { /* applied in engine */ }
    else if (item.id === 'dash_up') { /* applied in engine */ }
    else if (item.id === 'gem_pack') newSave.player.gems += 5;
    else {
      // Add to inventory
      const existing = newSave.inventory.find(i => i.id === item.id);
      if (existing) existing.quantity++;
      else newSave.inventory.push({ id: item.id, name: item.name, type: 'consumable', description: item.desc, icon: item.id.includes('hp') ? 'heart' : 'zap', quantity: 1, maxStack: 99, rarity: 'common', equipped: false });
    }

    updateSave(newSave);
    setMsg(`Purchased ${item.name}!`);
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#8D99AE] hover:text-[#F8F9FA] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#D4A843] flex items-center gap-3">
            <ShoppingBag className="w-8 h-8" /> Shop
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1"><Coins className="w-4 h-4 text-[#D4A843]" /><span className="text-[#D4A843] font-mono">{p.coins}</span></div>
            <div className="flex items-center gap-1"><Gem className="w-4 h-4 text-[#4CC9F0]" /><span className="text-[#4CC9F0] font-mono">{p.gems}</span></div>
          </div>
        </div>

        {msg && <div className="mb-4 p-3 bg-[#D4A843]/10 border border-[#D4A843]/30 rounded-xl text-[#D4A843] text-sm font-semibold text-center">{msg}</div>}

        <div className="grid grid-cols-2 gap-3">
          {SHOP_ITEMS.map((item) => {
            const canAfford = p.coins >= (item.cost.coins ?? 0) && p.gems >= (item.cost.gems ?? 0);
            return (
              <div key={item.id} className="bg-[#2D2D3A] rounded-xl p-3 border border-[#8D99AE]/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.color + '15', color: item.color }}>{item.icon}</div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate">{item.name}</div>
                    <div className="text-[10px] text-[#8D99AE]">{item.desc}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {item.cost.coins && <><Coins className="w-3 h-3 text-[#D4A843]" /><span className="text-xs text-[#D4A843] font-mono">{item.cost.coins}</span></>}
                    {item.cost.gems && <><Gem className="w-3 h-3 text-[#4CC9F0]" /><span className="text-xs text-[#4CC9F0] font-mono">{item.cost.gems}</span></>}
                  </div>
                  <button onClick={() => buy(item)} disabled={!canAfford}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${canAfford ? 'bg-[#D4A843] text-[#1A1A24] hover:bg-[#e5b94c]' : 'bg-[#8D99AE]/10 text-[#8D99AE]/50 cursor-not-allowed'}`}>
                    Buy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
