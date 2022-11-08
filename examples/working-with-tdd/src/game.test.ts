import { describe, test, expect } from 'vitest';
import createGame from './game';

describe('game', () => {
  test('should initialize new game', () => {
    // Arrange
    const expectedNumberOfLifes = 6;
    const expectedLettersInGuessedWord = [null, null, null, null];
    const expectedGuesses: string[] = [];

    // Act
    const game = createGame('Test');

    // Assert
    expect(game.numberOfLifes).toEqual(expectedNumberOfLifes);
    expect(game.gussedWord).toEqual(expectedLettersInGuessedWord);
    expect(game.guesses).toEqual(expectedGuesses);
  });

  test.each([
    ['a'], // Incorrect letter guess
    ['any-guess'], // Incorrect word guess
  ])('should decrease lifes by 1 on incorrect guess', () => {
    // Arrange
    const expectedNumberOfLifes = 5;
    let game = createGame('test');

    // Act
    game = game.makeGuess('a');

    // Assert
    expect(game.numberOfLifes).toEqual(expectedNumberOfLifes);
  });

  test.each([
    ['t'], // Correct guess
    ['x'], // Incorrect guess
  ])('should add guess to list of guesses in game', (guess) => {
    // Arrange
    let game = createGame('test');

    // Act
    game = game.makeGuess(guess);

    // Assert
    expect(game.guesses).toContain(guess);
  });

  test.each([
    ['e', [null, 'e', null, null]], // Guess with one correct letter
    ['t', ['t', null, null, 't']], // Guess with two correct letters
    ['test', ['t', 'e', 's', 't']], // Guess with
  ])('Should update gussedWord with correct guess', (guess, expected) => {
    // Arrange
    let game = createGame('test');

    // Act
    game = game.makeGuess(guess);

    // Assert
    expect(game.gussedWord).toEqual(expected);
    expect(game.guesses).toContain(guess);
  });

  test('Should reject incorrect guess which is a part of the correct word', () => {
    // Arrange
    let game = createGame('test');
    const expectedNumberOfLifes = game.numberOfLifes - 1;
    const expectedGuessedWord = [null, null, null, null];

    // Act
    game = game.makeGuess('te');

    // Assert
    expect(game.gussedWord).toEqual(expectedGuessedWord);
    expect(game.numberOfLifes).toEqual(expectedNumberOfLifes);
  });

  test('Should play through a game', () => {
    // Arrange
    let game = createGame('test');
    const expectedNumberOfLifes = 4;
    const expectedGuessedWord = ['t', 'e', 's', 't'];
    const expectedGuesses = ['t', 'a', 'e', 'm', 'test'];

    // Act
    game = game
      .makeGuess('t')
      .makeGuess('a')
      .makeGuess('e')
      .makeGuess('m')
      .makeGuess('test');

    // Assert
    expect(game.gussedWord).toEqual(expectedGuessedWord);
    expect(game.numberOfLifes).toEqual(expectedNumberOfLifes);
    expect(game.guesses).toEqual(expectedGuesses);
  });
});
