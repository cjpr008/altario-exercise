import { Test, TestingModule } from '@nestjs/testing';
import { GeneratorController } from './generator.controller';
import { GeneratorService } from './services/generator.service';

describe('GeneratorController', () => {
  let generatorController: GeneratorController;
  let generatorService: GeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneratorController],
      providers: [GeneratorService],
    }).compile();

    generatorController = module.get<GeneratorController>(GeneratorController);
    generatorService = module.get<GeneratorService>(GeneratorService);
  });

  describe('healthCheck', () => {
    it('should return "I\'m Alive!"', () => {
      const result = generatorController.healthCheck();
      expect(result).toBe("I'm Alive!");
    });
  });

  describe('generateGrid', () => {
    it('should generate a grid without bias', () => {
      const result = generatorController.generateGrid();
      const matrixLength = result.length;
      expect(matrixLength).toEqual(10);
      for (let i = 0; i < matrixLength; i++)
        expect(result[i].length).toEqual(10);
    });
    it('should generate a grid with bias', () => {
      let biasCount = 0;
      generatorController.setBiasChar('c');
      const result = generatorController.generateGrid();
      const matrixLength = result.length;
      expect(matrixLength).toEqual(10);
      for (let i = 0; i < matrixLength; i++) {
        expect(result[i].length).toEqual(10);
        for (let j = 0; j < matrixLength; j++) {
          if (result[i][j] === 'c') biasCount++;
        }
      }
      expect(biasCount).toEqual(20);
    });
  });

  describe('generateCode', () => {
    it('should generate a code for not large numbers for seconds less than 10', () => {
      Date.prototype.getSeconds = jest.fn().mockReturnValue(9);
      const mockCountAlphabeticOccurrences = jest
        .spyOn(generatorService, 'countAlphabeticOccurrences')
        .mockReturnValueOnce(3)
        .mockReturnValueOnce(8);

      const result = generatorController.generateCode();
      expect(mockCountAlphabeticOccurrences).toHaveBeenCalledTimes(2);
      expect(result).toBe('38');
    });
    it('should generate a code for not large numbers for seconds large than 10', () => {
      Date.prototype.getSeconds = jest.fn().mockReturnValue(12);
      const mockCountAlphabeticOccurrences = jest
        .spyOn(generatorService, 'countAlphabeticOccurrences')
        .mockReturnValueOnce(3)
        .mockReturnValueOnce(8);

      const result = generatorController.generateCode();
      expect(mockCountAlphabeticOccurrences).toHaveBeenCalledTimes(2);
      expect(result).toBe('38');
    });
    it('should generate a code for large numbers', () => {
      Date.prototype.getSeconds = jest.fn().mockReturnValue(12);
      const mockCountAlphabeticOccurrences = jest
        .spyOn(generatorService, 'countAlphabeticOccurrences')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(13);

      const mockHandleLargeNumbers = jest
        .spyOn(generatorService, 'handleLargeNumbers')
        .mockReturnValueOnce(5)
        .mockReturnValueOnce(1);

      const result = generatorController.generateCode();
      expect(mockCountAlphabeticOccurrences).toHaveBeenCalledTimes(2);
      expect(mockHandleLargeNumbers).toHaveBeenCalledTimes(2);
      expect(result).toBe('51');
    });
  });

  describe('setBiasChar', () => {
    it('should set bias character', () => {
      const character = 'c';
      generatorController.setBiasChar(character);
      expect(generatorController['biasCharacter']).toBe(character);
    });
  });
});
