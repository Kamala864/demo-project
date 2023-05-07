import { Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Project } from '@prisma/client';
import { Client } from 'pg';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectTrigger implements OnModuleInit {
  private readonly notificationClient: Client;

  constructor(private readonly prisma: PrismaService) {
    this.notificationClient = new Client({
      connectionString: 'postgresql://postgres:password@localhost:5432/demo',
    });
  }

  async onModuleInit() {
    await this.notificationClient.connect();
    await this.notificationClient.query('LISTEN notify_project_match');
    console.log('Listening for project matches...');

    this.notificationClient.on('notification', async (msg) => {
      console.log(msg.channel, 'tttttttttttttttttt');
      if (msg.channel === 'notify_project_match') {
        const projectId = `msg.payload`;
        console.log(
          'Received project match notification. Project ID:',
          msg.payload,
        );
        // Handle the project match event as needed
        // const project = await this.prisma.project.findUnique({
        //   where: { id: projectId },
        // });
        // console.log('Project Details:', project);
      }
    });
  }

  async closeConnection(): Promise<void> {
    await this.notificationClient.end();
  }
}
