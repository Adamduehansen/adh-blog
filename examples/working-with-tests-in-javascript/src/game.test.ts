import { describe, test, expect, vi } from 'vitest';
import playGame, { GameResult, Hand, Result } from './game';

describe('game', () => {
  test.each<{
    playerHand: Hand;
    computerHand: Hand;
    result: Result;
  }>([
    { playerHand: 'rock', computerHand: 'scissor', result: 'win' },
    { playerHand: 'scissor', computerHand: 'paper', result: 'win' },
    { playerHand: 'paper', computerHand: 'rock', result: 'win' },
    { playerHand: 'rock', computerHand: 'rock', result: 'draw' },
    { playerHand: 'paper', computerHand: 'paper', result: 'draw' },
    { playerHand: 'scissor', computerHand: 'scissor', result: 'draw' },
    { playerHand: 'scissor', computerHand: 'rock', result: 'lose' },
    { playerHand: 'rock', computerHand: 'paper', result: 'lose' },
    { playerHand: 'paper', computerHand: 'scissor', result: 'lose' },
  ])('should play game', ({ playerHand, computerHand, result }) => {
    // Arrange
    const expectedPlayResult: GameResult = {
      result: result,
      player: playerHand,
      computer: computerHand,
    };

    function ai(): Hand {
      return computerHand;
    }

    // Act
    const actualResult = playGame(playerHand, ai);

    // Assert
    expect(actualResult).toEqual(expectedPlayResult);
  });

  test('should play ai function', () => {
    // Arrange
    const mockAi = vi.fn((): Hand => 'scissor');

    // Act
    playGame('paper', mockAi);

    // Assert
    expect(mockAi).toHaveBeenCalled();
    expect(mockAi).toReturnWith('scissor');
  });
});
