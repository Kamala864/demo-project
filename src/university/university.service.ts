import { Injectable } from '@nestjs/common';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UniversityService {
  constructor(private prisma: PrismaService) {}

  create(createUniversityDto: CreateUniversityDto) {
    return this.prisma.university.create({ data: createUniversityDto });
  }

  findAll() {
    return this.prisma.university.findMany();
  }

  findOne(id: number) {
    return this.prisma.university.findUnique({ where: { id: id } });
  }

  update(id: number, updateUniversityDto: UpdateUniversityDto) {
    return this.prisma.university.update({
      where: {
        id: id,
      },
      data: updateUniversityDto,
    });
  }

  remove(id: number) {
    return this.prisma.university.delete({ where: { id: id } });
  }
}
