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
import { UniversityService } from './university.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UniversitySchema } from 'src/schemas/universitySchema';

@ApiTags('University')
@Controller('api/v1/university')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Post()
  @ApiOperation({ summary: 'create university' })
  async create(@Body() createUniversityDto: CreateUniversityDto) {
    UniversitySchema.parse(createUniversityDto);
    return {
      status: HttpStatus.CREATED,
      data: await this.universityService.create(createUniversityDto),
    };
  }

  @Get()
  @ApiOperation({ summary: 'get all university' })
  async findAll() {
    return {
      status: HttpStatus.OK,
      data: await this.universityService.findAll(),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'get university by id' })
  async findOne(@Param('id') id: number) {
    return {
      status: HttpStatus.OK,
      data: await this.universityService.findOne(+id),
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update university ' })
  async update(
    @Param('id') id: number,
    @Body() updateUniversityDto: UpdateUniversityDto,
  ) {
    UniversitySchema.parse(updateUniversityDto);
    return {
      status: HttpStatus.OK,
      date: await this.universityService.update(+id, updateUniversityDto),
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete university' })
  async remove(@Param('id') id: number) {
    return {
      status: HttpStatus.OK,
      data: await this.universityService.remove(id),
    };
  }
}
