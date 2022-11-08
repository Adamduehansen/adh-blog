export const hands = ['rock', 'paper', 'scissor'] as const;
export type Hand = typeof hands[number];
export type Result = 'win' | 'lose' | 'draw';
export type Ai = () => Hand;

export interface GameResult {
  result: Result;
  player: Hand;
  computer: Hand;
}

function playGame(playerPlay: Hand, opponentAi: Ai): GameResult {
  const aiPlay = opponentAi();

  const gameResult: Pick<GameResult, 'player' | 'computer'> = {
    player: playerPlay,
    computer: aiPlay,
  };

  if (playerPlay === aiPlay) {
    return {
      ...gameResult,
      result: 'draw',
    };
  }

  if (
    (playerPlay === 'rock' && aiPlay === 'scissor') ||
    (playerPlay === 'scissor' && aiPlay === 'paper') ||
    (playerPlay === 'paper' && aiPlay === 'rock')
  ) {
    return {
      ...gameResult,
      result: 'win',
    };
  }

  return {
    ...gameResult,
    result: 'lose',
  };
}

export default playGame;
