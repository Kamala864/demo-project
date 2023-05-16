import { Injectable } from '@nestjs/common';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfessorService {
  constructor(private prisma: PrismaService) {}
  create(createProfessorDto: CreateProfessorDto) {
    return this.prisma.professor.create({ data: createProfessorDto });
  }

  findAll(take: number, skip: number) {
    const validTake = Number.isNaN(take) ? 10 : Math.max(0, Math.floor(take));
    const validSkip = Number.isNaN(skip) ? 0 : Math.max(0, Math.floor(skip));
    return this.prisma.professor.findMany({
      skip: validSkip,
      take: validTake,
    });
  }

  search(take: number, skip: number, search: string) {
    const validTake = Number.isNaN(take) ? 10 : Math.max(0, Math.floor(take));
    const validSkip = Number.isNaN(skip) ? 0 : Math.max(0, Math.floor(skip));
    return this.prisma.professor.findMany({
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
    return this.prisma.professor.findUnique({
      where: { id: id },
    });
  }

  update(id: string, updateProfessorDto: UpdateProfessorDto) {
    return this.prisma.professor.update({
      where: { id: id },
      data: updateProfessorDto,
    });
  }

  remove(id: string) {
    return this.prisma.professor.delete({ where: { id: id } });
  }
}
