import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LevenshteinDistance } from 'natural';
@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}
  async create(createProjectDto: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: createProjectDto,
    });
    return project;
  }

  findAll(skip: number, take: number) {
    const validTake = Number.isNaN(take) ? 10 : Math.max(0, Math.floor(take));
    const validSkip = Number.isNaN(skip) ? 0 : Math.max(0, Math.floor(skip));
    return this.prisma.project.findMany({
      skip: validSkip,
      take: validTake,
    });
  }
  search(skip: number, take: number, search: string) {
    const validTake = Number.isNaN(take) ? 10 : Math.max(0, Math.floor(take));
    const validSkip = Number.isNaN(skip) ? 0 : Math.max(0, Math.floor(skip));
    return this.prisma.project.findMany({
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
    return this.prisma.project.findUnique({ where: { id: id } });
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id: id },
      data: updateProjectDto,
    });
  }

  remove(id: string) {
    return this.prisma.project.delete({ where: { id: id } });
  }

  async findSimilarity(skip: number, take: number) {
    const validTake = Number.isNaN(take) ? 10 : Math.max(0, Math.floor(take));
    const validSkip = Number.isNaN(skip) ? 0 : Math.max(0, Math.floor(skip));
    const { id, name, description } = await this.prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    const projects = await this.prisma.project.findMany({
      where: { NOT: { id } },
      select: { name: true, description: true },
      take: validTake,
      skip: validSkip,
    });

    const similarityPromises = projects.map(async (project) => {
      const nameDistance = LevenshteinDistance(name, project.name);
      const descriptionDistance = LevenshteinDistance(
        description,
        project.description,
      );

      const nameSimilarity =
        (1 - nameDistance / Math.max(name.length, project.name.length)) * 100;
      const descriptionSimilarity =
        (1 -
          descriptionDistance /
            Math.max(description.length, project.description.length)) *
        100;

      return {
        nameSimilarity: ` ${project.name}: ${nameSimilarity.toFixed(2)}%`,
        descriptionSimilarity: ` ${
          project.description
        }: ${descriptionSimilarity.toFixed(2)}%`,
      };
    });

    const result = await Promise.all(similarityPromises);
    return result;
  }
}
