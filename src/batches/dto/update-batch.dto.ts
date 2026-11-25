import { IsString, Matches, IsDateString, IsOptional } from "class-validator";

export class UpdateBatchDto {
    

@IsOptional()
@IsString()
@Matches(/\S/,{
    message: 'batchNumber must contain at least one non-whitespace character',
})
  batchNumber :string
  @IsOptional()
  @IsDateString()
    expiryDate : string


}