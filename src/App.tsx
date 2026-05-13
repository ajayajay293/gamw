import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainMenu from '@/ui/MainMenu';
import Dashboard from '@/ui/Dashboard';
import LevelSelect from '@/ui/LevelSelect';
import WorldMap from '@/ui/WorldMap';
import Options from '@/ui/Options';
import Profile from '@/ui/Profile';
import Achievements from '@/ui/Achievements';
import Inventory from '@/ui/Inventory';
import Shop from '@/ui/Shop';
import Skins from '@/ui/Skins';
import DailyReward from '@/ui/DailyReward';
import Challenges from '@/ui/Challenges';
import Leaderboard from '@/ui/Leaderboard';
import Tutorial from '@/ui/Tutorial';
import Credits from '@/ui/Credits';
import SaveLoad from '@/ui/SaveLoad';
import SettingsGraphics from '@/ui/SettingsGraphics';
import SettingsAudio from '@/ui/SettingsAudio';
import SettingsControls from '@/ui/SettingsControls';
import GameScreen from '@/ui/GameScreen';
import GameOver from '@/ui/GameOver';
import Victory from '@/ui/Victory';
import BossRush from '@/ui/BossRush';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/levels" element={<LevelSelect />} />
        <Route path="/worldmap" element={<WorldMap />} />
        <Route path="/options" element={<Options />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/skins" element={<Skins />} />
        <Route path="/dailyreward" element={<DailyReward />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/bossrush" element={<BossRush />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/save" element={<SaveLoad />} />
        <Route path="/settings/graphics" element={<SettingsGraphics />} />
        <Route path="/settings/audio" element={<SettingsAudio />} />
        <Route path="/settings/controls" element={<SettingsControls />} />
        <Route path="/game/:levelId" element={<GameScreen />} />
        <Route path="/gameover" element={<GameOver />} />
        <Route path="/victory" element={<Victory />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
