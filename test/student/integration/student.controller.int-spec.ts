import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';

import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';

describe('Student (e2e)', () => {
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
    await prismaService.student.deleteMany();
    await prismaService.professor.deleteMany();
    await prismaService.university.deleteMany();
  });

  describe('POST /student', () => {
    it('should create a new student', async () => {
      const universityData = {
        name: 'Test Student',
        description: 'Test Description',
      };
      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });
      const professorData = {
        name: 'Test Professor',
        description: 'Test Description',
        universityId: createdUniversity.id,
      };
      const createdProfessor = await prismaService.professor.create({
        data: professorData,
      });
      const createStudentDto = {
        name: 'Test Student',
        description: 'Test Description',
        universityId: createdUniversity.id,
        professorId: createdProfessor.id,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/student')
        .send(createStudentDto)
        .expect(HttpStatus.CREATED);

      expect(response.body.status).toBe(HttpStatus.CREATED);
      expect(response.body.data.name).toBe(createStudentDto.name);
      expect(response.body.data.description).toBe(createStudentDto.description);
      expect(response.body.data.universityId).toBe(
        createStudentDto.universityId,
      );
      expect(response.body.data.professorId).toBe(createStudentDto.professorId);
    });
  });

  describe('GET /student', () => {
    it('should return an array of students', async () => {
      const universityData = {
        name: 'Test University',
        description: 'Test Description',
      };
      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });
      const professorData = {
        name: 'Test University',
        description: 'Test Description',
        universityId: createdUniversity.id,
      };
      const createdProfessor = await prismaService.professor.create({
        data: professorData,
      });
      await prismaService.student.createMany({
        data: [
          {
            name: 'Student 1',
            description: 'Description 1',
            universityId: createdUniversity.id,
            professorId: createdProfessor.id,
          },
          {
            name: 'Student 2',
            description: 'Description 2',
            universityId: createdUniversity.id,
            professorId: createdProfessor.id,
          },
          {
            name: 'Student 3',
            description: 'Description 3',
            universityId: createdUniversity.id,
            professorId: createdProfessor.id,
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/student')
        .expect(HttpStatus.OK);
      console.log(response, 'response');
      expect(response.body.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body.data)).toBeTruthy();
      expect(response.body.data.length).toBe(3);
    });
  });

  describe('PATCH /student/:id', () => {
    it('should update the student with the given id', async () => {
      const universityData = {
        name: 'Test Student',
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
      const studentData = {
        name: 'Test Name',
        description: 'Test Description',
        universityId: createdUniversity.id,
        professorId: createdProfessor.id,
      };
      const createdStudent = await prismaService.student.create({
        data: studentData,
      });

      const updateStudentDto = {
        name: 'Updated student',
        description: 'Updated Description',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/student/${createdStudent.id}`)
        .send(updateStudentDto)
        .expect(HttpStatus.OK);

      const updatedStudent = await prismaService.student.findUnique({
        where: { id: createdStudent.id },
      });

      expect(response.body.status).toBe(HttpStatus.OK);
      expect(response.body.data.id).toBe(createdStudent.id);
      expect(updatedStudent.name).toBe(updateStudentDto.name);
      expect(updatedStudent.description).toBe(updateStudentDto.description);
      expect(updatedStudent.universityId).toBe(createdUniversity.id);
    });
  });

  describe('GET /student/:id', () => {
    it('should return the university with the given id', async () => {
      const universityData = {
        name: 'Test Student',
        description: 'Test Description',
      };
      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });
      const professorData = {
        name: 'Test Professor',
        description: 'Test Description',
        universityId: createdUniversity.id,
      };
      const createdProfessor = await prismaService.professor.create({
        data: professorData,
      });

      const createdStudent = await prismaService.student.create({
        data: {
          name: 'Test Professor',
          description: 'Test Description',
          universityId: createdUniversity.id,
          professorId: createdProfessor.id,
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/api/v1/student/${createdStudent.id}`)
        .expect(HttpStatus.OK);

      expect(response.body.status).toBe(HttpStatus.OK);
      expect(response.body.data.id).toBe(createdStudent.id);
      expect(response.body.data.name).toBe(createdStudent.name);
      expect(response.body.data.description).toBe(createdStudent.description);
      expect(response.body.data.universityId).toBe(createdStudent.universityId);
      expect(response.body.data.professorId).toBe(createdStudent.professorId);
    });
  });

  describe('DELETE /student/:id', () => {
    it('should remove the student with the given id', async () => {
      const universityData = {
        name: 'Test University',
        description: 'Test Description',
      };
      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });
      const professorData = {
        name: 'Test Professor',
        description: 'Test description',
        universityId: createdUniversity.id,
      };
      const createProfessor = await prismaService.professor.create({
        data: professorData,
      });
      const createdStudent = await prismaService.student.create({
        data: {
          name: 'Test Student',
          description: 'Test Description',
          universityId: createdUniversity.id,
          professorId: createProfessor.id,
        },
      });

      await request(app.getHttpServer())
        .delete(`/api/v1/student/${createdStudent.id}`)
        .expect(HttpStatus.OK);

      const removedStudent = await prismaService.student.findUnique({
        where: { id: createdStudent.id },
      });

      expect(removedStudent).toBeNull();
    });
  });
});
