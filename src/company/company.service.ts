import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}
  create(createCompanyDto: CreateCompanyDto) {
    return this.prisma.company.create({ data: createCompanyDto });
  }

  findAll(take: number, skip: number) {
    console.log(typeof take);
    const validTake = Number.isNaN(take) ? 10 : Math.max(0, Math.floor(take));
    const validSkip = Number.isNaN(skip) ? 0 : Math.max(0, Math.floor(skip));
    return this.prisma.company.findMany({ skip: validSkip, take: validTake });
  }

  findOne(id: string) {
    return this.prisma.company.findUnique({ where: { id: id } });
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return this.prisma.company.update({
      where: {
        id: id,
      },
      data: updateCompanyDto,
    });
  }

  remove(id: string) {
    return this.prisma.company.delete({ where: { id: id } });
  }
}
