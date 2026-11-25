import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';
import { StockMovementType } from '../../generated/prisma/client.js';

export class FilterStockMovementsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  branchId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  batchId?: number;

  @IsOptional()
  @IsEnum(StockMovementType)
  type?: StockMovementType;

  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}