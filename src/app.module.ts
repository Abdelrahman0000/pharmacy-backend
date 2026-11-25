import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductsModule } from './products/products.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { BranchesModule } from './branches/branches.module.js';
import { BranchProductsModule } from './branch-products/branch-products.module.js';
import { BatchesModule } from './batches/batches.module.js';
import { InventoryModule } from './inventory/inventory.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ProductsModule,
    BranchesModule,
    BranchProductsModule,
    BatchesModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}