import { Module } from '@nestjs/common';
import { GeneratorController } from './generator.controller';
import { GeneratorService } from './services/generator.service';

@Module({
  imports: [],
  controllers: [GeneratorController],
  providers: [GeneratorService],
})
export class AppModule {}
