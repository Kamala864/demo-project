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
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanySchema } from '../schemas/companySchema';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseFilterDto } from '../common/base.filter';

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
  async findAll(@Query() params: BaseFilterDto) {
    return {
      status: HttpStatus.OK,
      data: await this.companyService.findAll(+params.take, +params.skip),
    };
  }
  @Get('search')
  @ApiOperation({ summary: 'search company' })
  async search(@Query() params: BaseFilterDto) {
    return {
      status: HttpStatus.OK,
      data: await this.companyService.search(
        +params.take,
        +params.skip,
        params.search,
      ),
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
  @ApiOperation({ summary: 'update company' })
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
  @ApiOperation({ summary: 'delete company' })
  async remove(@Param('id') id: string) {
    return {
      status: HttpStatus.OK,
      data: await this.companyService.remove(id),
    };
  }
}
