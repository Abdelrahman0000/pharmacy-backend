import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBatchDto } from './dto/create-batch.dto.js';
import { Prisma } from '../generated/prisma/client.js';
import { UpdateBatchDto } from './dto/update-batch.dto.js';

@Injectable()
export class BatchesService {
    constructor(private readonly prisma:PrismaService) {}

    async findAll(){

        return await this.prisma.batch.findMany({
            include:{product:true}
        })
    }

async findOne(id:number){
    const result=await this.prisma.batch.findUnique({
        where:{id},
        include:{product:true}
    })
    if (!result){
        throw new NotFoundException('invalid Id')
    }
    return result;
}
async create(createBatchDto:CreateBatchDto){
    const product =await this.prisma.product.findFirst({
        where:{id:createBatchDto.productId,
            isActive:true
        }
    })
    if(!product){
        throw new NotFoundException(`the product is not found or not active`)
    }
    try{
return await this.prisma.batch.create({
    data:createBatchDto
})
    }
    catch (error) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
          ) {
            throw new ConflictException(
              'This product is already linked to this batch',
            );
          }
    
          throw error;
        }
}
async update(id:number,updateBatchDto:UpdateBatchDto){
    await this.findOne(id)
     
       if (Object.keys(updateBatchDto).length === 0) {
         throw new BadRequestException(
           'At least one field must be provided for update',
         );
       }
    try{
return await this.prisma.batch.update({
    where:{id:id},
    data:updateBatchDto
})
    }
    catch (error) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
          ) {
            throw new ConflictException(
              'This product is already linked to this batch',
            );
          }
    
          throw error;
        }
}
async remove(id:number){
    await this.findOne(id);
    return this.prisma.batch.delete({
        where:{id:id}
    })
}
}
