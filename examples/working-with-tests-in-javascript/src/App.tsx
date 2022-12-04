import { useState } from 'react';
import playGame, { Ai, GameResult, Hand } from './game';

interface Props {
  opponentAi: Ai;
}

export default function App({ opponentAi }: Props) {
  const [result, setResult] = useState<GameResult>();

  function handleClick(hand: Hand): () => void {
    return function () {
      setResult(playGame(hand, opponentAi));
    };
  }

  const resultContainer = result ? (
    <div>
      <p>
        Game result: <span>{result.result}</span>!
      </p>
      <p>You played {result.player}</p>
      <p>Ai played {result.computer}</p>
    </div>
  ) : (
    <div>Play a game!</div>
  );

  return (
    <div>
      {resultContainer}
      <button aria-label='paper' onClick={handleClick('paper')}>
        📄
      </button>
      <button aria-label='rock' onClick={handleClick('rock')}>
        🪨
      </button>
      <button aria-label='scissor' onClick={handleClick('scissor')}>
        ✂️
      </button>
    </div>
  );
}
