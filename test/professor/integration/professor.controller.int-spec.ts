import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';

import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';

describe('Professor (e2e)', () => {
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
    await prismaService.professor.deleteMany();
    await prismaService.university.deleteMany();
  });

  describe('POST /professor', () => {
    it('should create a new professor', async () => {
      const universityData = {
        name: 'Test University',
        description: 'Test Description',
      };
      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });
      const createProfessorDto = {
        name: 'Test Professor',
        description: 'Test Description',
        universityId: createdUniversity.id,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/professor')
        .send(createProfessorDto)
        .expect(HttpStatus.CREATED);

      expect(response.body.status).toBe(HttpStatus.CREATED);
      expect(response.body.data.name).toBe(createProfessorDto.name);
      expect(response.body.data.description).toBe(
        createProfessorDto.description,
      );
      expect(response.body.data.universityId).toBe(
        createProfessorDto.universityId,
      );
    });
  });

  describe('GET /professor', () => {
    it('should return an array of universities', async () => {
      // Create some test universities using the Prisma client
      const universityData = {
        name: 'Test University',
        description: 'Test Description',
      };
      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });
      await prismaService.professor.createMany({
        data: [
          {
            name: 'Professor 1',
            description: 'Description 1',
            universityId: createdUniversity.id,
          },
          {
            name: 'Professor 2',
            description: 'Description 2',
            universityId: createdUniversity.id,
          },
          {
            name: 'Professor 3',
            description: 'Description 3',
            universityId: createdUniversity.id,
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/professor')
        .expect(HttpStatus.OK);

      expect(response.body.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body.data)).toBeTruthy();
      expect(response.body.data.length).toBe(3);
    });
  });

  describe('GET /professor/:id', () => {
    it('should return the university with the given id', async () => {
      // Create a test university using the Prisma client
      const universityData = {
        name: 'Test University',
        description: 'Test Description',
      };
      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });
      const createdProfessor = await prismaService.professor.create({
        data: {
          name: 'Test Professor',
          description: 'Test Description',
          universityId: createdUniversity.id,
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/api/v1/professor/${createdProfessor.id}`)
        .expect(HttpStatus.OK);

      expect(response.body.status).toBe(HttpStatus.OK);
      expect(response.body.data.id).toBe(createdProfessor.id);
      expect(response.body.data.name).toBe(createdProfessor.name);
      expect(response.body.data.description).toBe(createdProfessor.description);
      expect(response.body.data.universityId).toBe(
        createdProfessor.universityId,
      );
    });
  });
  describe('PATCH /university/:id', () => {
    it('should update the university with the given id', async () => {
      // Create a test university using the Prisma client
      const universityData = {
        name: 'Test University',
        description: 'Test Description',
      };
      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });
      const createdProfessor = await prismaService.professor.create({
        data: {
          name: 'Test professor',
          description: 'Test Description',
          universityId: createdUniversity.id,
        },
      });

      const updateProfessorDto = {
        name: 'Updated Professor',
        description: 'Updated Description',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/professor/${createdProfessor.id}`)
        .send(updateProfessorDto)
        .expect(HttpStatus.OK);

      const updatedProfessor = await prismaService.professor.findUnique({
        where: { id: createdProfessor.id },
      });

      expect(response.body.status).toBe(HttpStatus.OK);
      expect(response.body.data.id).toBe(createdProfessor.id);
      expect(updatedProfessor.name).toBe(updateProfessorDto.name);
      expect(updatedProfessor.description).toBe(updateProfessorDto.description);
      expect(updatedProfessor.universityId).toBe(createdUniversity.id);
    });
  });

  describe('DELETE /professor/:id', () => {
    it('should remove the professor with the given id', async () => {
      const universityData = {
        name: 'Test University',
        description: 'Test Description',
      };
      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });
      const createdProfessor = await prismaService.professor.create({
        data: {
          name: 'Test University',
          description: 'Test Description',
          universityId: createdUniversity.id,
        },
      });

      await request(app.getHttpServer())
        .delete(`/api/v1/professor/${createdProfessor.id}`)
        .expect(HttpStatus.OK);

      const removedProfessor = await prismaService.professor.findUnique({
        where: { id: createdProfessor.id },
      });

      expect(removedProfessor).toBeNull();
    });
  });
});
