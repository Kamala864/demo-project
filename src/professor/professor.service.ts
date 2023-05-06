import { Injectable } from '@nestjs/common';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfessorService {
  constructor(private prisma: PrismaService) {}
  create(createProfessorDto: CreateProfessorDto) {
    return this.prisma.professor.create({ data: createProfessorDto });
  }

  findAll() {
    return this.prisma.professor.findMany();
  }

  findOne(id: number) {
    return this.prisma.professor.findUnique({
      where: { id: id },
    });
  }

  update(id: number, updateProfessorDto: UpdateProfessorDto) {
    return this.prisma.professor.update({
      where: { id: id },
      data: updateProfessorDto,
    });
  }

  remove(id: number) {
    return this.prisma.professor.delete({ where: { id: id } });
  }
}
