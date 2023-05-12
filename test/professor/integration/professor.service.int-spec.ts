import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { ProfessorService } from '../../../src/professor/professor.service';
import { CreateProfessorDto } from '../../../src/professor/dto/create-professor.dto';
import { CreateUniversityDto } from '../../../src/university/dto/create-university.dto';
import { UpdateProfessorDto } from 'src/professor/dto/update-professor.dto';

describe('ProfessorService', () => {
  let professorService: ProfessorService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfessorService, PrismaService],
    }).compile();

    professorService = module.get<ProfessorService>(ProfessorService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prismaService.professor.deleteMany();
    await prismaService.university.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });
  describe('createProfessor', () => {
    it('should create a new professor', async () => {
      const universityData: CreateUniversityDto = {
        name: 'University of Example',
        description: 'A university example',
      };

      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });

      const professorData: CreateProfessorDto = {
        name: 'Professor',
        description: 'Professor of Mathematics',
        universityId: createdUniversity.id,
      };

      const createdProfessor = await professorService.create(professorData);
      expect(createdProfessor).toHaveProperty('id');
      expect(createdProfessor.name).toEqual(professorData.name);
      expect(createdProfessor.description).toEqual(professorData.description);
      expect(createdProfessor.universityId).toEqual(professorData.universityId);
    });
  });

  describe('findAll', () => {
    it('should return an array of professors', async () => {
      const params = { take: 10, skip: 0 };
      const professors = await professorService.findAll(
        params.skip,
        params.take,
      );
      expect(professors).toBeDefined();
      expect(Array.isArray(professors)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return the professor with the given id', async () => {
      const universityData: CreateUniversityDto = {
        name: 'University of Example',
        description: 'A university example',
      };
      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });

      const professorData: CreateProfessorDto = {
        name: 'Professor',
        description: 'Professor of Mathematics',
        universityId: createdUniversity.id,
      };

      const createdProfessor = await professorService.create(professorData);
      const foundProfessor = await professorService.findOne(
        createdProfessor.id,
      );

      expect(foundProfessor).toBeDefined();
      expect(foundProfessor.id).toBe(createdProfessor.id);
      expect(foundProfessor.name).toBe(createdProfessor.name);
      expect(foundProfessor.description).toBe(createdProfessor.description);
      expect(foundProfessor.universityId).toBe(createdProfessor.universityId);
    });
  });

  describe('update', () => {
    it('should update the university with the given id', async () => {
      const universityData: CreateUniversityDto = {
        name: 'University of Example',
        description: 'A university example',
      };

      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });

      const professorData: CreateProfessorDto = {
        name: 'John Doe',
        description: 'Professor of Mathematics',
        universityId: createdUniversity.id,
      };

      const createdProfessor = await professorService.create(professorData);

      const updateProfessorDto: UpdateProfessorDto = {
        name: 'Updated University',
        description: 'Updated Description',
      };

      const updatedProfessor = await professorService.update(
        createdProfessor.id,
        updateProfessorDto,
      );

      expect(updatedProfessor).toBeDefined();
      expect(updatedProfessor.id).toBe(createdProfessor.id);
      expect(updatedProfessor.name).toBe(updateProfessorDto.name);
      expect(updatedProfessor.description).toBe(updateProfessorDto.description);
    });
  });
  describe('remove', () => {
    it('should remove the university with the given id', async () => {
      const universityData: CreateUniversityDto = {
        name: 'University of Example',
        description: 'A university example',
      };

      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });

      const professorData: CreateProfessorDto = {
        name: 'John Doe',
        description: 'Professor of Mathematics',
        universityId: createdUniversity.id,
      };

      const createdProfessor = await professorService.create(professorData);

      await professorService.remove(createdProfessor.id);

      const removedProfessor = await prismaService.professor.findUnique({
        where: { id: createdProfessor.id },
      });

      expect(removedProfessor).toBeNull();
    });
  });
});
