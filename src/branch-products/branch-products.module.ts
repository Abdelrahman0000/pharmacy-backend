import { Module } from '@nestjs/common';
import { BranchProductsService } from './branch-products.service.js';
import { BranchProductsController } from './branch-products.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [BranchProductsService],
  controllers: [BranchProductsController]
})
export class BranchProductsModule {}
