import { Body, Controller, Get, Post } from '@nestjs/common';
import { GeneratorService } from './services/generator.service';

@Controller()
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {
    this.currentMatrix = this.generatorService.initMatrix();
  }
  private currentMatrix: string[][];
  private biasCharacter: string = '';

  @Get()
  healthCheck(): string {
    return "I'm Alive!";
  }

  @Get('grid')
  generateGrid(): string[][] {
    this.currentMatrix = this.generatorService.initMatrix();
    if (this.biasCharacter) {
      this.generatorService.generateBiasMatrix(
        this.currentMatrix,
        this.biasCharacter,
      );
    }
    this.generatorService.generateRandomAlphabeticMatrix(
      this.currentMatrix,
      this.biasCharacter,
    );

    return this.currentMatrix;
  }

  @Get('code')
  generateCode(): string {
    const now = new Date();
    const seconds = now.getSeconds();
    const secondsArray = seconds < 10 ? `0${seconds}` : `${seconds}`;

    let firstDigitOccur = this.generatorService.countAlphabeticOccurrences(
      this.currentMatrix,
      this.currentMatrix[secondsArray[0]][secondsArray[1]],
    );
    let secondDigitOccur = this.generatorService.countAlphabeticOccurrences(
      this.currentMatrix,
      this.currentMatrix[secondsArray[1]][secondsArray[0]],
    );

    firstDigitOccur =
      firstDigitOccur > 9
        ? this.generatorService.handleLargeNumbers(firstDigitOccur)
        : firstDigitOccur;

    secondDigitOccur =
      secondDigitOccur > 9
        ? this.generatorService.handleLargeNumbers(secondDigitOccur)
        : secondDigitOccur;

    return `${firstDigitOccur}${secondDigitOccur}`;
  }

  @Post('bias')
  setBiasChar(@Body('character') character: string) {
    this.biasCharacter = character;
  }
}
