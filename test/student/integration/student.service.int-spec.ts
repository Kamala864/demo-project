import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { StudentService } from '../../../src/student/student.service';
import { CreateUniversityDto } from '../../../src/university/dto/create-university.dto';
import { CreateProfessorDto } from '../../../src/professor/dto/create-professor.dto';
import { CreateStudentDto } from '../../../src/student/dto/create-student.dto';
import { UpdateStudentDto } from 'src/student/dto/update-student.dto';

describe('CompanyService', () => {
  let studentService: StudentService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentService, PrismaService],
    }).compile();

    studentService = module.get<StudentService>(StudentService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    // Clean up the testing database after each test
    await prismaService.clearDatabase();
  });

  afterAll(async () => {
    // Clean up any created data

    await prismaService.student.deleteMany();
    await prismaService.professor.deleteMany();
    await prismaService.university.deleteMany();
    await prismaService.$disconnect();
  });

  describe('createStudent', () => {
    it('should create a new student', async () => {
      // Create a university first
      const universityData: CreateUniversityDto = {
        name: 'University of Example',
        description: 'A university example',
      };

      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });

      // Create a professor with the created university's ID
      const professorData: CreateProfessorDto = {
        name: 'Professor',
        description: 'Professor of Mathematics',
        universityId: createdUniversity.id,
      };

      //  const createdProfessor = await prismaService.professor(professorData);
      const createdProfessor = await prismaService.professor.create({
        data: professorData,
      });

      const studentData: CreateStudentDto = {
        name: 'Student',
        description: 'New student data',
        universityId: createdUniversity.id,
        professorId: createdProfessor.id,
      };
      const createdStudent = await studentService.create(studentData);
      expect(createdStudent).toHaveProperty('id');
      expect(createdStudent.name).toEqual(studentData.name);
      expect(createdStudent.description).toEqual(studentData.description);
      expect(createdStudent.universityId).toEqual(studentData.universityId);
      expect(createdStudent.professorId).toEqual(studentData.professorId);
    });
  });

  describe('findAll', () => {
    it('should return an array of student', async () => {
      const params = { take: 10, skip: 0 };
      const students = await studentService.findAll(params.skip, params.take);
      expect(students).toBeDefined();
      expect(Array.isArray(students)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return the student with the given id', async () => {
      const universityData: CreateUniversityDto = {
        name: 'University of Example',
        description: 'A university example',
      };
      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });

      // Create a professor with the created university's ID
      const professorData: CreateProfessorDto = {
        name: 'John Doe',
        description: 'Professor of Mathematics',
        universityId: createdUniversity.id,
      };

      const createdProfessor = await prismaService.professor.create({
        data: professorData,
      });
      const studentData: CreateStudentDto = {
        name: 'John Doe',
        description: 'Professor of Mathematics',
        universityId: createdUniversity.id,
        professorId: createdProfessor.id,
      };
      const createdStudent = await studentService.create(studentData);
      const foundStudent = await studentService.findOne(createdStudent.id);
      expect(foundStudent).toBeDefined();
      expect(foundStudent.id).toBe(createdStudent.id);
      expect(foundStudent.name).toBe(createdStudent.name);
      expect(foundStudent.description).toBe(createdStudent.description);
      expect(foundStudent.universityId).toBe(createdStudent.universityId);
      expect(foundStudent.professorId).toBe(createdStudent.professorId);
    });
  });

  describe('update', () => {
    it('should update the student with the given id', async () => {
      const universityData: CreateUniversityDto = {
        name: 'University of Example',
        description: 'A university example',
      };
      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });

      // Create a professor with the created university's ID
      const professorData: CreateProfessorDto = {
        name: 'John Doe',
        description: 'Professor of Mathematics',
        universityId: createdUniversity.id,
      };

      const createdProfessor = await prismaService.professor.create({
        data: professorData,
      });
      const studentData: CreateStudentDto = {
        name: 'John Doe',
        description: 'Professor of Mathematics',
        universityId: createdUniversity.id,
        professorId: createdProfessor.id,
      };
      const createdStudent = await studentService.create(studentData);

      const updateStudentDto: UpdateStudentDto = {
        name: 'Updated Student',
        description: 'Updated Description',
      };

      const updatedStudent = await studentService.update(
        createdStudent.id,
        updateStudentDto,
      );

      expect(updatedStudent).toBeDefined();
      expect(updatedStudent.id).toBe(createdStudent.id);
      expect(updatedStudent.name).toBe(updateStudentDto.name);
      expect(updatedStudent.description).toBe(updateStudentDto.description);
    });
  });
  describe('remove', () => {
    it('should remove the student with the given id', async () => {
      const universityData: CreateUniversityDto = {
        name: 'University of Example',
        description: 'A university example',
      };
      const createdUniversity = await prismaService.university.create({
        data: universityData,
      });

      // Create a professor with the created university's ID
      const professorData: CreateProfessorDto = {
        name: 'Professor',
        description: 'Professor of Mathematics',
        universityId: createdUniversity.id,
      };

      const createdProfessor = await prismaService.professor.create({
        data: professorData,
      });
      const studentData: CreateStudentDto = {
        name: 'John Doe',
        description: 'Professor of Mathematics',
        universityId: createdUniversity.id,
        professorId: createdProfessor.id,
      };
      const createdStudent = await studentService.create(studentData);

      await studentService.remove(createdStudent.id);

      // Ensure the professor is removed
      const removedStudent = await prismaService.professor.findUnique({
        where: { id: createdStudent.id },
      });

      expect(removedStudent).toBeNull();
    });
  });
});
