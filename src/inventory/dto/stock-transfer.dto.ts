import { IsInt, Min } from "class-validator";

export class StockTransferDto{
@IsInt()
@Min(1,{message:"source Branch ID must be a positive integer"})
sourceBranchId:number;

@IsInt()
@Min(1,{message:"destination Branch ID must be a positive integer"})
destinationBranchId:number;

@IsInt()
@Min(1,{message:"Batch ID must be a positive integer"})
batchId:number;


@IsInt()
@Min(1, { message: 'Quantity must be greater than 0' })
quantity:number;
}