import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LevenshteinDistance } from 'natural';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}
  create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({ data: createProjectDto });
  }

  findAll() {
    const newProjectName = 'New Project Name';
    const newProjectDescription = 'Description of the new project';

    const existingProjects = [
      {
        name: 'Existing Project 1',
        description: 'Description of existing project 1',
      },
      {
        name: 'Existing Project 2',
        description: 'Description of existing project 2',
      },
    ];

    for (const project of existingProjects) {
      const nameDistance = LevenshteinDistance(newProjectName, project.name);
      const descriptionDistance = LevenshteinDistance(
        newProjectDescription,
        project.description,
      );

      // Normalize the distances to obtain similarity scores
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

      console.log(
        `Name similarity with ${project.name}: ${nameSimilarity.toFixed(2)}%`,
      );
      console.log(
        `Description similarity with ${
          project.name
        }: ${descriptionSimilarity.toFixed(2)}%`,
      );
    }
    return this.prisma.project.findMany();
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
}
