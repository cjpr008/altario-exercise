import { GeneratorService } from './generator.service';

describe('GeneratorService', () => {
  let generatorService: GeneratorService;

  beforeEach(() => {
    generatorService = new GeneratorService();
  });

  describe('initMatrix', () => {
    it('should setup a 10x10 matrix with empty strings', () => {
      const matrix = generatorService.initMatrix();
      expect(matrix.length).toBe(10);
      matrix.forEach((row) => {
        expect(row.length).toBe(10);
        row.forEach((cell) => {
          expect(cell).toBe('');
        });
      });
    });
  });

  describe('generateRandomAlphabeticMatrix', () => {
    it('should fill the matrix with random alphabetic characters when bias character is not typed', () => {
      const matrix = generatorService.initMatrix();
      generatorService.generateRandomAlphabeticMatrix(matrix, '');
      matrix.forEach((row) => {
        row.forEach((cell) => {
          expect(cell).toMatch(/[a-z]/);
        });
      });
    });

    it('should fill the matrix with random alphabetic characters excluding biasCharacter', () => {
      const matrix = generatorService.initMatrix();
      generatorService.generateRandomAlphabeticMatrix(matrix, 'c');
      matrix.forEach((row) => {
        row.forEach((cell) => {
          expect(cell).toMatch(/[a-bd-z]/);
        });
      });
    });
  });

  describe('generateBiasMatrix', () => {
    it('should fill the matrix with biasCharacter in random positions', () => {
      const biasMatrix = generatorService.initMatrix();
      generatorService.generateBiasMatrix(biasMatrix, 'c');
      let biasCount = 0;
      biasMatrix.forEach((row) => {
        row.forEach((cell) => {
          if (cell === 'c') biasCount++;
        });
      });
      expect(biasCount).toBe(20);
    });
  });

  describe('countAlphabeticOccurrences', () => {
    it('should count occurrences of a specific character in the matrix', () => {
      const matrix = [
        ['a', 'c', 'c'],
        ['a', 'c', 'e'],
        ['f', 'g', 'c'],
      ];
      const count = generatorService.countAlphabeticOccurrences(matrix, 'c');
      expect(count).toBe(4);
    });
  });

  describe('handleLargeNumbers', () => {
    it('should return the lowest integer possible', () => {
      expect(generatorService.handleLargeNumbers(24)).toBe(8);
    });

    it('should return the 1, because the lowest integer possible is the number itself', () => {
      expect(generatorService.handleLargeNumbers(19)).toBe(1);
    });
  });

  describe('generatePositions', () => {
    it('should generate an array of unique positions in string format', () => {
      const positions = generatorService.generatePositions(5);
      expect(positions.length).toBe(5);
      expect(positions.length).toBe(new Set(positions).size);

      positions.forEach((position) => {
        expect(position.length).toBe(2);
      });
    });
  });
});
