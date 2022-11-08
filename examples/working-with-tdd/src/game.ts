interface Game {
  guesses: string[];
  gussedWord: (string | null)[];
  numberOfLifes: number;
  makeGuess: (guess: string) => Game;
}

function findIndexes(str: string, needle: string): number[] {
  const indexes: number[] = [];
  str.split('').forEach((character, index) => {
    if (character === needle) {
      indexes.push(index);
    }
  });
  return indexes;
}

function isLetterGuess(guess: string): boolean {
  return guess.length === 1;
}

function createGame(wordToGuess: string): Game {
  return {
    guesses: [],
    gussedWord: wordToGuess.split('').map(() => {
      return null;
    }),
    numberOfLifes: 6,
    makeGuess: function (guess: string) {
      const updatedGameState = {
        ...this,
        guesses: [...this.guesses, guess],
      };

      if (isLetterGuess(guess)) {
        const correctGuess = wordToGuess.includes(guess);
        if (correctGuess) {
          const indexes = findIndexes(wordToGuess, guess);
          const { gussedWord } = updatedGameState;
          indexes.forEach((index) => {
            gussedWord[index] = guess;
          });
          return {
            ...updatedGameState,
            gussedWord: gussedWord,
          };
        }
      } else {
        if (guess === wordToGuess) {
          return {
            ...updatedGameState,
            gussedWord: guess.split(''),
          };
        }
      }
      return {
        ...updatedGameState,
        numberOfLifes: this.numberOfLifes - 1,
      };
    },
  };
}

export default createGame;
