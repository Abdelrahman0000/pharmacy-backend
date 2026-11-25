
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { fromZonedTime } from 'date-fns-tz';

import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma, StockMovementType } from '../generated/prisma/client.js';

import { StockInDto } from './dto/stock-in.dto.js';
import { StockOutDto } from './dto/stock-out.dto.js';
import { FilterStockMovementsDto } from './dto/filter-stock-movements.dto.js';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  private egyptDateToUTC(date: string) {
    return fromZonedTime(
      `${date}T00:00:00`,
      'Africa/Cairo',
    );
  }

  async checkIfBranchIdAndBatchIdExist(
    branchId: number,
    batchId: number,
  ) {
    // 1. Check branch
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch || !branch.isActive) {
      throw new NotFoundException(
        'Branch not found or inactive',
      );
    }

    // 2. Check batch and its product
    const batch = await this.prisma.batch.findUnique({
      where: { id: batchId },
      include: {
        product: true,
      },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    if (!batch.product.isActive) {
      throw new BadRequestException(
        'Cannot process stock for an inactive product',
      );
    }

    // 3. Check if product is registered in this branch
    const branchProduct = await this.prisma.branchProduct.findUnique({
      where: {
        branchId_productId: {
          branchId,
          productId: batch.productId,
        },
      },
    });

    if (!branchProduct) {
      throw new BadRequestException(
        'Product is not registered in this branch',
      );
    }
  }

  async checkExistingInventoryQuantity(
    tx: Prisma.TransactionClient,
    branchId: number,
    batchId: number,
  ) {
    const checkInventory = await tx.inventory.findUnique({
      where: {
        branchId_batchId: {
          branchId,
          batchId,
        },
      },
    });

    if (!checkInventory) {
      return 0;
    }

    return checkInventory.quantity;
  }

  async stockIn(data: StockInDto) {
    const { branchId, batchId, quantity } = data;

    await this.checkIfBranchIdAndBatchIdExist(
      branchId,
      batchId,
    );

    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await this.prisma.$transaction(
          async (tx) => {
            const beforeQuantity =
              await this.checkExistingInventoryQuantity(
                tx,
                branchId,
                batchId,
              );

            const inventory = await tx.inventory.upsert({
              where: {
                branchId_batchId: {
                  branchId,
                  batchId,
                },
              },
              create: {
                branchId,
                batchId,
                quantity,
              },
              update: {
                quantity: {
                  increment: quantity,
                },
              },
            });

            const movement = await tx.stockMovement.create({
              data: {
                inventoryId: inventory.id,
                type: StockMovementType.STOCK_IN,
                quantityBefore: beforeQuantity,
                quantityAfter: beforeQuantity + quantity,
                quantity,
              },
            });

            return {
              inventory,
              movement,
            };
          },
          {
            isolationLevel:
              Prisma.TransactionIsolationLevel.Serializable,
          },
        );
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2034' &&
          attempt < maxAttempts
        ) {
          continue;
        }

        throw error;
      }
    }
  }

  async stockOut(data: StockOutDto) {
    const { branchId, batchId, quantity } = data;

    await this.checkIfBranchIdAndBatchIdExist(
      branchId,
      batchId,
    );

    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await this.prisma.$transaction(
          async (tx) => {
            const existingInventory = await tx.inventory.findUnique({
              where: {
                branchId_batchId: {
                  branchId,
                  batchId,
                },
              },
            });

            if (!existingInventory) {
              throw new NotFoundException(
                'Inventory record not found',
              );
            }

            const updateResult = await tx.inventory.updateMany({
              where: {
                branchId,
                batchId,
                quantity: {
                  gte: quantity,
                },
              },
              data: {
                quantity: {
                  decrement: quantity,
                },
              },
            });

            if (updateResult.count === 0) {
              throw new BadRequestException(
                'Insufficient stock',
              );
            }

            const updatedInventory =
              await tx.inventory.findUniqueOrThrow({
                where: {
                  branchId_batchId: {
                    branchId,
                    batchId,
                  },
                },
              });

            const movement = await tx.stockMovement.create({
              data: {
                inventoryId: updatedInventory.id,
                type: StockMovementType.STOCK_OUT,
                quantity,
                quantityBefore: existingInventory.quantity,
                quantityAfter: updatedInventory.quantity,
              },
            });

            return {
              updatedInventory,
              movement,
            };
          },
          {
            isolationLevel:
              Prisma.TransactionIsolationLevel.Serializable,
          },
        );
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2034' &&
          attempt < maxAttempts
        ) {
          continue;
        }

        throw error;
      }
    }
  }

  async deductQuantityFromInventory(
    tx: Prisma.TransactionClient,
    batchId: number,
    branchId: number,
    quantity: number,
  ) {
    const existingInventory = await tx.inventory.findUnique({
      where: {
        branchId_batchId: {
          branchId,
          batchId,
        },
      },
    });

    if (!existingInventory) {
      throw new NotFoundException(
        'Inventory record not found',
      );
    }

    const updateResult = await tx.inventory.updateMany({
      where: {
        branchId,
        batchId,
        quantity: {
          gte: quantity,
        },
      },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });

    if (updateResult.count === 0) {
      throw new BadRequestException('Insufficient stock');
    }

    const updatedInventory =
      await tx.inventory.findUniqueOrThrow({
        where: {
          branchId_batchId: {
            branchId,
            batchId,
          },
        },
      });

    return {
      inventory: updatedInventory,
      quantityBefore: existingInventory.quantity,
      quantityAfter: updatedInventory.quantity,
    };
  }

  async addQuantityToInventory(
    tx: Prisma.TransactionClient,
    batchId: number,
    branchId: number,
    quantity: number,
  ) {
    const inventory = await tx.inventory.upsert({
      where: {
        branchId_batchId: {
          branchId,
          batchId,
        },
      },
      create: {
        branchId,
        batchId,
        quantity,
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
    });

    return inventory;
  }

  async stockTransfer(
    sourceBranchId: number,
    destinationBranchId: number,
    batchId: number,
    quantity: number,
  ) {
    if (sourceBranchId === destinationBranchId) {
      throw new BadRequestException(
        'Source and destination branches must be different',
      );
    }

    // Validate source and destination branches
    await this.checkIfBranchIdAndBatchIdExist(
      sourceBranchId,
      batchId,
    );

    await this.checkIfBranchIdAndBatchIdExist(
      destinationBranchId,
      batchId,
    );

    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await this.prisma.$transaction(
          async (tx) => {
            const deductFromInventory =
              await this.deductQuantityFromInventory(
                tx,
                batchId,
                sourceBranchId,
                quantity,
              );

            const destinationBefore =
              await tx.inventory.findUnique({
                where: {
                  branchId_batchId: {
                    branchId: destinationBranchId,
                    batchId,
                  },
                },
              });

            const addToInventory =
              await this.addQuantityToInventory(
                tx,
                batchId,
                destinationBranchId,
                quantity,
              );

            const movementDeductTransaction =
              await tx.stockMovement.create({
                data: {
                  inventoryId:
                    deductFromInventory.inventory.id,
                  type: StockMovementType.TRANSFER_OUT,
                  quantity,
                  quantityBefore:
                    deductFromInventory.quantityBefore,
                  quantityAfter:
                    deductFromInventory.quantityAfter,
                },
              });

            const movementAddTransaction =
              await tx.stockMovement.create({
                data: {
                  inventoryId: addToInventory.id,
                  type: StockMovementType.TRANSFER_IN,
                  quantity,
                  quantityBefore:
                    destinationBefore?.quantity ?? 0,
                  quantityAfter: addToInventory.quantity,
                },
              });

            return {
              deductFromInventory,
              addToInventory,
              movementDeductTransaction,
              movementAddTransaction,
            };
          },
          {
            isolationLevel:
              Prisma.TransactionIsolationLevel.Serializable,
          },
        );
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2034' &&
          attempt < maxAttempts
        ) {
          continue;
        }

        throw error;
      }
    }
  }

  async findMovements(filters: FilterStockMovementsDto) {
    if (filters.startDate && filters.endDate) {
      if (filters.startDate > filters.endDate) {
        throw new BadRequestException(
          'Start date cannot be after end date',
        );
      }
    }

    const where: Prisma.StockMovementWhereInput = {};
    const inventoryWhere: Prisma.InventoryWhereInput = {};

    if (filters.branchId) {
      inventoryWhere.branchId = filters.branchId;
    }

    if (filters.batchId) {
      inventoryWhere.batchId = filters.batchId;
    }

    if (filters.branchId || filters.batchId) {
      where.inventory = {
        is: inventoryWhere,
      };
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};

      if (filters.startDate) {
        where.createdAt.gte = this.egyptDateToUTC(
          filters.startDate,
        );
      }

      if (filters.endDate) {
        const nextDay = new Date(
          `${filters.endDate}T00:00:00Z`,
        );

        nextDay.setUTCDate(nextDay.getUTCDate() + 1);

        const nextDayString = nextDay
          .toISOString()
          .slice(0, 10);

        where.createdAt.lt = this.egyptDateToUTC(
          nextDayString,
        );
      }
    }

    const skip = (filters.page - 1) * filters.limit;

    const [movements, total] = await this.prisma.$transaction([
      this.prisma.stockMovement.findMany({
        where,
        include: {
          inventory: {
            include: {
              branch: true,
              batch: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: filters.limit,
      }),

      this.prisma.stockMovement.count({
        where,
      }),
    ]);

    return {
      data: movements,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }
}
