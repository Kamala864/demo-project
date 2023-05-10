import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { ProfessorSchema } from '../schemas/professorSchema';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseFilterDto } from '../common/base.filter';

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
  @ApiOperation({ summary: 'get all professors' })
  async findAll(@Query() params: BaseFilterDto) {
    return {
      status: HttpStatus.OK,
      data: await this.professorService.findAll(+params.take, +params.skip),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      status: HttpStatus.OK,
      data: await this.professorService.findOne(id),
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProfessorDto: UpdateProfessorDto,
  ) {
    return {
      status: HttpStatus.OK,
      data: await this.professorService.update(id, updateProfessorDto),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      status: HttpStatus.OK,
      data: await this.professorService.remove(id),
    };
  }
}
