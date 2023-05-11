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
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectSchema } from '../schemas/projectSchema';
import { BaseFilterDto } from '../common/base.filter';

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
  @ApiOperation({ summary: 'get all student' })
  async findAll(@Query() params: BaseFilterDto) {
    return {
      status: HttpStatus.OK,
      data: await this.projectService.findAll(+params.skip, +params.take),
    };
  }

  @Get('get-similarity')
  @ApiOperation({ summary: 'get similarity percentage' })
  async findSimilarity(@Query() params: BaseFilterDto) {
    return {
      status: HttpStatus.OK,
      data: await this.projectService.findSimilarity(params.skip, params.take),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'get project by id' })
  async findOne(@Param('id') id: string) {
    return {
      status: HttpStatus.OK,
      data: await this.projectService.findOne(id),
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update project' })
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
  @ApiOperation({ summary: 'delete project' })
  async remove(@Param('id') id: string) {
    return {
      status: HttpStatus.OK,
      data: await this.projectService.remove(id),
    };
  }
}
