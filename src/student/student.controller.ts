import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StudentSchema } from '../schemas/studentSchema';
import { BaseFilterDto } from '../common/base.filter';

@ApiTags('Student')
@Controller('api/v1/student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @ApiOperation({ summary: 'create student' })
  async create(@Body() createStudentDto: CreateStudentDto) {
    StudentSchema.parse(createStudentDto);
    return {
      status: HttpStatus.CREATED,
      data: await this.studentService.create(createStudentDto),
    };
  }

  @Get()
  @ApiOperation({ summary: 'get all student' })
  async findAll(@Query() params: BaseFilterDto) {
    return {
      status: HttpStatus.OK,
      data: await this.studentService.findAll(+params.skip, +params.take),
    };
  }
  @Get('search')
  @ApiOperation({ summary: 'search student' })
  async search(@Query() params: BaseFilterDto) {
    return {
      status: HttpStatus.OK,
      data: await this.studentService.search(
        +params.take,
        +params.skip,
        params.search,
      ),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'get student by id' })
  async findOne(@Param('id') id: string) {
    return {
      status: HttpStatus.OK,
      data: await this.studentService.findOne(id),
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update student' })
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
  @ApiOperation({ summary: 'delete student' })
  async remove(@Param('id') id: string) {
    return {
      status: HttpStatus.OK,
      data: await this.studentService.remove(id),
    };
  }
}
