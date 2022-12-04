import { describe, test, expect } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('Should render buttons', async () => {
    // Arrange
    render(<App opponentAi={() => 'paper'} />);

    // Act
    const buttons = await screen.findAllByRole('button');

    // Assert
    expect(buttons).toHaveLength(3);
  });

  test('should show winning result', async () => {
    // Arrange
    render(<App opponentAi={() => 'paper'} />);

    // Act
    const button = await screen.findByRole('button', {
      name: 'scissor',
    });

    fireEvent.click(button);

    // Assert
    const result = await screen.findByText('win');
    const playerHand = await screen.findByText(/scissor/);
    const aiHand = await screen.findByText(/paper/);
    expect(result).not.toBeNull();
    expect(playerHand).not.toBeNull();
    expect(aiHand).not.toBeNull();
  });
});
