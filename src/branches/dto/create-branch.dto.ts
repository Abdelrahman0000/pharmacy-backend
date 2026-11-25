import {IsNotEmpty , IsString , Matches } from 'class-validator';
export class CreateBranchDto {
@IsString()
@IsNotEmpty()
@Matches(/\S/,{
    message: 'name must contain at least one non-whitespace character',
})
name: string;

@IsString()
@IsNotEmpty()
@Matches(/\S/,{
    message: 'address must contain at least one non-whitespace character',
})
address: string;

}
