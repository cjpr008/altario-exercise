import { Injectable } from '@nestjs/common';

@Injectable()
export class GeneratorService {
  initMatrix(): string[][] {
    const currentMatrix: string[][] = [];
    for (let i = 0; i < 10; i++) {
      currentMatrix[i] = [];
      for (let j = 0; j < 10; j++) {
        currentMatrix[i][j] = '';
      }
    }
    return currentMatrix;
  }

  generateRandomAlphabeticMatrix(
    currentMatrix: string[][],
    biasCharacter: string,
  ) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.replace(biasCharacter, '');
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (currentMatrix[i][j] === '') {
          const randomIndex = Math.floor(Math.random() * alphabet.length);
          const randomChar = alphabet[randomIndex];
          currentMatrix[i][j] = randomChar;
        }
      }
    }
  }

  generateBiasMatrix(biasMatrix, biasCharacter) {
    const generateRandomPositions = this.generatePositions(20);
    for (let i = 0; i < generateRandomPositions.length; i++) {
      biasMatrix[generateRandomPositions[i][0]][generateRandomPositions[i][1]] =
        `${biasCharacter}`;
    }
  }

  countAlphabeticOccurrences(matrix, character): number {
    let count = 0;
    for (let row of matrix) {
      for (let char of row) {
        if (char === character) {
          count++;
        }
      }
    }
    return count;
  }

  handleLargeNumbers(number): number {
    let newNumber = number;
    for (let i = 2; i <= number; i++) {
      const remainder = newNumber % i;
      const division = newNumber / i;

      if (remainder === 0 && division < 10) {
        newNumber = division;
        break;
      }
    }
    return newNumber;
  }

  generatePositions(numberOfPos: number): string[] {
    const positions = new Set<string>();
    while (positions.size < numberOfPos) {
      const randomNumber = Math.floor(Math.random() * 100);
      positions.add(randomNumber.toString().padStart(2, '0'));
    }
    return Array.from(positions);
  }
}
