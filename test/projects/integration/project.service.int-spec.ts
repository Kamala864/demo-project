import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { CreateUniversityDto } from '../../../src/university/dto/create-university.dto';
import { ProjectService } from '../../../src/project/project.service';
import { CreateCompanyDto } from '../../../src/company/dto/create-company.dto';
import { CreateProjectDto } from '../../../src/project/dto/create-project.dto';
import { UpdateProjectDto } from 'src/project/dto/update-project.dto';

describe('ProjectService', () => {
  let projectService: ProjectService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectService, PrismaService],
    }).compile();

    projectService = module.get<ProjectService>(ProjectService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    // Clean up the testing database after each test
    await prismaService.clearDatabase();
  });

  afterAll(async () => {
    // Clean up any created data
    await prismaService.project.deleteMany();
    await prismaService.company.deleteMany();
    await prismaService.university.deleteMany();
    await prismaService.$disconnect();
  });

  describe('createProject', () => {
    it('should create a new project', async () => {
      // Create a university first
      const universityData: CreateUniversityDto = {
        name: 'University of Example',
        description: 'A university example',
      };

      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });

      // Create a professor with the created university's ID
      const companyData: CreateCompanyDto = {
        name: 'Company',
        description: 'Company description',
      };

      const createdCompany = await prismaService.company.create({
        data: companyData,
      });

      const projectData: CreateProjectDto = {
        name: 'Project',
        description: 'New project data',
        universityId: createdUniversity.id,
        companyId: createdCompany.id,
      };
      const createdProject = await projectService.create(projectData);
      expect(createdProject).toHaveProperty('id');
      expect(createdProject.name).toEqual(projectData.name);
      expect(createdProject.description).toEqual(projectData.description);
      expect(createdProject.universityId).toEqual(projectData.universityId);
      expect(createdProject.companyId).toEqual(projectData.companyId);
    });
  });

  describe('findAll', () => {
    it('should return an array of project', async () => {
      const params = { take: 10, skip: 0 };
      const projects = await projectService.findAll(params.skip, params.take);
      expect(projects).toBeDefined();
      expect(Array.isArray(projects)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return the project with the given id', async () => {
      const universityData: CreateUniversityDto = {
        name: 'Project of Example',
        description: 'A project example',
      };
      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });

      // Create a professor with the created university's ID
      const companyData: CreateCompanyDto = {
        name: 'company name',
        description: 'Company of Mathematics',
      };
      const createdCompany = await prismaService.company.create({
        data: companyData,
      });

      const projectData: CreateProjectDto = {
        name: 'company name',
        description: 'Company of Mathematics',
        universityId: createdUniversity.id,
        companyId: createdCompany.id,
      };

      //  const createdProfessor = await prismaService.professor(professorData);

      const createdProject = await projectService.create(projectData);
      const foundProject = await projectService.findOne(createdProject.id);

      expect(foundProject).toBeDefined();
      expect(foundProject.id).toBe(createdProject.id);
      expect(foundProject.name).toBe(createdProject.name);
      expect(foundProject.description).toBe(createdProject.description);
      expect(foundProject.universityId).toBe(createdProject.universityId);
      expect(foundProject.companyId).toBe(createdProject.companyId);
    });
  });

  describe('update', () => {
    it('should update the project with the given id', async () => {
      const universityData: CreateUniversityDto = {
        name: 'University of Example',
        description: 'A university example',
      };

      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });

      const companyData: CreateCompanyDto = {
        name: 'company name',
        description: 'Company of Mathematics',
      };
      const createdCompany = await prismaService.company.create({
        data: companyData,
      });

      const projectData: CreateProjectDto = {
        name: 'company name',
        description: 'Company of Mathematics',
        universityId: createdUniversity.id,
        companyId: createdCompany.id,
      };

      //  const createdProfessor = await prismaService.professor(professorData);

      const createdProject = await projectService.create(projectData);

      const updateProjectDto: UpdateProjectDto = {
        name: 'Updated University',
        description: 'Updated Description',
      };

      const updatedProject = await projectService.update(
        createdProject.id,
        updateProjectDto,
      );

      expect(updatedProject).toBeDefined();
      expect(updatedProject.id).toBe(createdProject.id);
      expect(updatedProject.name).toBe(updateProjectDto.name);
      expect(updatedProject.description).toBe(updateProjectDto.description);
    });
  });
  describe('remove', () => {
    it('should remove the project with the given id', async () => {
      const universityData: CreateUniversityDto = {
        name: 'University of Example',
        description: 'A university example',
      };

      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });

      const companyData: CreateCompanyDto = {
        name: 'company name',
        description: 'Company of Mathematics',
      };
      const createdCompany = await prismaService.company.create({
        data: companyData,
      });

      const projectData: CreateProjectDto = {
        name: 'company name',
        description: 'Company of Mathematics',
        universityId: createdUniversity.id,
        companyId: createdCompany.id,
      };

      //  const createdProfessor = await prismaService.professor(professorData);

      const createdProject = await projectService.create(projectData);

      await projectService.remove(createdProject.id);

      // Ensure the professor is removed
      const removedProject = await prismaService.professor.findUnique({
        where: { id: createdProject.id },
      });

      expect(removedProject).toBeNull();
    });
  });
});
