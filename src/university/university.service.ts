import { Injectable } from '@nestjs/common';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { PrismaService } from '../prisma/prisma.service';
import { skip } from 'rxjs';

@Injectable()
export class UniversityService {
  constructor(private prisma: PrismaService) {}

  create(createUniversityDto: CreateUniversityDto) {
    return this.prisma.university.create({ data: createUniversityDto });
  }

  findAll(take: number, skip: number, search: string) {
    const validTake = Number.isNaN(take) ? 10 : Math.max(0, Math.floor(take));
    const validSkip = Number.isNaN(skip) ? 0 : Math.max(0, Math.floor(skip));
    return this.prisma.university.findMany({
      skip: validSkip,
      take: validTake,
      where: {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      },
    });
  }

  findOne(id: string) {
    return this.prisma.university.findUnique({ where: { id: id } });
  }

  update(id: string, updateUniversityDto: UpdateUniversityDto) {
    return this.prisma.university.update({
      where: {
        id: id,
      },
      data: updateUniversityDto,
    });
  }

  remove(id: string) {
    return this.prisma.university.delete({ where: { id: id } });
  }
}
