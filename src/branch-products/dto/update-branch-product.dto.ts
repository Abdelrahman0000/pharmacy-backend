
import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateBranchProductDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  sellingPrice?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
