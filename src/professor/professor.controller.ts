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
import { ProfessorService } from './professor.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { ProfessorSchema } from 'src/schemas/professorSchema';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Professor')
@Controller('api/v1/professor')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Post()
  async create(@Body() createProfessorDto: CreateProfessorDto) {
    ProfessorSchema.parse(createProfessorDto);
    return {
      status: HttpStatus.CREATED,
      data: await this.professorService.create(createProfessorDto),
    };
  }

  @Get()
  async findAll() {
    return {
      status: HttpStatus.OK,
      data: await this.professorService.findAll(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return {
      status: HttpStatus.OK,
      data: await this.professorService.findOne(+id),
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProfessorDto: UpdateProfessorDto,
  ) {
    return {
      status: HttpStatus.OK,
      data: await this.professorService.update(+id, updateProfessorDto),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return {
      status: HttpStatus.OK,
      data: await this.professorService.remove(+id),
    };
  }
}
