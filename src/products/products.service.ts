
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // Get active products
  async findAll() {
    return this.prisma.product.findMany({
      where: { isActive: true },
    });
  }

  // Get inactive products
  async findInactive() {
    return this.prisma.product.findMany({
      where: { isActive: false },
    });
  }

  // Get one product
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${id} not found`,
      );
    }

    return product;
  }

  // Create product
  async create(data: CreateProductDto) {
    try {
      return await this.prisma.product.create({
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'A product with this barcode already exists',
        );
      }

      throw error;
    }
  }

  // Update product
  async update(id: number, data: UpdateProductDto) {
    await this.findOne(id);

    try {
      return await this.prisma.product.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'A product with this barcode already exists',
        );
      }

      throw error;
    }
  }

  // Soft delete product
  async remove(id: number) {
    const product = await this.findOne(id);

    if (!product.isActive) {
      throw new NotFoundException(
        `Product with ID ${id} is already inactive`,
      );
    }

    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Reactivate product
  async activate(id: number) {
    const product = await this.findOne(id);

    if (product.isActive) {
      throw new ConflictException(
        `Product with ID ${id} is already active`,
      );
    }

    return this.prisma.product.update({
      where: { id },
      data: { isActive: true },
    });
  }
}
