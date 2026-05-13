import { useParams, Navigate } from 'react-router-dom';
import GameCanvas from '@/canvas/GameCanvas';

export default function GameScreen() {
  const { levelId } = useParams<{ levelId: string }>();
  const id = parseInt(levelId || '1', 10);
  if (isNaN(id) || id < 1 || id > 10) return <Navigate to="/levels" replace />;
  return <GameCanvas levelId={id} />;
}
