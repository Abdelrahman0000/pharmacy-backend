import { IsInt, Min } from "class-validator";

export class StockOutDto{
@IsInt()
@Min(1,{message:"Branch ID must be a positive integer"})
branchId:number;


@IsInt()
@Min(1,{message:"Batch ID must be a positive integer"})
batchId:number;


@IsInt()
@Min(1, { message: 'Quantity must be greater than 0' })
quantity:number;
}