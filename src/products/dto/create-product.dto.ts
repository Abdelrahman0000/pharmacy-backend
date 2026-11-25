import {
  IsBoolean,
  IsOptional,
  IsString,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, {
  message: 'name must contain at least one non-whitespace character',
})
  name: string;

  @IsOptional()
@IsString()
@Matches(/\S/, {
  message: 'barcode must contain at least one non-whitespace character',
})
barcode?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, {
  message: 'activeIngredient must contain at least one non-whitespace character',
})
  activeIngredient: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, {
  message: 'strength must contain at least one non-whitespace character',
})
  strength: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, {
  message: 'dosageForm must contain at least one non-whitespace character',
})
  dosageForm: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, {
  message: 'manufacturer must contain at least one non-whitespace character',
})
  manufacturer: string;


@IsOptional()
@IsString()
@Matches(/\S/, {
  message: 'imageUrl must contain at least one non-whitespace character',
})
imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}