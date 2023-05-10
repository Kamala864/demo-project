import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';

import * as request from 'supertest';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppModule } from 'src/app.module';

describe('Company (e2e)', () => {
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

  describe('POST /company', () => {
    it('should create a new company', async () => {
      const createCompanyDto = {
        name: 'Test Company',
        description: 'Test Description',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/company')
        .send(createCompanyDto)
        .expect(HttpStatus.CREATED);

      expect(response.body.status).toBe(HttpStatus.CREATED);
      expect(response.body.data.name).toBe(createCompanyDto.name);
      expect(response.body.data.description).toBe(createCompanyDto.description);
    });
  });

  describe('GET /company', () => {
    it('should return an array of companies', async () => {
      // Create some test companies using the Prisma client
      await prismaService.company.createMany({
        data: [
          { name: 'Company 1', description: 'Description 1' },
          { name: 'Company 2', description: 'Description 2' },
          { name: 'Company 3', description: 'Description 3' },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/company')
        .expect(HttpStatus.OK);

      expect(response.body.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body.data)).toBeTruthy();
      expect(response.body.data.length).toBe(3);
    });
  });

  describe('GET /company/:id', () => {
    it('should return the company with the given id', async () => {
      // Create a test company using the Prisma client
      const createdCompany = await prismaService.company.create({
        data: { name: 'Test Company', description: 'Test Description' },
      });

      const response = await request(app.getHttpServer())
        .get(`/api/v1/company/${createdCompany.id}`)
        .expect(HttpStatus.OK);

      expect(response.body.status).toBe(HttpStatus.OK);
      expect(response.body.data.id).toBe(createdCompany.id);
      expect(response.body.data.name).toBe(createdCompany.name);
      expect(response.body.data.description).toBe(createdCompany.description);
    });
  });
  describe('PATCH /company/:id', () => {
    it('should update the company with the given id', async () => {
      // Create a test company using the Prisma client
      const createdCompany = await prismaService.company.create({
        data: { name: 'Test Company', description: 'Test Description' },
      });

      const updateCompanyDto = {
        name: 'Updated Company',
        description: 'Updated Description',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/company/${createdCompany.id}`)
        .send(updateCompanyDto)
        .expect(HttpStatus.OK);

      expect(response.body.status).toBe(HttpStatus.OK);
      expect(response.body.data.id).toBe(createdCompany.id);
      expect(response.body.data.name).toBe(updateCompanyDto.name);
      expect(response.body.data.description).toBe(updateCompanyDto.description);
    });
  });

  describe('DELETE /company/:id', () => {
    it('should remove the company with the given id', async () => {
      const createdCompany = await prismaService.company.create({
        data: { name: 'Test Company', description: 'Test Description' },
      });

      await request(app.getHttpServer())
        .delete(`/api/v1/company/${createdCompany.id}`)
        .expect(HttpStatus.OK);

      const removedCompany = await prismaService.company.findUnique({
        where: { id: createdCompany.id },
      });

      expect(removedCompany).toBeNull();
    });
  });
});
