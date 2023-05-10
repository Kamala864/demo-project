import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiTags } from '@nestjs/swagger';
import { StudentSchema } from '../schemas/studentSchema';

@ApiTags('Student')
@Controller('api/v1/student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    StudentSchema.parse(createStudentDto);
    return {
      status: HttpStatus.CREATED,
      data: await this.studentService.create(createStudentDto),
    };
  }

  @Get()
  async findAll() {
    return {
      status: HttpStatus.OK,
      data: await this.studentService.findAll(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      status: HttpStatus.OK,
      data: await this.studentService.findOne(id),
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    StudentSchema.parse(updateStudentDto);
    return {
      status: HttpStatus.OK,
      data: await this.studentService.update(id, updateStudentDto),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      status: HttpStatus.OK,
      data: await this.studentService.remove(id),
    };
  }
}
