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
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectSchema } from 'src/schemas/projectSchema';

@ApiTags('Project')
@Controller('api/v1/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({ summary: 'create project' })
  async create(@Body() createProjectDto: CreateProjectDto) {
    ProjectSchema.parse(createProjectDto);
    return {
      status: HttpStatus.CREATED,
      data: await this.projectService.create(createProjectDto),
    };
  }

  @Get()
  async findAll() {
    return {
      status: HttpStatus.OK,
      data: await this.projectService.findAll(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      status: HttpStatus.OK,
      data: await this.projectService.findOne(id),
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return {
      status: HttpStatus.OK,
      data: await this.projectService.update(id, updateProjectDto),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      status: HttpStatus.OK,
      data: await this.projectService.remove(id),
    };
  }
}