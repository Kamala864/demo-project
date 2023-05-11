import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';

import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';

describe('Project (e2e)', () => {
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
    await prismaService.project.deleteMany();
    await prismaService.company.deleteMany();
    await prismaService.university.deleteMany();
  });

  describe('POST /project', () => {
    it('should create a new project', async () => {
      const universityData = {
        name: 'Test Project',
        description: 'Test Description',
      };
      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });
      const companyData = {
        name: 'Test Company',
        description: 'Test Description',
      };
      const createdCompany = await prismaService.company.create({
        data: companyData,
      });
      const createProjectDto = {
        name: 'Test Project',
        description: 'Test Description',
        universityId: createdUniversity.id,
        companyId: createdCompany.id,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/project')
        .send(createProjectDto)
        .expect(HttpStatus.CREATED);

      expect(response.body.status).toBe(HttpStatus.CREATED);
      expect(response.body.data.name).toBe(createProjectDto.name);
      expect(response.body.data.description).toBe(createProjectDto.description);
      expect(response.body.data.universityId).toBe(
        createProjectDto.universityId,
      );
      expect(response.body.data.companyId).toBe(createProjectDto.companyId);
    });
  });

  describe('GET /project', () => {
    it('should return an array of project', async () => {
      // Create some test universities using the Prisma client
      const universityData = {
        name: 'Test University',
        description: 'Test Description',
      };
      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });
      const companyData = {
        name: 'Test Company',
        description: 'Test Description',
      };
      const createdCompany = await prismaService.company.create({
        data: companyData,
      });
      await prismaService.project.createMany({
        data: [
          {
            name: 'project 1',
            description: 'Description 1',
            universityId: createdUniversity.id,
            companyId: createdCompany.id,
          },
          {
            name: 'project 2',
            description: 'Description 1',
            universityId: createdUniversity.id,
            companyId: createdCompany.id,
          },
          {
            name: 'project ',
            description: 'Description 1',
            universityId: createdUniversity.id,
            companyId: createdCompany.id,
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/project')
        .expect(HttpStatus.OK);
      console.log(response, 'response');
      expect(response.body.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body.data)).toBeTruthy();
      expect(response.body.data.length).toBe(3);
    });
  });

  describe('PATCH /project/:id', () => {
    it('should update the project with the given id', async () => {
      // Create a test university using the Prisma client
      const universityData = {
        name: 'Test university',
        description: 'Test Description',
      };
      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });
      const createdCompany = await prismaService.company.create({
        data: {
          name: 'Test company',
          description: 'Test Description',
        },
      });
      const projectData = {
        name: 'Test Name',
        description: 'Test Description',
        universityId: createdUniversity.id,
        companyId: createdCompany.id,
      };
      const createdProject = await prismaService.project.create({
        data: projectData,
      });

      const updateProjectDto = {
        name: 'Updated project',
        description: 'Updated Description',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/project/${createdProject.id}`)
        .send(updateProjectDto)
        .expect(HttpStatus.OK);

      const updatedProject = await prismaService.project.findUnique({
        where: { id: createdProject.id },
      });

      expect(response.body.status).toBe(HttpStatus.OK);
      expect(response.body.data.id).toBe(createdProject.id);
      expect(updatedProject.name).toBe(updateProjectDto.name);
      expect(updatedProject.description).toBe(updateProjectDto.description);
      expect(updatedProject.universityId).toBe(createdUniversity.id);
    });
  });

  describe('GET /project/:id', () => {
    it('should return the university with the given id', async () => {
      const universityData = {
        name: 'Test university',
        description: 'Test Description',
      };
      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });
      const createdCompany = await prismaService.company.create({
        data: {
          name: 'Test company',
          description: 'Test Description',
        },
      });
      const projectData = {
        name: 'Test Name',
        description: 'Test Description',
        universityId: createdUniversity.id,
        companyId: createdCompany.id,
      };
      const createdProject = await prismaService.project.create({
        data: projectData,
      });
      const response = await request(app.getHttpServer())
        .get(`/api/v1/project/${createdProject.id}`)
        .expect(HttpStatus.OK);

      expect(response.body.status).toBe(HttpStatus.OK);
      expect(response.body.data.id).toBe(createdProject.id);
      expect(response.body.data.name).toBe(createdProject.name);
      expect(response.body.data.description).toBe(createdProject.description);
      expect(response.body.data.universityId).toBe(createdProject.universityId);
      expect(response.body.data.companyId).toBe(createdProject.companyId);
    });
  });

  describe('DELETE /project/:id', () => {
    it('should remove the student with the given id', async () => {
      const universityData = {
        name: 'Test University',
        description: 'Test Description',
      };
      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });
      const companyData = {
        name: 'Test company',
        description: 'Test description',
      };
      const createCompany = await prismaService.company.create({
        data: companyData,
      });
      const createdProject = await prismaService.project.create({
        data: {
          name: 'Test project',
          description: 'Test Description',
          universityId: createdUniversity.id,
          companyId: createCompany.id,
        },
      });
      await request(app.getHttpServer())
        .delete(`/api/v1/project/${createdProject.id}`)
        .expect(HttpStatus.OK);

      const removedStudent = await prismaService.student.findUnique({
        where: { id: createdProject.id },
      });
      expect(removedStudent).toBeNull();
    });
  });
});
