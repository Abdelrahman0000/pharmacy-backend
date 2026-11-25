import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateBranchProductDto {
  @IsInt()
  @Min(1)
  branchId: number;

  @IsInt()
  @Min(1)
  productId: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  sellingPrice: number;

  @IsOptional()
  @IsBoolean()
  isAvailable: boolean;
}
