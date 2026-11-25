
import {
    BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBranchProductDto } from './dto/create-branch-product.dto.js';
import { UpdateBranchProductDto } from './dto/update-branch-product.dto.js';

@Injectable()
export class BranchProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return (await this.prisma.branchProduct.findMany({
      include: {
        branch: true,
        product: true,
      },
    }));
  }

  async findOne(id: number) {
    const branchProduct = await this.prisma.branchProduct.findUnique({
      where: { id },
      include: {
        branch: true,
        product: true,
      },
    });

    if (!branchProduct) {
      throw new NotFoundException(
        `Branch Product with ID ${id} not found`,
      );
    }

    return branchProduct;
  }

  async create(createBranchProductDto: CreateBranchProductDto) {
    const branch = await this.prisma.branch.findFirst({
      where: {
        id: createBranchProductDto.branchId,
        isActive: true,
      },
    });

    if (!branch) {
      throw new NotFoundException(
        `Branch with ID ${createBranchProductDto.branchId} not found or not active`,
      );
    }

    const product = await this.prisma.product.findFirst({
      where: {
        id: createBranchProductDto.productId,
        isActive: true,
      },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${createBranchProductDto.productId} not found or not active`,
      );
    }

    try {
      return await this.prisma.branchProduct.create({
        data: createBranchProductDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'This product is already linked to this branch',
        );
      }

      throw error;
    }
  }
  
async update(
  id: number,
  updateBranchProductDto: UpdateBranchProductDto,
) {
  await this.findOne(id);

  if (Object.keys(updateBranchProductDto).length === 0) {
    throw new BadRequestException(
      'At least one field must be provided for update',
    );
  }

  return this.prisma.branchProduct.update({
    where: { id },
    data: updateBranchProductDto,
  });
}
async remove(id: number) {
    await this.findOne(id);
    return this.prisma.branchProduct.delete({
      where: { id },
    });
  
}
}
