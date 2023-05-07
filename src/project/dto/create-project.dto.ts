import { ApiProperty } from '@nestjs/swagger';
export class CreateProjectDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;

  @ApiProperty()
  universityId: string | null;

  @ApiProperty()
  companyId: string | null;
}
