import { NestFactory } from '@nestjs/core';
import { AppModule } from './generator.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitando CORS
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
