import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '../../../src/company/company.service';
import { CreateCompanyDto } from '../../../src/company/dto/create-company.dto';
import { UpdateCompanyDto } from '../../../src/company/dto/update-company.dto';
import { PrismaService } from '../../../src/prisma/prisma.service';

describe('CompanyService', () => {
  let companyService: CompanyService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyService, PrismaService],
    }).compile();

    companyService = module.get<CompanyService>(CompanyService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prismaService.clearDatabase();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  describe('create', () => {
    it('should create a new company', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Test Company',
        description: 'Test Description For Company',
      };

      const createdCompany = await companyService.create(createCompanyDto);

      expect(createdCompany).toBeDefined();
      expect(createdCompany.name).toBe(createCompanyDto.name);
      expect(createdCompany.description).toBe(createCompanyDto.description);
    });
  });

  describe('findAll', () => {
    it('should return an array of companies', async () => {
      const params = { skip: 0, take: 10 };
      const companies = await companyService.findAll(params.skip, params.take);

      expect(companies).toBeDefined();
      expect(Array.isArray(companies)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return the company with the given id', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Test Company',
        description: 'Test Description',
      };
      const createdCompany = await prismaService.company.create({
        data: createCompanyDto,
      });
      const foundCompany = await companyService.findOne(createdCompany.id);

      expect(foundCompany).toBeDefined();
      expect(foundCompany.id).toBe(createdCompany.id);
      expect(foundCompany.name).toBe(createdCompany.name);
      expect(foundCompany.description).toBe(createdCompany.description);
    });
  });

  describe('update', () => {
    it('should update the company with the given id', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Test Company',
        description: 'Test Description',
      };
      const createdCompany = await prismaService.company.create({
        data: createCompanyDto,
      });

      const updateCompanyDto: UpdateCompanyDto = {
        name: 'Updated Company',
        description: 'Updated Description',
      };

      const updatedCompany = await companyService.update(
        createdCompany.id,
        updateCompanyDto,
      );

      expect(updatedCompany).toBeDefined();
      expect(updatedCompany.id).toBe(createdCompany.id);
      expect(updatedCompany.name).toBe(updateCompanyDto.name);
      expect(updatedCompany.description).toBe(updateCompanyDto.description);
    });
  });
  describe('remove', () => {
    it('should remove the company with the given id', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Test Company',
        description: 'Test Description',
      };
      const createdCompany = await prismaService.company.create({
        data: createCompanyDto,
      });

      await companyService.remove(createdCompany.id);
      const removedCompany = await prismaService.company.findUnique({
        where: { id: createdCompany.id },
      });
      expect(removedCompany).toBeNull();
    });
  });
});
