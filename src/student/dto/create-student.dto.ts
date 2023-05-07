import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;

  @ApiProperty()
  universityId: string | null;

  @ApiProperty()
  professorId: string | null;
}
