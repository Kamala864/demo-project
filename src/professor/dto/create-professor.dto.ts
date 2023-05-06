import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateStudentDto } from 'src/student/dto/create-student.dto';
import { Prisma } from '@prisma/client';

export class CreateProfessorDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;

  @ApiProperty()
  universityId: number | null;
}
