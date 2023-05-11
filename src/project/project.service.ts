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
    // this.eventEmitter.emit('project.created', project);
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

  async findSimilarity() {
    const existing = await this.prisma.project.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });
    const newProjectName = existing[0].name;
    const newProjectDescription = existing[0].description;
    existing.shift();
    const result = [];
    for (const project of existing) {
      const nameDistance = LevenshteinDistance(newProjectName, project.name);
      const descriptionDistance = LevenshteinDistance(
        newProjectDescription,
        project.description,
      );
      const nameSimilarity =
        (1 -
          nameDistance / Math.max(newProjectName.length, project.name.length)) *
        100;
      const descriptionSimilarity =
        (1 -
          descriptionDistance /
            Math.max(
              newProjectDescription.length,
              project.description.length,
            )) *
        100;
      result.push(
        { nameSimilarity: ` ${project.name}: ${nameSimilarity.toFixed(2)}%` },
        {
          descriptionSimilarity: ` ${
            project.description
          }: ${descriptionSimilarity.toFixed(2)}%`,
        },
      );
    }

    return result;
  }
}
