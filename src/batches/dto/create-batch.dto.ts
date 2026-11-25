import { Min , IsInt, IsString, IsNotEmpty, Matches, IsDateString } from "class-validator";

export class CreateBatchDto {
@IsInt()
@Min(1, { message: "Product ID must be a positive integer" })
productId: number;

@IsString()
@IsNotEmpty()
@Matches(/\S/,{
    message: 'batchNumber must contain at least one non-whitespace character',
})
  batchNumber :string
  @IsNotEmpty()
  @IsDateString()
    expiryDate : string


}