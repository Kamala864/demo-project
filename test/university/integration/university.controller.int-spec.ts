import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';

describe('University (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await prismaService.clearDatabase();
  });

  describe('POST /university', () => {
    it('should create a new university', async () => {
      const createUniversityDto = {
        name: 'Test University',
        description: 'Test Description',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/university')
        .send(createUniversityDto)
        .expect(HttpStatus.CREATED);

      expect(response.body.status).toBe(HttpStatus.CREATED);
      expect(response.body.data.name).toBe(createUniversityDto.name);
      expect(response.body.data.description).toBe(
        createUniversityDto.description,
      );
    });
  });

  describe('GET /university', () => {
    it('should return an array of universities', async () => {
      await prismaService.university.createMany({
        data: [
          { name: 'University 1', description: 'Description 1' },
          { name: 'University 2', description: 'Description 2' },
          { name: 'University 3', description: 'Description 3' },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/university')
        .expect(HttpStatus.OK);

      expect(response.body.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body.data)).toBeTruthy();
      expect(response.body.data.length).toBe(3);
    });
  });
  describe('GET /university/:id', () => {
    it('should return the university with the given id', async () => {
      const createdUniversity = await prismaService.university.create({
        data: { name: 'Test University', description: 'Test Description' },
      });

      const response = await request(app.getHttpServer())
        .get(`/api/v1/university/${createdUniversity.id}`)
        .expect(HttpStatus.OK);

      expect(response.body.status).toBe(HttpStatus.OK);
      expect(response.body.data.id).toBe(createdUniversity.id);
      expect(response.body.data.name).toBe(createdUniversity.name);
      expect(response.body.data.description).toBe(
        createdUniversity.description,
      );
    });
  });
  describe('PATCH /university/:id', () => {
    it('should update the university with the given id', async () => {
      const createdUniversity = await prismaService.university.create({
        data: { name: 'Test University', description: 'Test Description' },
      });
      const updateUniversityDto = {
        name: 'Updated University',
        description: 'Updated Description',
      };
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/university/${createdUniversity.id}`)
        .send(updateUniversityDto)
        .expect(HttpStatus.OK);

      const updatedUniversity = await prismaService.university.findUnique({
        where: { id: createdUniversity.id },
      });

      expect(response.body.status).toBe(HttpStatus.OK);
      expect(response.body.data.id).toBe(createdUniversity.id);
      expect(updatedUniversity.name).toBe(updateUniversityDto.name);
      expect(updatedUniversity.description).toBe(
        updateUniversityDto.description,
      );
    });
  });

  describe('DELETE /university/:id', () => {
    it('should remove the university with the given id', async () => {
      const createdUniversity = await prismaService.university.create({
        data: { name: 'Test University', description: 'Test Description' },
      });

      await request(app.getHttpServer())
        .delete(`/api/v1/university/${createdUniversity.id}`)
        .expect(HttpStatus.OK);

      const removedUniversity = await prismaService.university.findUnique({
        where: { id: createdUniversity.id },
      });

      expect(removedUniversity).toBeNull();
    });
  });
});
