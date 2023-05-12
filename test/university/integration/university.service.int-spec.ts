import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { UniversityService } from '../../../src/university/university.service';
import { CreateUniversityDto } from '../../../src/university/dto/create-university.dto';
import { UpdateUniversityDto } from '../../../src/university/dto/update-university.dto';

describe('UniversityService', () => {
  let universityService: UniversityService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UniversityService, PrismaService],
    }).compile();

    universityService = module.get<UniversityService>(UniversityService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prismaService.clearDatabase();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  describe('create', () => {
    it('should create a new university', async () => {
      const createUniversityDto: CreateUniversityDto = {
        name: 'Test University',
        description: 'Test Description For University',
      };

      const createdUniversity = await universityService.create(
        createUniversityDto,
      );

      expect(createdUniversity).toBeDefined();
      expect(createdUniversity.name).toBe(createUniversityDto.name);
      expect(createdUniversity.description).toBe(
        createUniversityDto.description,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of universities', async () => {
      const params = { take: 10, skip: 0 };
      const universities = await universityService.findAll(
        params.skip,
        params.take,
      );
      expect(universities).toBeDefined();
      expect(Array.isArray(universities)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return the university with the given id', async () => {
      const createUniversityDto: CreateUniversityDto = {
        name: 'Test University',
        description: 'Test Description',
      };
      const createdUniversity = await prismaService.university.create({
        data: createUniversityDto,
      });
      const foundUniversity = await universityService.findOne(
        createdUniversity.id,
      );

      expect(foundUniversity).toBeDefined();
      expect(foundUniversity.id).toBe(createdUniversity.id);
      expect(foundUniversity.name).toBe(createdUniversity.name);
      expect(foundUniversity.description).toBe(createdUniversity.description);
    });
  });

  describe('update', () => {
    it('should update the university with the given id', async () => {
      const createUniversityDto: CreateUniversityDto = {
        name: 'Test University',
        description: 'Test Description',
      };
      const createdUniversity = await prismaService.university.create({
        data: createUniversityDto,
      });

      const updateUniversityDto: UpdateUniversityDto = {
        name: 'Updated University',
        description: 'Updated Description',
      };

      const updatedUniversity = await universityService.update(
        createdUniversity.id,
        updateUniversityDto,
      );

      expect(updatedUniversity).toBeDefined();
      expect(updatedUniversity.id).toBe(createdUniversity.id);
      expect(updatedUniversity.name).toBe(updateUniversityDto.name);
      expect(updatedUniversity.description).toBe(
        updateUniversityDto.description,
      );
    });
  });
  describe('remove', () => {
    it('should remove the university with the given id', async () => {
      const createUniversityDto: CreateUniversityDto = {
        name: 'Test University',
        description: 'Test Description',
      };
      const createdUniversity = await prismaService.university.create({
        data: createUniversityDto,
      });

      await universityService.remove(createdUniversity.id);
      const removedUniversity = await prismaService.university.findUnique({
        where: { id: createdUniversity.id },
      });
      expect(removedUniversity).toBeNull();
    });
  });
});
