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
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanySchema } from 'src/schemas/companySchema';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Company')
@Controller('api/v1/company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ summary: 'create company' })
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    CompanySchema.parse(createCompanyDto);
    return {
      status: HttpStatus.CREATED,
      data: await this.companyService.create(createCompanyDto),
    };
  }

  @Get()
  @ApiOperation({ summary: 'get all company' })
  async findAll() {
    return {
      status: HttpStatus.OK,
      data: await this.companyService.findAll(),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'get company by id' })
  async findOne(@Param('id') id: string) {
    return {
      status: HttpStatus.OK,
      data: await this.companyService.findOne(id),
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    CompanySchema.parse(updateCompanyDto);
    return {
      status: HttpStatus.OK,
      data: await this.companyService.update(id, updateCompanyDto),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      status: HttpStatus.OK,
      data: await this.companyService.remove(id),
    };
  }
}
