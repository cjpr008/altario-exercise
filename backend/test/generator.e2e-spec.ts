import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/generator.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect("I'm Alive!");
  });

  it('/grid (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/grid');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(10);
    response.body.forEach((row) => {
      expect(row).toHaveLength(10);
      row.forEach((cell) => {
        expect(cell).toBeDefined();
      });
    });
  });

  it('/code (GET)', async () => {
    await request(app.getHttpServer())
      .get('/grid')
      .then(async () => {
        const response = await request(app.getHttpServer()).get('/code');
        expect(response.status).toBe(200);
        expect(typeof response.text).toBe('string');
        expect(response.text.length).toBe(2);
      });
  });

  it('/bias (POST)', async () => {
    await request(app.getHttpServer()).post('/bias').send('c').expect(201);
  });
});
