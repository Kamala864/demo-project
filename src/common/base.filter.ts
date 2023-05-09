import { ApiProperty } from '@nestjs/swagger';

enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class BaseFilterDto {
  @ApiProperty({ required: false, default: 'id' })
  sortBy: string;

  @ApiProperty({ required: false, default: OrderEnum.DESC, enum: OrderEnum })
  order: OrderEnum;

  @ApiProperty({ required: false, default: 0 })
  skip: number;

  @ApiProperty({ required: false, default: 10 })
  take: number;
}
