import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeneratorController } from './generator.controller';
import { GeneratorService } from './services/generator.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [GeneratorController],
  providers: [GeneratorService],
})
export class AppModule {}
